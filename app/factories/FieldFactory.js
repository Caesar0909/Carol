function FieldFactory (
  ArrayUtils,
  StringUtils,
  tsDataModelService,
  tsValidationRulesFactory,
  tsConstants,
  tsUser,
  $q
) {

  function Field () {

      this.id = undefined;
      this.label = undefined;
      this.urlName = undefined;
      this.description = undefined;
      this.type = undefined;
      this.mdmName = undefined;
      this.requiredBy = undefined;
      this.hasMapping = undefined;
      this.flagRules = undefined;
      this.skipRules = undefined;
      this.survivorshipRules = undefined;
      this.isNested = false;
      this.isObject = false;
      this.hasChildFields = false;
      this.hideChildFields = false;
      this.isSelected = false;
      this.isConsumed = true;
      this.isInternal = false;
      this.childFields = [];

  }

  var selectedField;

  Field.prototype.markAsSelected = function () {

      if (selectedField) {
          selectedField.isSelected = false;
      }

      selectedField = this;

      this.isSelected = true;
  };

  Field.prototype.getNestedFieldById = function (id) {
      return ArrayUtils.findItemByFieldValue(this.childFields, 'id', id);
  };

  Field.prototype.getNestedFieldByUrlName = function (name) {
      var deferred = $q.defer();

      var found = false;

      if (name) {
          this.childFields.some(function (field) {
              if (field.urlName === name) {
                  deferred.resolve(field);
                  found = true;

                  return true;
              }
          });
      }

      if (!found) {
          deferred.reject();
      }

      return deferred.promise;
  };

  Field.prototype.saveField = function (dataModel) {
      return (function (field) {

          var queryParams = {
              parentFieldId: field.parentIdPath
          };

          return tsDataModelService.updateEntityTemplateFieldValues(dataModel.id, field.id, field.toJson(), queryParams).then(
              function (rawDataResult) {
                  return dataModel.getParentFieldByUrlName(field.urlName).then(function (parentField) {
                      field.update(rawDataResult, parentField, dataModel.fieldMapByUrl);

                      return field;
                  });
              });

      })(this);
  };

  Field.prototype.toJson = function () {

      var lang = tsUser.language;
      var rawData = {};

      rawData.mdmId = this.id;
      rawData.mdmCustomLabel = {};
      rawData.mdmCustomDescription = {};

      rawData.mdmCustomLabel[lang] = this.label;
      rawData.mdmCustomDescription[lang] = this.description;

      rawData.mdmEnableAddressCleansing = this.enableAddressCleansing;

      if (this.childFields && this.childFields.length) {
          rawData.mdmFields = this.childFields.map(function (field) {
              return field.toJson();
          });
      }

      return rawData;
  };

  //PRIVATE


  Field.prototype.updateFieldFlagRules = function (rules) {
      this.flagRules = tsValidationRulesFactory.createFromJson(rules);
  };

  Field.prototype.updateFieldSkipRules = function (rules) {
      this.skipRules = tsValidationRulesFactory.createFromJson(rules);
  };

  Field.prototype.updateFieldSurvivorshipRules = function (rawSurvivorshipRules) {
      if (!rawSurvivorshipRules) {
          return;
      }

      var previousFieldFunction;

      this.survivorshipRules = rawSurvivorshipRules.map(processFSR, this);

      function processFSR (rawSurvivorshipRule, index) {

          var ruleParams = rawSurvivorshipRule.mdmParameterValues;
          var oldConnectorId = ruleParams && ruleParams.length ? ruleParams[0] : undefined;
          var oldParameter = oldConnectorId ? ruleParams[1] || tsConstants.SURVIVORSHIP_DEFAULT_PARAMETER : undefined;

          var fieldFunction = rawSurvivorshipRule.mdmFunction;
          var oldFieldFunction = {
              id: fieldFunction.mdmId,
              name: fieldFunction.mdmName,
              surviveUsingFieldName: rawSurvivorshipRule.mdmSurviveUsingFieldName
          };

          var keepFieldLabel = this.label;
          var keepFieldType = 0;
          var aggregationRule;

          var survivorshipRule;

          var ruleType = 'PRIMARY';

          if (previousFieldFunction) {
              if (previousFieldFunction && previousFieldFunction.name === 'FREQUENCY') {
                  ruleType = 'IF-FREQUENCY';
              }
              else if (previousFieldFunction.name === 'CONNECTOR') {
                  ruleType = 'NO-RECORDS';
              }
          }

          if (rawSurvivorshipRule.mdmAggregationMergeRules) {
              var rawAggregationRule = rawSurvivorshipRule.mdmAggregationMergeRules;

              rawAggregationRule.mdmAggregateChildFieldId = rawAggregationRule.mdmAggregateChildFieldId || [[]];

              aggregationRule = {
                  state: rawAggregationRule.mdmChildInstanceSurvivorshipRule ? 'UPDATED' : 'CREATED',
                  type: rawAggregationRule.mdmAggregationType, //MERGE_INSTANCES OR KEEP_ALL_INSTANCES
                  functionId: 'KEEP_ALL_INSTANCES',
                  functionName: 'KEEP_ALL_INSTANCES',
                  mergeRules: rawAggregationRule.mdmAggregateChildFieldId.map(function (items) {
                      return items.map(function (item) {
                          return { field: item };
                      });
                  })
              };

              if (rawAggregationRule.mdmAggregationType === 'MERGE_INSTANCES') {
                  var childRule = rawAggregationRule.mdmChildInstanceSurvivorshipRule;

                  aggregationRule.childId = childRule.mdmId;
                  aggregationRule.functionId = childRule.mdmFunctionId;
                  aggregationRule.functionName = childRule.mdmFunction ? childRule.mdmFunction.mdmName : '';
              }
          }

//                if (survivorshipRule) {
//                    keepFieldLabel = survivorshipRule.fieldLabel;
//                    keepFieldType = survivorshipRule.fieldType;
//                }

          survivorshipRule = {
              id: rawSurvivorshipRule.mdmId,
              index: index,
              state: rawSurvivorshipRule.mdmState,
              optionId: oldFieldFunction.id,
              ruleType: ruleType,
              surviveUsingFieldName: rawSurvivorshipRule.mdmSurviveUsingFieldName,
              fieldLabel: keepFieldLabel,
              fieldType: keepFieldType,
              oldConnectorId: oldConnectorId,
              connectorId: oldConnectorId,
              oldFieldFunction: oldFieldFunction,
              fieldFunctionId: oldFieldFunction.id,
              oldParameter: oldParameter,
              parameter: oldParameter,
              terminated: !!oldConnectorId,
              aggregationRule: aggregationRule
          };

          if (oldConnectorId) {
              survivorshipRule.optionId += '::' + oldConnectorId;
          }

          if (this.isNested) {
              survivorshipRule.fieldType = 1;

              if (survivorshipRule.fieldLabel.indexOf('(Nested)') === -1) {
                  survivorshipRule.fieldLabel += ' (Nested)';
              }
          }

          previousFieldFunction = oldFieldFunction;

          return survivorshipRule;

      }
  };

  ////FACTORY API

  function getClass () {
      return Field;
  }

  function createEmpty () {
      return new Field();
  }

  Field.prototype.update = function (rawData, parentField, fieldMap) {

      var lang = tsUser.language;
      var rawLabel = rawData.mdmLabel || rawData.mdmCustomLabel;
      var rawDescription = rawData.mdmDescription || rawData.mdmCustomDescription;
      var field = {};
      var oldField;

      field.id = rawData.mdmId;
      field.label = rawLabel[lang] || rawData.mdmName;
      field.mdmName = rawData.mdmName;

      field.description = rawDescription[lang];
      field.type = rawData.mdmMappingDataType;
      field.fieldType = rawData.mdmFieldType;

      field.hasMapping = rawData.mdmHasMapping;
      field.requiredBy = rawData.mdmRequiredBy;
      field.isInternal = rawData.mdmInternalField;
      field.isNested = rawData.mdmMappingDataType === 'NESTED';
      field.isObject = rawData.mdmMappingDataType === 'OBJECT';
      field.hasChildFields = field.isNested || field.isObject;
      field.enableAddressCleansing = rawData.mdmEnableAddressCleansing;
      field.isNestedChild = false;

      if (parentField) {
          field.parentIdPath = parentField.parentIdPath ? parentField.parentIdPath + '.' + parentField.id : parentField.id;
          field.labelPath = parentField.labelPath + '.' + field.label;
          field.mdmNamePath = parentField.mdmNamePath + '.' + field.mdmName;
          field.idPath = parentField.idPath + '.' + field.id;
          field.parentName = parentField.label;
          field.isNestedChild = true;
      }
      else {
          field.parentIdPath = '';
          field.labelPath = field.label; //Used by Relationship Links
          field.mdmNamePath = field.mdmName;
          field.idPath = field.id;
      }

      field.urlName = StringUtils.urlSafeName(field.mdmNamePath);

      if (fieldMap) {
          oldField = fieldMap[field.mdmNamePath];

          fieldMap[field.mdmNamePath] = this;
      }

      if (oldField) {
          angular.extend(this, oldField, field);
      }
      else {
          angular.extend(this, field);
      }
  };

  function createFromJson (rawData, parentField, fieldMap) {

      var field = new Field();
      var rawField = rawData.field;

      field.flagRules = tsValidationRulesFactory.createFromJson();
      field.skipRules = tsValidationRulesFactory.createFromJson();
      field.updateFieldSurvivorshipRules(rawData.survivorshipRules);

      field.update(rawField, parentField, fieldMap);

      if (field.isNested || field.isObject) {
          field.childFields = createListFromJson(rawField.mdmFields, rawField.mdmFieldsFull, fieldMap, field);
      }

      return field;
  }

  function createListFromJson (rawFields, rawFieldsFullMap, fieldMap, parentField) {
      return $processNestedFields(rawFields, rawFieldsFullMap, fieldMap, parentField);
  }

  function $processNestedFields (rawFields, rawFieldsFullMap, fieldMap, parentField) {
      return rawFields.map(function (rawField) {

          var field = new Field();

          field.update(rawField, parentField, fieldMap);

          if (field.hasChildFields) {

              if (rawFieldsFullMap) {

                  var rawFieldsFull = rawFieldsFullMap[field.mdmName] || {};

                  rawField.mdmFields = rawFieldsFull.mdmFields || rawField.mdmFields;
                  rawField.mdmFieldsFull = rawFieldsFull.mdmFieldsFull || {};
              }

              field.childFields = $processNestedFields(rawField.mdmFields, rawField.mdmFieldsFull, fieldMap, field);
          }

          field.updateFieldSurvivorshipRules(rawField.mdmFieldSurvivorshipRules);
          field.updateFieldSkipRules(rawField.mdmSkipRules);
          field.updateFieldFlagRules(rawField.mdmFlagRules);

          return field;
      }).filter(function (field) {
          return !field.isInternal;
      });
  }

  function resetSelected () {

      if (selectedField) {
          selectedField.isSelected = false;
      }
  }

  return {
      getClass: getClass,
      createEmpty: createEmpty,
      createFromJson: createFromJson,
      createListFromJson: createListFromJson,
      resetSelected: resetSelected
  };
}

export default new FieldFactory();
