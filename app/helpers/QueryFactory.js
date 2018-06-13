import moment from 'moment-timezone';
import tsMdmService from 'totvslabs-ui-framework/react-native/rest/services/mdm.service.js';
import { convertToArray, sortBy, convertArrayToMap } from './utils/array';
import { setValueByPath } from './utils/object';

export const FilterType = {
    source: '',
    fieldType: '',
    filterType: ''
};

class Query {
    _body = {};
    _entity = undefined;
    _index = '';
    _filter = [];
    _params = {};
    _area = null;
    _AND = ' AND ';

    index (value) {

        this._index = value;

        return this;
    }

    pageSize (value) {

        this._params.pageSize = value;

        return this;
    }

    entity (value) {

        this._entity = value;

        return this;
    }

    filter (value) {

        this._filter = value;

        return this;
    }

    groupBy (value) {

        this._groupBy = value;

        return this;
    }

    sortBy (value) {

        this._params.sortBy = value;

        return this;
    }

    run () {
        var body = QueryFactory.buildFilter(this._filter);

        body.mustList.unshift({
            mdmFilterType: 'TYPE_FILTER',
            mdmValue: this._entity + this._index
        });

        var params = this._params;

        if (!params.pageSize) {
            params.pageSize = this._groupBy ? 0 : 10;
        }

        var aggregations = [];

        if (this._groupBy) {
            params.groupBy = this._groupBy;
            aggregations = this.buildAggregations();
            body.aggregationList = aggregations;
        }

        return tsMdmService.processFilterQuery(body, {pageSize: params.pageSize}).then((rawData) => {
            return this.formatQueryResult(rawData, aggregations, params);
        });
    }

    formatQueryResult (rawData, aggregations, params) {
        return aggregations.length ? this.formatAggregatedQueryResult(rawData, aggregations, params) : this.formatDefaultQueryResult(rawData);
    }

    formatAggregatedQueryResult (rawData, aggregations, params) {
        if (!rawData.aggs) {
            return {
                buckets: [],
                records: [],
                total: 0
            };
        }

        var bucketFormat = (params.groupBy && params.groupBy.bucketFormat) || 'MMM YY';
        var fieldTypes = [];
        var buckets = [];
        var records = [];
        var result = {
            records,
            total: rawData.totalHits
        };

        var fieldPaths = (aggregations[0].subAggregations || aggregations).reduce((paths, field) => {
            if (field.aggregationKeyResolver) {
                field.aggregationKeyResolver.targetFieldsToResolve.forEach((resolvedField) => {
                    paths.push(resolvedField.replace('mdmGoldenFieldAndValues.', ''));
                });
            }
            else {
                paths.push(field.name);
            }

            fieldTypes.push(field.type);

            return paths;
        }, []);

        if (fieldPaths.length) {

            records = this.getRecordsByAggregation(rawData.aggs);

            records.pop();

            result.records = sortBy(records, params.sortBy);

            if (params.sortOrder === 'DESC') {
                result.records = result.records.reverse();
            }

            buckets = result.records.map((record, recordIndex) => {
                return {
                    fields: fieldPaths,
                    fieldTypes,
                    key: recordIndex,
                    value: record.COUNT ? record.COUNT : parseFloat(record[fieldPaths[fieldPaths.length - 1]]),
                    label: !record.COUNT ? record[fieldPaths[0]] : fieldPaths.reduce((str, field) => {
                        return str === '' ? this.formatFieldValueByType(record[field], fieldTypes, params.groupBy) : str + ' - ' + this.formatFieldValueByType(record[field], '');
                    }, ''),
                    filterValue: record[fieldPaths[0]]
                };
            });

            var aggrMap = convertArrayToMap(aggregations, 'name');

            result.records = result.records.map((item) => {
                var record = {};

                Object.keys(item).forEach((key) => {
                    var type = aggrMap[key] && aggrMap[key].type;

                    setValueByPath(record, key, this.formatFieldValueByType(item[key], type, params.groupBy));
                });

                return record;
            });

            result.tickFormat = (i) => {
                return buckets[i] ? buckets[i].label : '';
            };

        }

        if (rawData.aggs.buckets) {

            buckets = rawData.aggs.buckets.map((bucket) => {
                var key = moment(bucket.key).utc().format(bucketFormat);
                var record = {COUNT: bucket.docCount};

                setValueByPath(record, fieldPaths[0], this.formatFieldValueByType(key, {}, params.groupBy));

                records.push(record);

                return {
                    label: bucket.key,
                    value: bucket.docCount
                };
            });

            result.tickFormat = (d) => {
                return moment(d).utc().format(bucketFormat);
            };
        }

        result.buckets = buckets;

        return result;
    }

