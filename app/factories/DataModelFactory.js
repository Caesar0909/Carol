/*
import tsConstants from '../constants';

const ENTITY_TEMPLATE_TYPE_ICONS = {
    location: 'hourglass-arrows',
    organization: 'building',
    people: 'person-negative',
    person: 'person-negative',
    product: 'box',
    transaction: 'hourglass-arrows'
};

function rebuildFlatFields (dataModel) {
  var result = [];
  var depth = 0;
  var emptyObj = {};

  traverseNestedCollection(null, dataModel.fields);

  function traverseNestedCollection (parent, childFields) {

      childFields.forEach(
          function (field) {

              field.depth = depth;
              field.parentField = parent || emptyObj;

//                        if (parent) {
//                            field.parentIdPath = parent.idPath;
//                            field.labelPath = parent.labelPath + '.' + field.label;
//                            field.mdmNamePath = parent.mdmNamePath + '.' + field.mdmName;
//                            field.idPath = parent.idPath + '.' + field.id;
//                            field.parentName = parent.label;
//                        }
//                        else {
//                            field.parentIdPath = '';
//                            field.labelPath = field.label;
//                            field.mdmNamePath = field.mdmName;
//                            field.idPath = field.id;
//                        }
//
//                        field.urlName = StringUtils.urlSafeName(field.mdmNamePath);

              result.push(field);

              if (field.hasChildFields) {
                  depth++;
                  traverseNestedCollection(field, field.childFields);
                  depth--;
              }
          });
  }

  dataModel.flatFields = result;

  // populating indexes to be used on delta
  dataModel.flatFields.forEach(function (field, index) {
      field.index = index;
  });
}

class DataModel {
  constructor () {
    this.id = undefined;
    this.name = undefined;
    this.urlName = undefined;
    this.label = undefined;
    this.description = undefined;
    this.tenantId = undefined;
    this.lastUpdated = undefined;
    this.lastPublished = undefined;
    this.profileTitleFields = undefined;
    this.geocodeEnabled = undefined;
    this.statusLabel = undefined;
    this.isPartial = true;
    this.stats = {
        numPublishedFields: undefined,
        numDraftMapping: undefined,
        numMergeRules: undefined,
        numRejectionRules: undefined,
        numFlagRules: undefined,
        numSkipRules: undefined
    };

    this.fields = [
        {
            id: undefined,
            label: undefined,
            description: undefined,
            type: undefined,
            flagRules: undefined,
            skipRules: undefined,
            survivorshipRules: undefined
        }
    ];

    this.flatFields = undefined;

    this.fieldMapById = {};
    this.fieldMapByUrl = {};
    this.fieldMapByName = {};

    this.skipRules = undefined;
    this.flagRules = undefined;
    this.mergeRules = undefined;

    this.publishedExists = undefined;
    this.entitySpace = undefined;
  }

  markAsWorkingCopy (value) {

    if (value === undefined) {
        value = true;
    }
    this.entitySpace = value ? tsConstants.ENTITY_SPACE_WORKING : tsConstants.ENTITY_SPACE_PUBLISHED;

    this.statusLabel = 'Draft';

    if (this.hasBeenPublished()) {
        this.statusLabel = this.isPublished() ? 'Published' : 'Published with draft';
    }
  }

  isPublished () {
    return this.entitySpace === tsConstants.ENTITY_SPACE_PUBLISHED;
  }

  isGolden () {
    return false;
  }

  hasBeenPublished () {
    return this.publishedExists;
  }

  markAsDirty (value) {
    return tsUser.markAsDirty(value);
  }

  updateProfileTitleFields (titles) {
    return (function (dataModel) {
        return tsDataModelService.updateProfileTitleFields(dataModel.id, titles).then((result) => {
            dataModel.profileTitleFields = titles;
            dataModel.markAsWorkingCopy();

            return result;
        });

    })(this);
  }

  createField (possibleField, parentField) {
    return (function (dataModel) {
        //Create Field and Add it to this DataModel
        return tsDataModelService.createField(possibleField.toJson()).then((result) => {

            possibleField.update(result);

            return dataModel.addFieldToTheTemplate(possibleField, parentField);
        });

    })(this);
  };

  addFieldToTheTemplate (possibleField, parentField) {
    return (function (dataModel) {
        var queryParams = {
            parentFieldId: parentField ? parentField.idPath : ''
        };

        return tsDataModelService.addFieldToTheTemplate(dataModel.id, possibleField.id, queryParams).then(
            (rawData) => {
                var field = FieldFactory.createFromJson(rawData, parentField, dataModel.fieldMapByUrl);

                if (parentField) {
                    parentField.childFields.push(field);
                }
                else {
                    dataModel.fields.push(field);
                }

                dataModel.fieldMapById[field.idPath] = field;
                dataModel.fieldMapByUrl[field.urlName] = field;
                dataModel.fieldMapByName[field.mdmNamePath] = field;
                dataModel.markAsWorkingCopy();

                rebuildFlatFields(dataModel);

                return field;
            });

      })(this);
  }

  getFieldById (id) {
    return this.fieldMapByUrl[id];
  }

  lookupFieldByName (mdmNamePath) {
    return this.fieldMapByName[mdmNamePath];
  }

  getParentFieldByUrlName (urlName) {

    if (urlName.indexOf('.') > 0) {
        var parentUrl = urlName.split('.');

        parentUrl.pop();

        parentUrl = parentUrl.join('.');

        return this.getFieldByUrlName(parentUrl);
    }

    return Promise.resolve();
  }

  getFieldByUrlName  (urlName) {
    return new Promise((resolve, reject) => {

      if (this.fieldMapByUrl[urlName]) {
        resolve(this.fieldMapByUrl[urlName]);
      }
      else {
        reject();
      }
    });
  }

  rebuildFieldMap () {

      this.fieldMapById = {};
      this.fieldMapByUrl = {};
      this.fieldMapByName = {};

      this.flatFields.forEach((field) => {
          this.fieldMapByUrl[field.urlName] = field;
          this.fieldMapById[field.idPath] = field;
          this.fieldMapByName[field.mdmNamePath] = field;
      });
  }

  removeField = function (field, parentField) {
    return (function (dataModel) {

        var queryParams = {
            parentFieldId: parentField ? parentField.idPath : ''
        };

        return tsDataModelService.deleteEntityTemplateField(dataModel.id, field.id, queryParams).then(
            (result) => {

                if (result && result.success) {

                    var fields = parentField ? parentField.childFields : dataModel.fields;
                    var index = fields.indexOf(field);

                    fields.splice(index, 1);

                    rebuildFlatFields(dataModel);
                    dataModel.rebuildFieldMap();
                    dataModel.markAsWorkingCopy();
                    dataModel = null;
                }

                return result;
            });

    })(this);
  }

  update (rawData) {

    //Is this descriptor of full DataModel
    this.isPartial = rawData.mdmFields && rawData.mdmFields.length && rawData.mdmFieldsFull &&
        !rawData.mdmFieldsFull[rawData.mdmFields[0].mdmName];

    this.lastUpdated = rawData.mdmLastUpdated;
    this.lastPublished = rawData.mdmLastPublished;
    this.geocodeEnabled = rawData.mdmGeocodeEnabled;

    if (rawData.mdmPublishedExists !== undefined) {
        this.publishedExists = rawData.mdmPublishedExists;
        this.entitySpace = rawData.mdmEntitySpace;
    }
    else {
        this.markAsWorkingCopy();
    }

    if (rawData.mdmFields) {

        this.fields = FieldFactory.createListFromJson(rawData.mdmFields, rawData.mdmFieldsFull, this.fieldMapByUrl);

        rebuildFlatFields(this);
        this.rebuildFieldMap();
    }

    if (rawData.mdmEntityValidationRules) {
        this.validationRules = tsValidationRecordsFactory.createFromJson(rawData.mdmEntityValidationRules);
    }

    if (rawData.mdmFieldMergeRules) {
        this.mergeRules = tsMergeRulesFactory.createFromJson(rawData.mdmFieldMergeRules, this.fieldMapById);
    }

    this.statusLabel = 'Draft';

    if (this.hasBeenPublished()) {
        this.statusLabel = this.isPublished() ? 'Published' : 'Published with draft';
    }

    this.stats.numPublishedFields = this.flatFields.length;
    this.stats.numDraftMapping = 0;
    this.stats.numMergeRules = rawData.mdmFieldMergeRuleIds.length;
    this.stats.numRejectionRules = rawData.mdmEntityValidationRuleIds.length;
    this.stats.numFlagRules = 0;
    this.stats.numSkipRules = 0;

    if (rawData.mdmFields[0] && rawData.mdmFields[0].mdmFlagRuleIds) {
        rawData.mdmFields.forEach(function (rawField) {
            this.stats.numFlagRules += rawField.mdmFlagRuleIds.length;
            this.stats.numSkipRules += rawField.mdmSkipRuleIds.length;
        }, this);
    }

    return this;

  };

  updateBasicInfo () {

    if (this.mdmVerticals) {
        this.mdmVerticals[0] = this.segmentId;
    }

    var body = {
        mdmDescription: {},
        mdmLabel: {},
        mdmGroupName: this.groupName,
        mdmEntityTemplateTypeIds: [this.typeId],
        mdmVerticalIds: this.mdmVerticals
    };

    body.mdmLabel[tsUser.language] = this.label;
    body.mdmDescription[tsUser.language] = this.description || '';

    return tsDataModelService.updateEntityTemplate(this.id, body).then(() => {
        this.markAsWorkingCopy();
    });
  };

  toggleHideChildFields (field) {
    field.hideChildFields = !field.hideChildFields;

    rebuildFlatFields(this);
  };

}

class DataModelFactory {
  static getFieldsAsSourceFields (fields) {
      var allFields = [];
      var mapProperties = {};
      var nestedFields = [];

      recursivelyAddSourceFields('', '', fields);

      ArrayUtils.sortBy(allFields, 'label', ArrayUtils.SORT_CASE_INSENSITIVE);

      return {
          map: mapProperties,
          list: allFields,
          nestedFields: nestedFields
      };

      function recursivelyAddSourceFields (parentName, parentLabel, parentFields) {

          parentFields.forEach(function (field) {

              var name = field.mdmName;
              var complex = false;
              var namePath = name;
              var labelPath = field.label;
              var index;

              var isNestedChild = parentName !== '';

              if (isNestedChild) {
                  namePath = parentName + '.' + namePath;
                  labelPath = parentLabel + '.' + labelPath;
                  complex = true;
              }

              var sField = { label: namePath, displayLabel: labelPath, type: field.type, complex: complex, isNestedChild: isNestedChild };

              sField.description = sField.label + ' :: ' + sField.type;
              sField.keywords = sField.label + ',' + (sField.label.indexOf('-') > -1 ? sField.label.replace(/-/g, '') + ',' : '') + sField.type;
              sField.id = sField.label + '::' + sField.type;
              sField.isNested = field.isNested;

              mapProperties[namePath] = sField;

              if (field.hasChildFields) {
                  nestedFields.push(namePath);
                  index = allFields.length;
                  recursivelyAddSourceFields(namePath, labelPath, field.childFields);
                  sField.childFields = allFields.slice(index, allFields.length);
              }
              else {
                  allFields.push(sField);
              }

          });
      }
  }

  static getClass () {
      return DataModel;
  }

  static createFromJson (rawData) {

      var dataModel = new DataModel();

      var lang = tsUser.language;

      dataModel.id = rawData.mdmId;
      dataModel.name = rawData.mdmName;
      dataModel.label = rawData.mdmLabel[lang];
      dataModel.urlName = StringUtils.urlSafeName(dataModel.name);
      dataModel.groupName = rawData.mdmGroupName;
      dataModel.description = rawData.mdmDescription[lang];
      dataModel.tenantId = rawData.mdmTenantId;
      dataModel.profileTitleFields = rawData.mdmProfileTitleFields;
      dataModel.transactionDataModel = rawData.mdmTransactionDataModel;

      if (rawData.mdmEntityTemplateType && rawData.mdmEntityTemplateType.length) {
          dataModel.type = rawData.mdmEntityTemplateType[0].mdmName;
          dataModel.typeId = rawData.mdmEntityTemplateTypeIds[0];
      }

      if (rawData.mdmVerticalIds && rawData.mdmVerticalIds.length) {
          dataModel.mdmVerticals = rawData.mdmVerticalIds;
          dataModel.segmentId = rawData.mdmVerticalIds[0];
      }

      dataModel.icon = ENTITY_TEMPLATE_TYPE_ICONS[dataModel.type] || 'default';

      dataModel.update(rawData);

      return dataModel;
  }
}

export default DataModelFactory;
*/
