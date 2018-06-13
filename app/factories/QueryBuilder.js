function QueryBuilderFactory () {

  function QueryBuilder () {
      this._body = {};
      this._entity = null;
      this._query = null;
      this._area = null;
      this._AND = ' AND ';
  }

  function buildType (qb) {
      if (qb._entity && qb._area) {
          qb._body.type = qb._entity + qb._area;
      }
  }

  QueryBuilder.prototype.entity = function (e) {
      this._entity = e;

      return this;
  };

  QueryBuilder.prototype.area = function (a) {
      this._area = a;

      return this;
  };

  QueryBuilder.prototype.golden = function () {
      this._area = 'Golden';
      buildType(this);

      return this;
  };

  QueryBuilder.prototype.type = function (t) {
      this._body.type = t;

      return this;
  };

  QueryBuilder.prototype.index = function (a) {
      this._body.index = a;

      return this;
  };

  QueryBuilder.prototype.newest = function (offset) {
      buildType(this);
      this._body.filter = '(mdmCreated ge "' + timeOffsetToISO(offset) + '")';

      return this;
  };

  QueryBuilder.prototype.updated = function (offset) {
      buildType(this);
      this._body.filter = '(mdmCreated lt "' + timeOffsetToISO(offset) + '") and (mdmLastUpdated ge "' + timeOffsetToISO(offset) + '")';

      return this;
  };

  QueryBuilder.prototype.flagged = function () {
      buildType(this);
      this._body.filter = '(mdmFlaggedFieldIds pr)';

      return this;
  };

  QueryBuilder.prototype.merged = function () {
      buildType(this);
      this._body.filter = '(mdmMasterCount gt "1")';

      return this;
  };

  QueryBuilder.prototype.rejected = function (id) {
      this._body.type = this._entity + 'Rejected';
      this._body.index = 'STAGING';
      if (id) {
          this._body.filter = '(mdmEntityTemplateId eq "' + id + '")';
      }

      return this;
  };

  QueryBuilder.prototype.potentialMerges = function (id) {
      this._body.type = 'GOLDEN_RECORD_MERGE';
      this._body.filter = '(mdmEntityTemplateId eq "' + id + '"' + this._AND + 'mdmMergeState eq "PENDING"' + this._AND + 'mdmMergeType eq "RECOMMENDED")';

      return this;
  };

  QueryBuilder.prototype.potentialMergesJoin = function (id) {
      this._body.type = 'GOLDEN_RECORD_MERGE';
      this._body.filter = '(mdmEntityTemplateId eq "' + id + '"' + this._AND + 'mdmMergeState eq "PENDING"' + this._AND + 'mdmMergeType eq "RECOMMENDED")';
      this._body.joinType = this._entity + 'Golden';
      this._body.joinSource = 'mdmTargetGoldenRecordId';
      this._body.joinTarget = 'mdmId';
      this._body.joinInner = true;
      this._body.joinConcat = true;

      return this;
  };

  QueryBuilder.prototype.errors = function (filterRules) {

      var filter = filterRules.errors || null;

      if (!filter) {
          return this;
      }

      var rules = Object.keys(filter).reduce(function (arr, rule) {
          var value = filter[rule];
          var query;

          if (value.toString() === '-1') {
              return arr;
          }

          if (rule === 'errorId') {
              query = 'mdmErrors.mdmRule.mdmId';
          }
          else if (rule === 'connectorId') {
              query = 'mdmStagingConnectorId';
          }
          else {
              return arr;
          }

          arr.push(query + ' eq "' + value + '"');

          return arr;
      }, []).join(this._AND);

      this._body.filter = this._body.filter || '';

      if (this._body.filter && rules) {
          rules = this._AND + rules;
      }

      this._body.filter += rules;

      return this;
  };

  QueryBuilder.prototype.activity = function (filterRules) {

      var filter = filterRules.others.activity;

      if (filter && filter.toString() === '-1') {
          return this;
      }

      this._body.filter = filter.split('|').reduce(function (arr, activity) {
          arr.push('nested mdmGoldenFieldAndValues.mdmmainactivity (mdmGoldenFieldAndValues.mdmmainactivity.mdmactivitycode.raw eq "' + activity + '")');

          return arr;
      }, []).join(this._AND);

      return this;
  };

  QueryBuilder.prototype.map = function (name, value) {
      if (name && value) {
          if (!angular.isArray(value) || value.length) {
              this._body[name] = value;
          }
      }

      return this;
  };

  QueryBuilder.prototype.query = function (q) {
      this._query = q;

      return this;
  };

  QueryBuilder.prototype.body = function () {

      if (this._query) {

          var concatQuery;
          var isHashed = this._query.indexOf('#') === 0;
          var effectiveQuery = isHashed ? this._query.substring(1) : this._query;

          // reusable parts
          var crosswalkQuery = 'nested mdmCrosswalk.mdmCrossreference (mdmCrosswalk.mdmCrossreference.* pco "' + effectiveQuery + '")';
          var idQuery = 'mdmId eq "' + effectiveQuery + '"';
          var masterQuery = 'nested mdmMasterFieldAndValues (mdmMasterFieldAndValues.* pco "' + effectiveQuery + '")';
          var goldenQuery = 'nested mdmGoldenFieldAndValues (mdmGoldenFieldAndValues.* pco "' + effectiveQuery + '")';
          var allQuery = '_all co "' + effectiveQuery + '"';

          if (this._body.index === 'STAGING') {
              if (this._body.type !== undefined && this._body.type.endsWith('Rejected')) {
                  if (isHashed) {
                      concatQuery = '(' + idQuery + ' OR ' + crosswalkQuery + ')';
                  }
                  else {
                      concatQuery = '(' + idQuery + ' OR ' + masterQuery + ' OR ' + crosswalkQuery + ')';
                  }
              }
              else {
                  concatQuery = '(' + allQuery + ')';
              }
          }
          else if (this._body.type !== undefined && this._body.type.endsWith('Master')) {
              if (isHashed) {
                  concatQuery = '(' + idQuery + ' OR ' + crosswalkQuery + ')';
              }
              else {
                  concatQuery = '(' + idQuery + ' OR ' + masterQuery + ' OR ' + crosswalkQuery + ')';
              }
          }
          else if (isHashed) {
              concatQuery = '(' + idQuery + ' OR ' + crosswalkQuery + ')';
          }
          else {
              concatQuery = '(' + idQuery + ' OR ' + goldenQuery + ' OR ' + crosswalkQuery + ')';
          }

          if (this._body.joinConcat) {

              if (this._body.joinFilter) {
                  this._body.joinFilter = this._body.filter + this._AND + concatQuery;
              }
              else {
                  this._body.joinFilter = concatQuery;
              }

          }
          else if (this._body.filter) {
              this._body.filter = this._body.filter + this._AND + concatQuery;
          }
          else {
              this._body.filter = concatQuery;
          }
      }
      else if (this._body.type === undefined && this._body.filter === undefined) {
          this._body.filter = '_all pr';
      }

      var result = this._body;

      this._body = {};

      return result;
  };

  function timeOffsetToISO (offset) {
      var date = new Date(Date.now() - (offset || 0));

      return date.toISOString();
  }

  function create () {
      return new QueryBuilder();
  }

  return {
      create
  };
}

export default new QueryBuilderFactory();