    formatDefaultQueryResult (result) {
        var records = result.hits.map((record) => {
            record.mdmGoldenFieldAndValues.mdmId = record.mdmId;

            return this.formatRecordFieldsByType(record.mdmGoldenFieldAndValues, {});
        });

        return {
            records,
            resultInfo: {
                took: result.took,
                totalHits: result.totalHits
            },
            total: result.totalHits
        };
    }

    formatRecordFieldsByType (record, fieldsTypeMap) {

        fieldsTypeMap = fieldsTypeMap || {};

        Object.keys(fieldsTypeMap).forEach((key) => {
            record[key] = this.formatFieldValueByType(record[key], fieldsTypeMap[key]);
        });

        return record;
    }

    formatFieldValueByType (value, type, params) {

        type = type || '';
        params = params || {};
        type = typeof(type) === 'string' ? type : type[0];

        value = value || '';
        value = value.toString();

        if (type === 'BOOLEAN') {
            value = value.toLowerCase() === 'true' || value.toLowerCase() === '1' ? 'Yes' : 'No';
        }
        else if (type.indexOf('DATE') > -1) {
            value = moment(value).utc().format(params.bucketFormat || 'MMM YY');
        }

        return value;
    }

    buildSubAggregations (fields, queryParams, groupByParams) {

        queryParams = queryParams || {};
        groupByParams = groupByParams || {};

        var field = fields[0];

        var aggType = 'TERM';
        var params = [];

        if (field.type === 'STRING' || field.type === 'LOOKUP') {
            params.push('mdmGoldenFieldAndValues.' + field.name + '.raw');
        }
        else if (field.type === 'LONG' || field.type === 'DOUBLE') {
            params.push('mdmGoldenFieldAndValues.' + field.name);
            params.push(0);
        }
        else if (field.type === 'BOOLEAN') {
            params.push('mdmGoldenFieldAndValues.' + field.name);
            params.push(0);
        }
        else if (field.type === 'NUMBER') {
            aggType = 'EXTENDED_STATS';
            params.push('mdmGoldenFieldAndValues.' + field.name);
        }
        else if (field.type === 'DATE') {
            aggType = 'DATE_HISTOGRAM';
            params.push('mdmGoldenFieldAndValues.' + field.name);
            params.push(groupByParams.aggregationFormat || '1M');
            params.push('yyyy-MM-dd');
        }
        else {
            params.push('mdmGoldenFieldAndValues.' + field.name + '.raw');
        }

        var sub = {
            type: aggType,
            name: field.name,
            params,
            size: queryParams.pageSize
        };

        if (field.aggregationKeyResolver) {
            sub.aggregationKeyResolver = field.aggregationKeyResolver;
            sub.name = field.aggregationKeyResolver.targetField;
        }

        if (queryParams.sortBy === field.name) {
            sub.sortBy = '_term';
            sub.sortOrder = queryParams.sortOrder || 'ASC';
            delete queryParams.sortBy;
        }
        else if (queryParams.sortBy === 'COUNT') {
            sub.sortBy = '_count';
            sub.sortOrder = queryParams.sortOrder || 'ASC';
            delete queryParams.sortBy;
        }

        fields.shift();

        if (fields.length) {
            sub.subAggregations = this.buildSubAggregations(fields, queryParams, groupByParams);
        }

        return [sub];
    }

    buildAggregations () {

        var aggregations = this._groupBy || [];
        var body = [];

        if (!aggregations.length) {
            aggregations = [aggregations];
        }

        this._params.sortBy = this._params.sortBy || 'COUNT';

        if (aggregations.length) {

            var aggNestedParam = 'mdmGoldenFieldAndValues';

            if (aggregations[0].name.indexOf('.') > 0) {
                aggNestedParam = 'mdmGoldenFieldAndValues.' + aggregations[0].name.substring(0, aggregations[0].name.lastIndexOf('.'));
            }

            body.push({
                type: 'NESTED',
                name: 'values',
                params: [
                    aggNestedParam
                ],
                size: this._params.pageSize,
                subAggregations: this.buildSubAggregations(aggregations.concat([]), {...this._params}, this._groupBy)
            });
        }

        return body;
    }

