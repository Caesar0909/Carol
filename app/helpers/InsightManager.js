// @flow

import moment from 'moment';

import QueryFactory from './QueryFactory';
import InsightHelper from './InsightHelper';

import tsMdmService from 'totvslabs-ui-framework/react-native/rest/services/mdm.service.js';
import tsMdmDataModelService from 'totvslabs-ui-framework/react-native/rest/services/dataModel.service.js';

import { getLocaleStringOf } from './utils/number';
import { setValueByPath } from './utils/object';
import DataModel from '../models/DataModel';

import { convertArrayToGroupedMap, convertArrayToMap, removeDuplicatedArrayValues } from './utils/array';

class InsightManager {

    static buildSubAggregations (fields, queryParams) {

        const field = fields[0];
        const params = [];

        let aggType = 'TERM';

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
            params.push('1M');
            params.push('yyyy-MM-dd');
        }
        else {
            params.push('mdmGoldenFieldAndValues.' + field.name + '.raw');
        }

        const sub = {
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
            sub.sortOrder = queryParams.sortOrder;
            delete queryParams.sortBy;
        }
        else if (queryParams.sortBy === 'COUNT') {
            sub.sortBy = '_count';
            sub.sortOrder = queryParams.sortOrder;
            delete queryParams.sortBy;
        }

        fields.shift();

        if (fields.length) {
            sub.subAggregations = InsightManager.buildSubAggregations(fields, queryParams);
        }

