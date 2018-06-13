import tsMdmService from 'totvslabs-ui-framework/react-native/rest/services/mdm.service.js';
import tsDataModelService from 'totvslabs-ui-framework/react-native/rest/services/dataModel.service.js';

import LocaleValueFactory from './LocaleValueFactory';
import QueryBuilder from './QueryBuilder';
import tsConstants from '../constants';

function RecordStatsFactory () {
  function RecordStats () {

  }

  RecordStats.prototype.init = function () {

      this.allRecords = LocaleValueFactory.createFromValue(0);
      this.goldenRecords = LocaleValueFactory.createFromValue(0);
      this.flaggedRecords = LocaleValueFactory.createFromValue(0);
      this.rejectedRecords = LocaleValueFactory.createFromValue(0);
      this.mergedRecords = LocaleValueFactory.createFromValue(0);
      this.newRecords = LocaleValueFactory.createFromValue(0);
      this.updatedRecords = LocaleValueFactory.createFromValue(0);
      this.potentialMerge = LocaleValueFactory.createFromValue(0);
      //this.stagingRecords = LocaleValueFactory.createFromValue(0);
  };

  RecordStats.prototype.getGoldenEntityStats = function (entity, query) {

      var qb = QueryBuilder.create().entity(entity.name).area('Golden').query(query);

      return runQueryStats(qb, query, this, entity.id);
  };

  RecordStats.prototype.getGlobalStats = function (query) {

      var qb = QueryBuilder.create().query(query);

      return runQueryStats(qb, query, this);
  };

  RecordStats.prototype.forEach = function (functor) {

      functor('Golden', this.goldenRecords);
      functor('Flagged', this.flaggedRecords);
      functor('Merged', this.mergedRecords);
      functor('Rejected', this.rejectedRecords);
  };

  RecordStats.prototype.hasChangedFrom = function (stats) {
      return this.allRecords.value !== stats.allRecords.value ||
          this.goldenRecords.value !== stats.goldenRecords.value ||
          this.flaggedRecords.value !== stats.flaggedRecords.value ||
          this.rejectedRecords.value !== stats.rejectedRecords.value ||
          this.mergedRecords.value !== stats.mergedRecords.value ||
          this.newRecords.value !== stats.newRecords.value ||
          this.updatedRecords.value !== stats.updatedRecords.value ||
          this.potentialMerge.value !== stats.potentialMerge.value;
  };

  RecordStats.prototype.clone = function () {

      var result = new RecordStats();

      result.allRecords = this.allRecords.clone();
      result.goldenRecords = this.goldenRecords.clone();
      result.flaggedRecords = this.flaggedRecords.clone();
      result.rejectedRecords = this.rejectedRecords.clone();
      result.mergedRecords = this.mergedRecords.clone();
      result.newRecords = this.newRecords.clone();
      result.updatedRecords = this.updatedRecords.clone();
      result.potentialMerge = this.potentialMerge.clone();
      result.lastUpdated = this.lastUpdated;

      return result;
  };

  function runQueryStats (qb, query, stats, id) {

      return new Promise((resolve, reject) => {
        var body = [
          qb.golden().body(),
          qb.flagged().body(),
          qb.newest(tsConstants.NEW_RECORDS_TIME_OFFSET).body(),
          qb.updated(tsConstants.UPDATED_RECORDS_TIME_OFFSET).body()
        ];

        if (id) {
            body.push(qb.potentialMerges(id).body());
            body.push(qb.rejected(id).body());
        }

        tsMdmService.processFreeformStatisticsQuery(body)
            .then(function (result) {

                parseStatsResult(stats, result);

                if (id) {
                    var queryParams = query ? {filter: 'nested mdmGoldenFieldAndValues (mdmGoldenFieldAndValues.* pco "' + query + '")'} : undefined;

                    tsDataModelService.getMergesCountForTheGoldenRecord(id, queryParams).then(function (mergeResult) {

                        stats.mergedRecords = mergeResult.count;

                        resolve(stats);
                    });
                }
                else {
                    stats.mergedRecords = '?';

                    resolve(stats);
                }
            });
      });
  }

  function parseStatsResult (stats, result) {

      stats.allRecords = result[0] + result[4];
      stats.goldenRecords = result[0];
      stats.flaggedRecords = result[1];
      stats.newRecords = result[2];
      stats.updatedRecords = result[3];
      stats.potentialMerge = result[4];
      stats.rejectedRecords = result[5];
      stats.lastUpdated = new Date();

      //if (TEST_SELECTOR < 1 && result[0] > 0) {
      //  if (stats.potentialMerge.value === 0) {
      //      TEST_SELECTOR++;
      //      stats.potentialMerge.value = 3;
      //  }
      //}

      //if (result.length > 5) {
      //  this.stagingRecords = LocaleValueFactory.createFromValue(result[5]);
      //}
  }

  function create () {
      return new RecordStats();
  }

  return {
      create
  };
}

export default new RecordStatsFactory();
