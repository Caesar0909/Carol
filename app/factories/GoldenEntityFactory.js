import tsMdmService from 'totvslabs-ui-framework/react-native/rest/services/mdm.service.js';

import tsUser from './User';
import tsConstants from '../constants';
import RecordStatsFactory from './RecordStatsFactory';
import tsDashboardService from '../services/DashboardService';
import tsValidationRecordsFactory from './ValidationRecordsFactory';
import FieldFactory from './FieldFactory';
// import QueryBuilder from './QueryBuilder';
import DataModelFactory from './DataModelFactory';
// import tsMergeRulesFactory from './tsMergeRulesFactory';

import StringUtils from '../helpers/utils/string';

function GoldenEntityFactory () {
    /*

    var SEARCH_ALL_PAGE_SIZE = 30;
    var PAGE_SIZE = 30;
    var profileTitleFieldsJoined;

    var mdmIdField = {
        ...FieldFactory.createEmpty(),
        mdmName: 'mdmId', mdmNamePath: 'mdmId', label: 'Entity ID', labelPath: 'Entity ID'
    };

    function GoldenEntity () {

        this.id = undefined;
        this.type = undefined;
        this.name = undefined;
        this.urlName = undefined;
        this.label = undefined;
        this.description = undefined;
        this.profileTitleFields = undefined;

        this.stats = RecordStatsFactory.create();
        this.exploreStats = {};
        this.filteredStats = undefined;

        //Includes Entity ID used for relationship mapping
        this.fields = undefined;
        this.fieldsAndValues = undefined;

        //Does not include Entity ID
        this.configFields = undefined;

        //then store a lookup by mdmName map
        this.fieldMapByName = undefined;
        this.fieldMapById = undefined;
        this.hasFullDetails = false;

        this.publishedExists = undefined;
        this.entitySpace = undefined;
        this.groupName = undefined;

        this.type = undefined;
        this.typeId = undefined;
        this.mdmVerticals = undefined;
        this.segmentId = undefined;
        this.icon = undefined;

        this.relatedTemplates = [];

        this.isPartial = true;
    }

    GoldenEntity.prototype.getFieldById = function (id) {
        return this.fieldMapById[id];
    };

    GoldenEntity.prototype.lookupFieldByName = function (mdmNamePath) {
        return this.fieldMapByName[mdmNamePath];
    };

    GoldenEntity.prototype.isGlobal = function () {
        return false;
    };

    GoldenEntity.prototype.hasBeenPublished = function () {
        return this.publishedExists;
    };

    GoldenEntity.prototype.isPublished = function () {
        return this.entitySpace === tsConstants.ENTITY_SPACE_PUBLISHED;
    };

    GoldenEntity.prototype.isDraft = function () {
        return this.entitySpace === tsConstants.ENTITY_SPACE_WORKING;
    };

    GoldenEntity.prototype.isGolden = function () {
        return true;
    };

    GoldenEntity.prototype.getLatestStats = function () {
        return this.stats.getGoldenEntityStats(this);
    };

    GoldenEntity.prototype.getFilteredStats = function (query) {

        this.filteredStats = RecordStatsFactory.create();

        return this.filteredStats.getGoldenEntityStats(this, query);
    };

    GoldenEntity.prototype.getExploreStats = function (statsSinceDaysAgo) {
        return tsDashboardService.getExploreStatistics({ days: statsSinceDaysAgo, dataModel: this.name }).then(function (rawDataList) {
            rawDataList.some(function (rawDataEntity) {

                if (rawDataEntity.dataModelName === this.name) {
                    this.updateExploreStats(rawDataEntity);

                    return true;
                }

            }.bind(this));

            return this;
        }.bind(this));
    };

    GoldenEntity.prototype.updateExploreStats = function (rawData) {
        this.exploreStats.goldenRecords = rawData.totalNumberOfRecords;
        this.exploreStats.flaggedRecords = rawData.numberOfRecordsHasFlaggedFields;
        this.exploreStats.rejectedRecords = rawData.numberOfRejectedRecords;
        this.exploreStats.mergedRecords = rawData.numberOfMergesSinceCreated;
        this.exploreStats.mergeTasksPending = rawData.numberOfMergeTasksPending;
        this.exploreStats.potentialMerge = rawData.numberOfMergeRecommendations;
        this.exploreStats.totalInMaster = rawData.numberOfMasterOfMasterRecords;
        this.exploreStats.totalUpdatedSinceDaysAgo = rawData.numberOfRecordsUpdatedInPassedXDays;
    };

    GoldenEntity.prototype.hasExploreStatsChanged = function (rawData) {
        return this.exploreStats.goldenRecords !== rawData.totalNumberOfRecords ||
            this.exploreStats.flaggedRecords !== rawData.numberOfRecordsHasFlaggedFields ||
            this.exploreStats.rejectedRecords !== rawData.numberOfRejectedRecords ||
            this.exploreStats.mergedRecords !== rawData.numberOfMergesSinceCreated ||
            this.exploreStats.mergeTasksPending !== rawData.numberOfMergeTasksPending ||
            this.exploreStats.potentialMerge !== rawData.numberOfMergeRecommendations ||
            this.exploreStats.totalInMaster !== rawData.numberOfMasterOfMasterRecords ||
            this.exploreStats.totalUpdatedSinceDaysAgo !== rawData.numberOfRecordsUpdatedInPassedXDays;
    };

    GoldenEntity.prototype.searchCompanies = function (queryType, query, page, pageSize) {

        var params = {
            pageSize: pageSize
        };
        var body = {
            type: 'mdmcompanyGolden'
        };

        if (query) {
            if (queryType === 'mdm') {
                body.filter = '(mdmId eq "' + query + '" OR nested mdmGoldenFieldAndValues (mdmGoldenFieldAndValues.* pco "' + query + '") OR nested mdmCrosswalk.mdmCrossreference (mdmCrosswalk.mdmCrossreference.* pco "' + query + '"))';
            }
            else {
                body.filter = 'nested mdmGoldenFieldAndValues.mdmaddress (mdmGoldenFieldAndValues.mdmaddress.mdmcoordinates geo 5km "' + query + '")';
            }
        }

        return tsMdmService.processFreeformQuery(body, params).then(function (records) {
            return records.hits.map(function (record) {
                return record.source.mdmGoldenFieldAndValues;
            });
        });
    };

    GoldenEntity.prototype.getEntityName = function () {
        return this.name;
    };

    GoldenEntity.prototype.searchAllGoldenRecords = function (page, pageSize) {

        var params = {
            pageSize: pageSize || 50,
            offset: page || 0
        };
        var body = {
            type: this.name + 'Golden',
            filter: ''
        };

        return tsMdmService.processFreeformQuery(body, params).then(function (result) {
            var records = result.hits.map(function (record) {
                record.source.mdmGoldenFieldAndValues.mdmId = record.source.mdmId;

                return record.source.mdmGoldenFieldAndValues;
            });

            return {
                records: records,
                total: result.totalHits
            };
        });
    };

    function createFromJson (rawData) {

        var inst = new GoldenEntity();

        var lang = tsUser.language;

        inst.id = rawData.mdmId;
        inst.name = rawData.mdmName;
        inst.label = rawData.mdmLabel[lang];
        inst.urlName = StringUtils.urlSafeName(inst.name);
        inst.description = rawData.mdmDescription[lang];
        inst.lastUpdated = new Date(rawData.mdmLastUpdated);
        inst.created = new Date(rawData.mdmCreated);
        inst.profileTitleFields = rawData.mdmProfileTitleFields;
        inst.publishedExists = rawData.mdmPublishedExists;
        inst.entitySpace = rawData.mdmEntitySpace;
        inst.groupName = rawData.mdmGroupName;

        if (rawData.mdmEntityTemplateType && rawData.mdmEntityTemplateType.length) {
            inst.type = rawData.mdmEntityTemplateType[0].mdmName;
            inst.typeId = rawData.mdmEntityTemplateTypeIds[0];
        }

        if (rawData.mdmVerticalIds && rawData.mdmVerticalIds.length) {
            inst.mdmVerticals = rawData.mdmVerticalIds;
            inst.segmentId = rawData.mdmVerticalIds[0];
        }

        inst.icon = DataModelFactory.ENTITY_TEMPLATE_TYPE_ICONS[inst.type] || 'default';

        //Is this descriptor of full DataModel
        inst.isPartial = rawData.mdmFields && rawData.mdmFields.length && rawData.mdmFieldsFull &&
            !rawData.mdmFieldsFull[rawData.mdmFields[0].mdmName];

        inst.hasFullDetails = !inst.isPartial;

        if (rawData.mdmFields.length) {

            inst.fieldMapById = {};
            inst.fieldMapByName = {};

            inst.configFields = FieldFactory.createListFromJson(rawData.mdmFields, rawData.mdmFieldsFull, inst.fieldMapByName);

            rebuildFlatFields(inst);

            inst.fields = [mdmIdField].concat(inst.configFields);

            inst.flatFields.forEach(function (field) {
                inst.fieldMapById[field.id] = field;
            });
        }

        if (rawData.mdmRelatedTemplates) {
            Object.keys(rawData.mdmRelatedTemplates).forEach(function (key) {
                inst.relatedTemplates.push(createFromJson(rawData.mdmRelatedTemplates[key]));
            }, inst);
        }

        if (rawData.mdmEntityValidationRules) {
            inst.validationRules = tsValidationRecordsFactory.createFromJson(rawData.mdmEntityValidationRules);
            inst.validationFlattenRules = [];

            inst.validationRules.listItems.forEach(function (validationRule) {
                validationRule.listItems.forEach(function (validation, i1) {

                    var label = (i1 === 0) ? 'Reject when ' : ' and when ';

                    label += inst.fieldMapById[validation.fieldId].label + ' ' + validation.fieldFunction.label + ' ';

                    validation.fieldFunction.parameters.forEach(function (param, i2) {
                        if (i2 > 0) {
                            label += param.value.description || param.value;
                            label += ' ';
                        }
                    });

                    inst.validationFlattenRules.push({
                        id: validation.id,
                        label: label
                    });
                });
            });
        }

        if (rawData.mdmFieldMergeRules) {

            inst.mergeRules = tsMergeRulesFactory.createFromJson(rawData.mdmFieldMergeRules, inst.fieldMapById);
        }

        return inst;
    }

    function rebuildFlatFields (goldenEntity) {
        var result = [];
        var depth = 0;
        var emptyObj = {};

        traverseNestedCollection(null, goldenEntity.configFields);

        function traverseNestedCollection (parent, childFields) {

            childFields.forEach(
                function (field) {

                    field.depth = depth;
                    field.parentField = parent || emptyObj;

                    if (field.isNested) {
                        if (!field.hideChildFields) {
                            depth++;
                            traverseNestedCollection(field, field.childFields);
                            depth--;
                        }
                    }
                    else {
                        result.push(field);
                    }
                });
        }

        goldenEntity.flatFields = result;
    }

    function createFromDataModel (dataModel) {

        var inst = new GoldenEntity();

        inst.id = dataModel.id;
        inst.name = dataModel.name; //This is mdmName
        inst.type = dataModel.type;
        inst.label = dataModel.label;
        inst.urlName = dataModel.urlName;
        inst.description = dataModel.description;
        inst.lastUpdated = dataModel.lastUpdated;
        inst.created = dataModel.created;
        inst.profileTitleFields = dataModel.profileTitleFields;
        inst.publishedExists = dataModel.publishedExists;
        inst.entitySpace = dataModel.entitySpace;

        return inst;
    }

    function getClass () {
        return GoldenEntity;
    }

    return {
        createFromJson: createFromJson,
    };

    */
}

export default new GoldenEntityFactory();