        return [sub];
    }

    static buildFilteredBody (dataModelIndex, filters, params, aggregations) {

        filters = filters || [];
        aggregations = aggregations || [];
        params = params || {};

        const pageSize = params.pageSize || 1000;

        const body = QueryFactory.buildFilter(filters);

        body.aggregationList = [];

        body.mustList.unshift({
            mdmFilterType: 'TYPE_FILTER',
            mdmValue: dataModelIndex
        });

        if (aggregations.length) {

            let aggNestedParam = 'mdmGoldenFieldAndValues';

            if (aggregations[0].name.indexOf('.') > 0) {
                aggNestedParam = 'mdmGoldenFieldAndValues.' + aggregations[0].name.substring(0, aggregations[0].name.lastIndexOf('.'));
            }

            body.aggregationList.push({
                type: 'NESTED',
                name: 'values',
                params: [
                    aggNestedParam
                ],
                size: pageSize,
                subAggregations: InsightManager.buildSubAggregations(aggregations.concat([]), Object.assign({}, params))
            });
        }

        return body;
    }

    static searchAllGoldenRecords (dataModelIndex, filters, page, queryParams, fieldsTypeMap) {

        queryParams = queryParams || {};
        page = page || 0;

        const pageSize = queryParams.pageSize || 50;
        const params = {
            pageSize,
            offset: pageSize * page
        };

        const body = InsightManager.buildFilteredBody(dataModelIndex, filters, params);

        if (queryParams.sortBy && queryParams.sortBy !== 'COUNT') {
            params.sortBy = 'mdmGoldenFieldAndValues.' + queryParams.sortBy;
            params.sortOrder = queryParams.sortOrder || 'ASC';
            if (queryParams.sortType === 'STRING') {
                params.sortBy += '.raw';
            }
        }

        return tsMdmService.processFilterQuery(body, params).then((result) => {
            const records = result.hits.map((record) => {
                record.mdmGoldenFieldAndValues.mdmId = record.mdmId;

                return InsightManager.formatRecordFieldsByType(record.mdmGoldenFieldAndValues, fieldsTypeMap);
            });

            return {
                records,
                resultInfo: {
                    took: result.took,
                    totalHits: result.totalHits
                },
                total: result.totalHits
            };
        });
    }

    static getFilteredQueryFilters (inFilters) {

        const filters = [];

        inFilters.forEach((filter) => {
            if (filter.items.length) {

                const fieldName = 'mdmGoldenFieldAndValues.' + filter.name;
                const path = fieldName.split('.').slice(0, -1).join('.');

                filter.items.forEach((item) => {
                    if (filter.type === 'LOOKUP') {
                        if (item.value.length) {
                            filters.push({
                                mdmFilterType: 'NESTED_TERMS_FILTER',
                                mdmKey: fieldName + '.raw',
                                mdmPath: path,
                                mdmValue: item.value
                            });
                        }
                    }
                });

                if (filter.type === 'BAR') {
                    filters.push({
                        mdmFilterType: 'NESTED_TERMS_FILTER',
                        mdmKey: filter.filterType === 'BOOLEAN' ? fieldName : fieldName + '.raw',
                        mdmPath: path,
                        mdmValue: filter.filterType === 'BOOLEAN' ? filter.items[0].value === 'true' : filter.items.map((item) => {
                            return item.value;
                        })
                    });
                }
                else if (filter.type === 'LINE') {
                    filters.push({
                        mdmFilterType: 'NESTED_RANGE_FILTER',
                        mdmKey: fieldName,
                        mdmPath: path,
                        mdmRangeValues: filter.items[0]
                    });
                }
                else if (filter.type === 'IN_ARRAY') {
                    filters.push({
                        mdmFilterType: 'NESTED_TERMS_FILTER',
                        mdmKey: fieldName + '.raw',
                        mdmPath: path,
                        mdmValue: filter.items
                    });
                }
            }
        });

        return filters;
    }

    //TODO - get separate distributions for each field. This will allow for multiple charts to be stacked / overlayed
    static getValueDistribution (dataModelIndex, filters, aggregations, queryParams, fieldsTypeMap) {

        aggregations = aggregations || [];

        const params = {
            pageSize: queryParams.pageSize || 50
        };

        if (queryParams.sortBy) {
            params.sortBy = queryParams.sortBy;
            params.sortOrder = queryParams.sortOrder || 'ASC';
        }
        else {
            params.sortBy = 'COUNT';
        }

        // Hack the request to have the sorting field always at first
        if (params.sortBy !== 'COUNT' && params.sortBy !== aggregations[0].name) {
            aggregations = aggregations.reduce((arr, item) => {
                if (item.name === params.sortBy) {
                    arr.unshift(item);
                }
                else {
                    arr.push(item);
                }

                return arr;
            }, []);
        }

        const body = InsightManager.buildFilteredBody(dataModelIndex, filters, params, aggregations);

        return tsMdmService.processFilterQuery(body, {pageSize: 0}).then((rawData) => {

            if (!rawData.aggs) {
                return {
                    buckets: [],
                    records: [],
                    total: 0
                };
            }

            let records = [];
            let buckets = [];

            const fieldTypes = [];

            const result = {
                records,
                total: rawData.totalHits
            };
            const fieldPaths = aggregations.reduce((paths, field) => {
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

                records = getRecordsByAggregation(rawData.aggs);
                records.pop();

                result.records = records.sort((a, b) => b[params.sortBy] - a[params.sortBy]);

                if (params.sortOrder === 'DESC') {
                    result.records = result.records.reverse();
                }

                buckets = result.records.map((record, index) => {
                    return {
                        fields: fieldPaths,
                        fieldTypes,
                        key: index,
                        value: record.COUNT,
                        label: fieldPaths.reduce((str, field) => {
                            return str === '' ? InsightManager.formatFieldValueByType(record[field], fieldsTypeMap[field]) : str + ' - ' + InsightManager.formatFieldValueByType(record[field], fieldsTypeMap[field]);
                        }, ''),
                        filterValue: fieldPaths.reduce((str, field) => {
                            return str === '' ? record[field] : str + ' - ' + record[field];
                        }, '')
                    };
                });

                result.records = result.records.map((item) => {
                    const record = {};

                    Object.keys(item).forEach((key) => {
                        setValueByPath(record, key, InsightManager.formatFieldValueByType(item[key], fieldsTypeMap[key]));
                    });

                    return record;
                });

                result.tickFormat = function (i) {
                    return buckets[i] ? buckets[i].label : '';
                };
            }

            if (rawData.aggs.buckets) {
                buckets = rawData.aggs.buckets.map((bucket) => {
                    const key = moment(bucket.key).utc().format('MMM YY');
                    const record = {COUNT: bucket.docCount};

                    setValueByPath(record, fieldPaths[0], InsightManager.formatFieldValueByType(key, fieldsTypeMap[fieldPaths[0]]));

                    records.push(record);

                    return {
                        label: bucket.key,
                        value: bucket.docCount
                    };
                });

                result.tickFormat = function (d) {
                    return moment(d).utc().format('MMM YY');
                };
            }

            result.buckets = buckets;

            return result;
        });
    }

    static getLookupSearchFunction (configuration) {
        return function (searchQuery, page, pageSize) {

            const filterInfo = [{
                type: 'STRING',
                name: configuration.descriptionField,
                items: [{
                    fieldFunction: 'CONTAINS',
                    value: searchQuery
                }]
            }];

            return InsightManager.searchAllGoldenRecords(configuration.dataModel + 'Golden', InsightManager.getFilteredQueryFilters(filterInfo), page, pageSize);
        };
    }

    static getLookupConfiguration (configuration) {

        let filters = [];

        configuration.possibleValues = configuration.possibleValues || [];

        if (configuration.possibleValues.length) {
            filters.push({
                type: 'IN_ARRAY',
                name: configuration.valueField,
                items: configuration.possibleValues
            });
        }

        filters = InsightManager.getFilteredQueryFilters(filters);

        return InsightManager.searchAllGoldenRecords(configuration.dataModel + 'Golden', filters).then((result) => {
            return InsightManager.getTotalCount(configuration.dataModel + 'Golden').then((totalCount) => {
                const lookupConfiguration = {
                    complete: result.records.length === totalCount,
                    options: result.records.map((record) => {
                        return {
                            description: record[configuration.descriptionField],
                            value: record[configuration.valueField]
                        };
                    })
                };

                lookupConfiguration.options = removeDuplicatedArrayValues(lookupConfiguration.options, 'value');
                lookupConfiguration.optionsMap = convertArrayToMap(lookupConfiguration.options, 'value');

                if (!lookupConfiguration.complete) {
                    lookupConfiguration.search = InsightManager.getLookupSearchFunction(configuration);
                }

                return lookupConfiguration;
            });
        });
    }

    static getTotalCount (dataModelIndex) {
        return InsightManager.searchAllGoldenRecords(dataModelIndex, null, null, {pageSize: 1}).then((result) => {
            return result.total;
        });
    }

    static formatRecordFieldsByType (record, fieldsTypeMap) {

        fieldsTypeMap = fieldsTypeMap || {};

        Object.keys(fieldsTypeMap).forEach((key) => {
            record[key] = InsightManager.formatFieldValueByType(record[key], fieldsTypeMap[key]);
        });

        return record;
    }

    static formatFieldValueByType (value, type) {

        value = value || '';

        if (type === 'BOOLEAN') {
            value = value.toString().toLowerCase();
            value = value === 'true' || value === '1' ? 'Yes' : 'No';
        }

        return value;
    }

    static getFieldsListGroupedByDataModel (fields, dataModelsMap) {

        const map = fields.reduce((obj, field) => {
            if (!obj[field.dataModelName]) {
                obj[field.dataModelName] = {
                    label: dataModelsMap[field.dataModelName].label,
                    fields: []
                };
            }

            obj[field.dataModelName].fields.push({
                label: field.fieldLabel
            });

            return obj;
        }, {});

        return Object.values(map);
    }

    static buildAggregations (selectedColumns, mainDataModel, relationships) {

        selectedColumns = selectedColumns.map((column) => {
            return {
                name: column.fieldName,
                type: column.fieldType,
                dataModel: column.dataModelName
            };
        });

        const selectedColumnsMap = convertArrayToGroupedMap(selectedColumns, 'dataModel');

        selectedColumns = selectedColumnsMap[mainDataModel] || [];

        delete selectedColumnsMap[mainDataModel];

        Object.keys(selectedColumnsMap).forEach((columnDataModel) => {

            const relationship = relationships[columnDataModel];
            const sourceField = Object.keys(relationship)[0];
            const targetField = relationship[sourceField].valueField;

            const relatedColumn = {
                name: sourceField,
                type: 'STRING',
                aggregationKeyResolver: {
                    targetType: columnDataModel + 'Golden',
                    targetField: 'mdmGoldenFieldAndValues.' + targetField + '.raw',
                    targetFieldsToResolve: selectedColumnsMap[columnDataModel].map((column) => {
                        return 'mdmGoldenFieldAndValues.' + column.name;
                    })
                }
            };

            selectedColumns.unshift(relatedColumn);
        });

        return selectedColumns;
    }

    static queryRecords (insight, pageNum) {

        return tsMdmDataModelService.getEntityTemplateByName(insight.dataModelName).then((rawDataModel) => {

            insight.dataModel = DataModel.createObjectFromMdmRecord(rawDataModel);

            const config = prepareQueryInsights(insight);

            return InsightManager.searchAllGoldenRecords(config.dataModelIndex, insight.filters, pageNum, config.queryParams, config.fieldsTypeMap).then((result) => {
                const records = result.records.map((record) => {
                    for (const key in record) {
                        if (record.hasOwnProperty(key) && record[key].constructor === Array) {
                            record[key] = record[key][0];
                        }
                    }

                    return InsightManager.flattenFields(record);
                });

                return Promise.all(InsightManager.getLookupFunctions(insight.columns, records)).then(() => {
                    return {
                        records: InsightHelper.getFormattedRecords(insight.dataModel, records),
                        totalRecords: result.total,
                        totalRecordsLocale: getLocaleStringOf(result.total)
                    };
                });
            });

        });
    }

    static queryAggregations (insight) {

        const config = prepareQueryInsights(insight);

        const aggregations = InsightManager.buildAggregations(insight.columns, config.dataModel, insight.relationshipsMap);

        return InsightManager.getValueDistribution(config.dataModelIndex, insight.filters, aggregations, config.queryParams, config.fieldsTypeMap).then((valueDistribution) => {

            valueDistribution.aggRecords = valueDistribution.records;
            valueDistribution.totalRecords = valueDistribution.total;
            valueDistribution.totalRecordsLocale = getLocaleStringOf(valueDistribution.total);

            delete valueDistribution.records;

            return Promise.all(InsightManager.getLookupFunctions(insight.columns, valueDistribution.aggRecords)).then(() => {
                valueDistribution = InsightManager.updateAggRecords(insight, valueDistribution);

                if (insight.visualization.type === 'TABLE') {
                    valueDistribution.aggRecords = valueDistribution.aggRecords.slice(0, config.queryParams.pageSize);
                }

                return valueDistribution;
            });
        });

    }

    static getFieldFullName (name, parentName) {
        return (parentName) ? parentName + '.' + name : name;
    }

    static flattenFields (record, parentName) {
        return Object.keys(record).reduce((flattenRecord, key) => {
            if (record[key] && record[key].constructor === Object) {
                flattenRecord = Object.assign({}, flattenRecord, InsightManager.flattenFields(record[key], key));
            }
            else {
                flattenRecord[InsightManager.getFieldFullName(key, parentName)] = record[key];
            }

            return flattenRecord;
        }, {});
    }

    static updateAggRecords (insight, valueDistribution) {

        valueDistribution = valueDistribution || {};

        const maxLabelLength = 20;

        let label = '';
        let lookups;

        insight.columns.forEach((column) => {
            label += label ? ' - ' + column.fieldLabel : column.fieldLabel;
            if (column.lookup) {
                lookups = lookups || {};
                lookups[column.fieldName] = column.lookup.optionsMap || {};
            }
        });

        const chartData = {
            name: label,
            style: setChartColors(),
            callback: function () {}
        };

        if (valueDistribution.buckets) {
            valueDistribution.buckets = valueDistribution.buckets.map((item) => {
                if (lookups) {
                    if (lookups[item.fields[0]]) {
                        if (lookups[item.fields[0]][item.label]) {
                            item.label = lookups[item.fields[0]][item.label].description || item.label || '(empty)';
                        }
                    }
                }

                if (item.label && item.label.length > maxLabelLength) {
                    item.label = item.label.substr(0, maxLabelLength - 3) + '...';
                }

                return item;
            });

            chartData.values = valueDistribution.buckets;

            chartData.options = {
                xAxis: {
                    tickValues: valueDistribution.tickValues,
                    tickFormat: valueDistribution.tickFormat,
                    axisLabel: insight.visualization.properties.xAxisLabel
                },
                yAxis: {
                    axisLabel: insight.visualization.properties.yAxisLabel
                }
            };
        }

        valueDistribution.chartData = chartData;

        return valueDistribution;
    }

    static getLookupFunctions (columns, records) {
        return columns.reduce((lookupFunctions, column) => {
            if (column.fieldType === 'LOOKUP') {
                if (!column.lookup.complete) {
                    column.typeConfiguration.possibleValues = records.map((record) => {
                        return record[column.typeConfiguration.sourceField] || '';
                    });

                    lookupFunctions.push(
                        InsightManager.getLookupConfiguration(column.typeConfiguration).then((lookupConfiguration) => {
                            column.lookup = lookupConfiguration;
                        })
                    );
                }
            }

            return lookupFunctions;
        }, []);
    }
}

