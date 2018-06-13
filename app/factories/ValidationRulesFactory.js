import FieldFunctionFactory from './FieldFunctionFactory';
import AbstractList from './AbstractList';

function ValidationRulesFactory () {

  //ValidationNestedRules[]
  //  ValidationRules[]
  //      ValidationRule

  //-------------------------------------
  //
  //      ValidationRules
  //
  //-------------------------------------

  function ValidationRules () {

      AbstractList.extend(this, createItemFactory, deleteNotify);

      function createItemFactory (fFunc) {

          var rule = new ValidationRule();

          rule.state = 'CREATED';
          rule.fieldFunction = FieldFunctionFactory.cloneField(fFunc);

          return rule;
      }

      function deleteNotify (rule) {

          rule.state = 'DELETED';

          return true;
      }
  }

  ValidationRules.prototype.hasInvalidFormErrors = function () {

      var invalidParam;

      this.listItems.some(function (ruleOrList) {

          invalidParam = ruleOrList.hasInvalidFormErrors();

          if (invalidParam) {
              return true;
          }
      });

      return invalidParam;
  };

  ValidationRules.prototype.toJson = function (varsObj) {

      var rulesList = [];

      this.listItems.map(function (ruleOrList) {

          var rawRule = ruleOrList.toJson(varsObj);

          if (rawRule) {
              rulesList.push(rawRule);
          }
      });

      return rulesList;
  };

  ValidationRules.prototype.toString = function () {

      var result = this.listItems.map(function (ruleOrList) {
          return ruleOrList.toString();
      });

      return '[' + result.join(', ') + ']';
  };

  //-------------------------------------
  //
  //      ValidationRule
  //
  //-------------------------------------


  function ValidationRule () {

      this.id = undefined;
      this.state = undefined;

      this.fieldId = undefined;
      this.fieldFunction = undefined;
  }

  ValidationRule.prototype.toString = function () {
      return 'Rule::' + this.fieldFunction.name;
  };

  ValidationRule.prototype.updateFieldId = function (id) {

      this.fieldId = id;

      if (this.fieldFunction) {
          this.fieldFunction.setParameterValueAt('@@' + id, 0);
      }
  };

  ValidationRule.prototype.updateFieldFunctionId = function (id) {

      this.fieldFunction = FieldFunctionFactory.cloneFieldById(id);

      if (this.fieldId) {
          this.updateFieldId(this.fieldId);
      }
  };

  ValidationRule.prototype.hasChanged = function () {

      if (this.state !== 'NOT_CHANGED' ||
          this.fieldId !== this.oldFieldId ||
          this.fieldValidationAction !== this.oldFieldValidationAction ||
          this.fieldFunction.id !== this.oldFieldFunctionId) {
          return true;
      }

      return this.fieldFunction.hasChanged();
  };

  ValidationRule.prototype.hasInvalidFormErrors = function () {

      if (this.state === 'DELETED') {
          return;
      }

      return this.fieldFunction.hasInvalidFormErrors();
  };

  ValidationRule.prototype.toJson = function (varsObj) {

      if (this.state === 'DELETED' && this.id === undefined) {
          return;
      }

      var rawRule = {};

      rawRule.mdmId = this.id;
      rawRule.mdmState = this.state;

      if (this.state === 'NOT_CHANGED' && this.hasChanged()) {
          rawRule.mdmState = 'UPDATED';
      }

      rawRule.mdmParameterValues = this.fieldFunction.toJson();
      rawRule.mdmInvert = this.fieldFunction.invert;
      rawRule.mdmFieldFunctionId = this.fieldFunction.id;
      rawRule.mdmFieldId = this.fieldId;
      rawRule.mdmFieldValidationAction = this.fieldValidationAction;
      rawRule.mdmEntityTemplateId = varsObj.dataModelId;

      return rawRule;
  };

  //-------------------------------------
  //
  //      FACTORY METHODS
  //
  //-------------------------------------

  function getClass () {
      return ValidationRules;
  }

  function createFromJson (rawDataList) {

      var cRulesList = new ValidationRules();

      if (rawDataList && rawDataList.length) {

          var listItems = rawDataList.map(createValidationRule);

          cRulesList.listItems = listItems;
      }

      return cRulesList;
  }

  function createValidationRule (rawData) {

      var inst = new ValidationRule();

      inst.id = rawData.mdmId;
      inst.state = rawData.mdmState;
      inst.fieldValidationAction = rawData.mdmFieldValidationAction;
      inst.oldFieldValidationAction = inst.fieldValidationAction;
      inst.fieldFunction = FieldFunctionFactory.cloneFieldFromRawData(rawData);
      inst.oldFieldFunctionId = inst.fieldFunction.id;

      //fieldId is first param in fieldFunction
      if (inst.fieldFunction.parameters && inst.fieldFunction.parameters.length) {
          inst.fieldId = inst.fieldFunction.parameters[0].getValue();
          inst.oldFieldId = inst.fieldId;
      }

      return inst;
  }

  return {
      getClass: getClass,
      createFromJson: createFromJson
  };
}

export default new ValidationRulesFactory();
