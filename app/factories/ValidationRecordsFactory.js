import tsValidationRulesFactory from './ValidationRulesFactory';
import AbstractList from './AbstractList';

function ValidationRecordsFactory () {


  var ValidationRules = tsValidationRulesFactory.getClass();

  function ValidationRecords () {

      AbstractList.extend(this, createItemFactory, deleteNotify);

      function createItemFactory (fFunc) {

          var rulesList = new ValidationRules();

          rulesList.addItemAt(fFunc);

          return rulesList;
      }

      function deleteNotify (rules) {
          rules.listItems.map(function (rule) {
              rule.state = 'DELETED';
          });

          return true;
      }
  }

  ValidationRecords.prototype = Object.create(ValidationRules.prototype);

  //-------------------------------------
  //
  //      FACTORY METHODS
  //
  //-------------------------------------

  function createFromJson (rawDataList) {

      var cRules = new ValidationRecords();

      if (rawDataList && rawDataList.length) {

          var listItems = rawDataList.map(tsValidationRulesFactory.createFromJson);

          cRules.listItems = listItems;
      }

      return cRules;
  }

  return {
      createFromJson
  };
}

export default new ValidationRecordsFactory();