function prepareQueryInsights (insight) {

    insight.filters = insight.filters || [];
    insight.columns = insight.columns || [];
    insight.visualization = insight.visualization || {};
    insight.visualization.properties = insight.visualization.properties || {};

    const dataModel = insight.dataModelName;
    const dataModelIndex = dataModel + 'Golden';

    const queryParams = {
        pageSize: -1
    };

    if (insight.visualization && insight.visualization.properties) {
        queryParams.pageSize = insight.visualization.properties.numRows || queryParams.pageSize;
    }

    if (insight.sort) {
        if (insight.sort.fieldName) {
            queryParams.sortBy = insight.sort.fieldName;
        }
        if (insight.sort.order) {
            queryParams.sortOrder = insight.sort.order;
        }
    }

    const fieldsTypeMap = insight.columns.reduce((map, column) => {
        map[column.fieldName] = column.fieldType;

        return map;
    }, {});

    return {
        dataModel,
        dataModelIndex,
        queryParams,
        fieldsTypeMap
    };
}

function getRecordsByAggregation (aggs, records) {

    records = records || [{}];

    //Check for nested-of-nested BE doing something special-of-special
    if (aggs.values && aggs.values.aggregations) {
        aggs = aggs.values.aggregations;
    }

    const aggKeys = Object.keys(aggs);

    aggKeys.forEach((aggKey) => {

        const item = aggs[aggKey];
        const itemKeys = Object.keys(item);

        if (item.buckets) {
            const childrenBuckets = {};

            childrenBuckets[aggKey] = item.buckets;

            getRecordsByAggregation(childrenBuckets, records);
        }
        else if (itemKeys.length) {

            itemKeys.forEach((key) => {

                if (item[key].resolved) {
                    const resolvedFields = item[key].resolved[0];

                    Object.keys(resolvedFields).forEach((fieldKey) => {
                        records[records.length - 1][fieldKey.replace('mdmGoldenFieldAndValues.', '')] = resolvedFields[fieldKey];
                    });
                }
                else {
                    records[records.length - 1][aggKey] = key;
                }

                if (item[key].aggregations && Object.keys(item[key].aggregations).length) {

                    getRecordsByAggregation(item[key].aggregations, records);
                }
                else {

                    records[records.length - 1][aggKey] = key;
                    records[records.length - 1].COUNT = item[key].docCount;
                    records.push(Object.assign({}, records[records.length - 1]));
                }
            });
        }
    });

    return records;
}

function setChartColors (items) {

    const colors = [
        ['#ffffff', '#f8f8f8', '#e9ebeb', '#e9ebeb', '#55add1', '#55add1'],
        ['#ffffff', '#f8f8f8', '#f7c1ba', '#f7c1ba', '#f78474', '#f78474'],
        ['#ffffff', '#f8f8f8', '#f8e3ad', '#f8e3ad', '#f7d272', '#f7d272'],
        ['#ffffff', '#f8f8f8', '#e9ebeb', '#e9ebeb', '#96afb9', '#96afb9']
    ];

    if (!items) {
        return colors[0];
    }

    items = items.map((item, index) => {
        if (item.type === 'BAR' || item.type === 'LINE') {
            item.data = item.data || {};
            item.data.style = colors[index % colors.length];
        }

        return item;
    });

    return items;
}

export default InsightManager;
