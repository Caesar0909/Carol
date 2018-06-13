// @flow
import tsMdmService from 'totvslabs-ui-framework/react-native/rest/services/mdm.service.js';
import tsDataModelService from 'totvslabs-ui-framework/react-native/rest/services/dataModel.service.js';
import tsRelationshipService from 'totvslabs-ui-framework/react-native/rest/services/relationship.service.js';

import ExploreService from './ExploreService';

import ResponseHelper from '../helpers/ResponseHelper';

import DataModel from '../models/DataModel';

class DataModelService extends ExploreService {

    static getDataModels () {
        return new Promise((resolve, reject) => {
            ExploreService.createProcessFilterQueryRequest(
                {
                    'mustList': [
                        {
                            'mdmFilterType': 'TYPE_FILTER',
                            'mdmValue': 'mdmEntityTemplate'
                        },
                        {
                            'mdmFilterType': 'TERM_FILTER',
                            'mdmKey': 'mdmTags.raw',
                            'mdmValue': 'mobile'
                        }
                    ]
                },
                {
                    pageSize: -1,
                    indexType: 'CONFIG'
                },
                (response) => {
                    resolve(ResponseHelper.hits(response).map((mdmDataModel) => DataModel.createObjectFromMdmRecord(mdmDataModel)));
                },
                (error) => reject(error)
            );
        });
    }

    /* queryParams Defaults: offset=0, pageSize=10, sortBy=mdmId, sortOrder=ASC, query= */
    static globalSearch ({ query, queryParams }) {
        DataModelService.setupRestService();

        queryParams = queryParams || {};

        if (query) {
            queryParams.query = query.split('"').join('\\"');
        }

        queryParams.sortBy = '';

        return new Promise((resolve, reject) => {
            DataModelService.createAuthenticatedRequest(() => tsMdmService.processGlobalQuery(queryParams),
                (response) => resolve(response),
                (error) => reject(error)
            );
        });
    }

    /* queryParams Defaults: offset=0, pageSize=10, sortBy=, sortOrder=ASC, fuzzy=false, recordType=, fields=, scrollId=, searchContributor=false, query= */
    static searchRecords ({ id, query, queryParams, body = {} }) {
        DataModelService.setupRestService();

        queryParams = queryParams || { offset: 0, pageSize: 30 };

        queryParams.recordType = 'GOLDEN';
        if (query) {
            queryParams.query = query;
        }

        return new Promise((resolve, reject) => {
            DataModelService.createAuthenticatedRequest(() => tsDataModelService.searchRecords(id, body, queryParams),
                (response) => resolve(response),
                (error) => reject(error)
            );
        });
    }

    /* 360 views */
    static getGoldenRecord ({ templateId, goldenRecordId }) {
        return tsDataModelService.getGoldenRecord(templateId, goldenRecordId);
    }

    static getAllVerticals () {
        return tsMdmService.getAllVerticals({pageSize: -1});
    }

    static getRelationships (entityName) {
        return tsRelationshipService.getEntityMappingsThatArePublished({entityType: entityName}).then((rawData) => {
            return rawData.hits.reduce((list, item) => {

                // if (item.mdmSourceEntityName === entityName || item.mdmTargetEntityName === entityName) {
                //     list.push({
                //         name: item.mdmRelationshipName,
                //         sourceEntityName: item.mdmSourceEntityName,
                //         targetEntityName: item.mdmTargetEntityName,
                //         sourceTargetFieldMap: item.mdmSourceTargetFieldName
                //     });
                // }
                list.push(item);

                return list;
            }, []);
        });
    }
}

export default DataModelService;