    getRecordsByAggregation (aggs, records) {

        records = records || [{}];

        //Check for nested-of-nested BE doing something special-of-special

        if (aggs.values && aggs.values.aggregations) {
            aggs = aggs.values.aggregations;
        }

        var aggKeys = Object.keys(aggs);

        aggKeys.forEach((aggKey) => {

            var item = aggs[aggKey];
            var itemKeys = Object.keys(item);

            if (item.value) {
                records[records.length - 1][aggKey] = item.valueAsString || item.value;
                records.push({...records[records.length - 1]});
            }
            else if (item.buckets) {
                var childrenBuckets = {};

                childrenBuckets[aggKey] = item.buckets;

                this.getRecordsByAggregation(childrenBuckets, records);
            }
            else if (itemKeys.length) {

                itemKeys.forEach((key) => {

                    if (item[key].resolved) {
                        var resolvedFields = item[key].resolved[0];

                        Object.keys(resolvedFields).forEach((fieldKey) => {
                            records[records.length - 1][fieldKey.replace('mdmGoldenFieldAndValues.', '')] = resolvedFields[fieldKey];
                        });
                    }
                    else {
                        records[records.length - 1][aggKey] = key;
                    }

                    if (item[key].aggregations && Object.keys(item[key].aggregations).length) {

                        this.getRecordsByAggregation(item[key].aggregations, records);
                    }
                    else {

                        records[records.length - 1][aggKey] = key;
                        records[records.length - 1].COUNT = item[key].docCount;
                        records.push({...records[records.length - 1]});
                    }
                });
            }
        });

        return records;
    }
}

