function MergeRulesFactory () {

  function MergeRule () {

      this.id = undefined;
      this.isParentRule = undefined;
      this.parentRule = undefined;
      this.state = undefined;
      this.type = 'MERGE';
      this.fieldIdPath = undefined;
      this.oldFieldIdPath = undefined;
      this.thresholdValue = undefined;
      this.fieldValue = undefined;
      this.considerEmpty = false;
      this.mdmName = undefined;
      this.oldThresholdValue = undefined;
      this.oldFieldValue = undefined;
      this.oldType = undefined;
  }

  MergeRule.prototype.toJson = function () {

  };

  //-------------------------------------
  //
  //    FACTORY METHODS
  //
  //-------------------------------------

  function createFromJson (rawDataList, fieldMap) {

      if (!rawDataList) {
          return [];
      }

      return rawDataList.map(function (rawDataRecords) {

          var recordRules = [];
          var parentRule;

          rawDataRecords.map(function (rawDataRule) {

              var rawField = fieldMap[rawDataRule.mdmMasterFieldId];
              var oldField;
              var masterFieldIsNested = rawDataRule.mdmMasterFieldId.indexOf('.') > 0;

              if (!rawField && masterFieldIsNested) {
                  var fieldMapId = rawDataRule.mdmMasterFieldId.split('.').pop();

                  rawField = fieldMap[fieldMapId];
              }

              if (rawField) {
                  oldField = rawField;
              }
              else {
                  oldField = {
                      idPath: undefined,
                      mdmName: undefined
                  };
              }

              var mergeRule = new MergeRule();

              mergeRule.id = rawDataRule.mdmId;
              mergeRule.state = rawDataRule.mdmState;
              mergeRule.fieldIdPath = oldField.idPath;
              mergeRule.considerEmpty = rawDataRule.mdmConsiderEmpty;
              mergeRule.mdmName = oldField.mdmName;
              mergeRule.fieldValue = rawDataRule.mdmMasterFieldValue;

              if (rawDataRule.mdmMergeType === 'EXACT_MATCH') {
                  mergeRule.type = 'MERGE';
                  mergeRule.thresholdValue = '100';
              }
              else {
                  var fuzzyConfig = rawDataRule.mdmFuzzyConfiguration || {};

                  if (fuzzyConfig.mdmAutomaticThreshold) {
                      mergeRule.thresholdValue = fuzzyConfig.mdmAutomaticThreshold.toString();
                      mergeRule.type = 'MERGE';
                  }
                  else {
                      mergeRule.thresholdValue = fuzzyConfig.mdmRecommendationThreshold ? fuzzyConfig.mdmRecommendationThreshold.toString() : '100';
                      mergeRule.type = 'RECOMMEND';
                  }
              }

              if (masterFieldIsNested && !parentRule) {
                  mergeRule.isParentRule = true;
                  parentRule = mergeRule;
              }
              else if (masterFieldIsNested && parentRule) {
                  mergeRule.parentRule = parentRule;
                  parentRule = undefined;
              }
              else if (parentRule) {
                  parentRule = undefined;
              }

              mergeRule.oldFieldIdPath = oldField.idPath;
              mergeRule.oldThresholdValue = mergeRule.thresholdValue;
              mergeRule.oldFieldValue = mergeRule.fieldValue;
              mergeRule.oldType = mergeRule.type;

              recordRules.push(mergeRule);
          });

          return recordRules;
      });
  }

  return {
      createFromJson: createFromJson
  };
}

export default new MergeRulesFactory();