class QueryFactory {
    static buildFilter (params) {
        params = params || {};

        const filters = params.constructor === Array ? params : params.filters || [];

        const mustList = [],
            mustNotList = [],
            shouldList = [];

        filters.forEach((filterItem) => {

            filterItem.source = filterItem.source || 'fields';

            if (filterItem.source === 'fields' && filterItem.fieldName) {
                const mdmPath = (params.recordType === 'REJECTED') ? 'mdmMasterFieldAndValues' : 'mdmGoldenFieldAndValues',
                    fieldType = filterItem.fieldType;

                filterItem.value = filterItem.value === undefined ? [] : filterItem.value;

                convertToArray(filterItem.value).forEach((value) => {
                    if (fieldType === 'NESTED') {
                        mustList.push({
                            mdmKey: mdmPath + '.' + filterItem.fieldName + '.*',
                            mdmFilterType: 'NESTED_SIMPLE_QUERY_STRING',
                            mdmValue: value,
                            mdmPath: mdmPath + '.' + filterItem.fieldName
                        });
                    }
                    else {
                        const fieldSearch = {
                            mdmKey: mdmPath + '.' + filterItem.fieldName
                        };

                        if (fieldType === 'STRING') {
                            fieldSearch.mdmKey += '.raw';
                        }

                        if (filterItem.filterType === 'notContains') {
                            fieldSearch.mdmFilterType = 'WILDCARD_FILTER';
                            fieldSearch.mdmValue = value;

                            mustNotList.push(fieldSearch);
                        }
                        else if (filterItem.filterType === 'equal') {
                            if (fieldType === 'DATE_HISTOGRAM') {
                                fieldSearch.mdmKey += '.raw';
                            }

                            fieldSearch.mdmFilterType = 'TERM_FILTER';
                            fieldSearch.mdmValue = value;

                            mustList.push(fieldSearch);
                        }
                        else if (filterItem.filterType === 'notEqual') {
                            fieldSearch.mdmFilterType = 'TERM_FILTER';
                            fieldSearch.mdmValue = value;

                            mustNotList.push(fieldSearch);
                        }
                        else if (filterItem.filterType === 'isEmpty') {
                            shouldList.push(
                                {
                                    mdmKey: fieldSearch.mdmKey,
                                    mdmFilterType: 'TERM_FILTER',
                                    mdmValue: ''
                                },
                                {
                                    mdmKey: fieldSearch.mdmKey,
                                    mdmFilterType: 'MISSING_FILTER'
                                }
                            );
                        }
                        else if (filterItem.filterType === 'notIsEmpty') {
                            mustNotList.push(
                                {
                                    mdmKey: fieldSearch.mdmKey,
                                    mdmFilterType: 'TERM_FILTER',
                                    mdmValue: ''
                                },
                                {
                                    mdmKey: fieldSearch.mdmKey,
                                    mdmFilterType: 'MISSING_FILTER'
                                }
                            );
                        }
                        else if (filterItem.filterType === 'lessThan') {
                            fieldSearch.mdmFilterType = 'RANGE_FILTER';
                            fieldSearch.mdmRangeValues = [
                                null,
                                value
                            ];

                            mustList.push(fieldSearch);
                        }
                        else if (filterItem.filterType === 'greaterThan') {
                            fieldSearch.mdmFilterType = 'RANGE_FILTER';
                            fieldSearch.mdmRangeValues = [
                                value,
                                null
                            ];

                            mustList.push(fieldSearch);
                        }
                        else if (filterItem.filterType === 'between') {
                            fieldSearch.mdmFilterType = 'RANGE_FILTER';
                            fieldSearch.mdmRangeValues = [
                                value[0],
                                value[1]
                            ];

                            mustList.push(fieldSearch);
                        }
                        else if (
                            filterItem.filterType === 'day' ||
                            filterItem.filterType === 'week' ||
                            filterItem.filterType === 'month' ||
                            filterItem.filterType === 'year'
                        ) {
                            const timezone = moment.tz.guess();

                            fieldSearch.mdmFilterType = 'RANGE_FILTER';
                            fieldSearch.mdmRangeValues = [
                                moment().tz(timezone).subtract(value, filterItem.filterType).format('YYYY-MM-DD'),
                                moment().tz(timezone).format('YYYY-MM-DD')
                            ];

                            mustList.push(fieldSearch);
                        }
                        else {
                            //DEFAULT: CONTAINS
                            fieldSearch.mdmFilterType = 'WILDCARD_FILTER';
                            fieldSearch.mdmValue = value;

                            mustList.push(fieldSearch);
                        }
                    }
                });
            }
            else if (filterItem.source === 'meta') {
                if (filterItem.fieldName === 'source') {

                    if (params.recordType === 'REJECTED') {
                        shouldList.push({
                            mdmKey: 'mdmStagingApplicationId',
                            mdmFilterType: 'TERM_FILTER',
                            mdmValue: filterItem.value
                        });
                    }
                    else {
                        mustList.push({
                            mdmKey: 'mdmApplicationIdMasterRecordId.' + filterItem.value,
                            mdmFilterType: 'EXISTS_FILTER'
                        });
                    }

                }
                else if (filterItem.fieldName === 'created' || filterItem.fieldName === 'lastUpdated') {
                    const now = moment().tz('UTC').format();
                    const datetimeIni = filterItem.value[0] ? moment(filterItem.value[0] + 'T00:00:00').tz('UTC').format() : now;
                    const datetimeEnd = filterItem.value[1] ? moment(filterItem.value[1] + 'T23:59:59').tz('UTC').format() : now;

                    mustList.push({
                        mdmKey: (filterItem.fieldName === 'created') ? 'mdmCreated' : 'mdmLastUpdated',
                        mdmFilterType: 'RANGE_FILTER',
                        mdmRangeValues: [datetimeIni, datetimeEnd]
                    });
                }
            }
            else if (filterItem.source === 'rejected') {
                if (filterItem.value === 'EXCEPTION') {
                    mustList.push({
                        mdmFilterType: 'TERM_FILTER',
                        mdmKey: 'mdmErrors.mdmStage.raw',
                        mdmValue: 'CLEANSING'
                    });
                }
                else if (filterItem.filterType === 'ANYTHING_ELSE') {
                    filterItem.value.split(',').forEach((id) => {
                        mustNotList.push({
                            mdmFilterType: 'TERM_FILTER',
                            mdmKey: 'mdmErrors.mdmRule.mdmId.raw',
                            mdmValue: id
                        });
                    });
                    mustNotList.push({
                        mdmFilterType: 'TERM_FILTER',
                        mdmKey: 'mdmErrors.mdmStage.raw',
                        mdmValue: 'CLEANSING'
                    });
                }
                else {
                    mustList.push({
                        mdmFilterType: 'TERM_FILTER',
                        mdmKey: 'mdmErrors.mdmRule.mdmId.raw',
                        mdmValue: filterItem.value
                    });
                }
            }
        });

        return {
            mustList,
            mustNotList,
            shouldList
        };
    }

    static create () {
        return new Query();
    }
}

export default QueryFactory;
