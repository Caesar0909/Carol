// @flow
import ExploreService from './ExploreService';

import ResponseHelper from '../helpers/ResponseHelper';

import Company from '../models/Company';

import MdmDasService from 'totvslabs-ui-framework/react-native/rest/services/dashboard.service.js';

class CompanyService extends ExploreService {

    static getRecordStats (mdms: Array<string>, period: string, success: Function, failure?: Function) {
        return super.createAuthenticatedRequest(
            () => MdmDasService.getRecordStats(mdms, period),
            success,
            failure
        );
    }

    static getExploreStat (success: Function, failure?: Function) {
        return super.createAuthenticatedRequest(
            () => MdmDasService.getExploreStatistics(),
            success,
            failure
        );
    }

    static getMobileDataModel (success: Function, failure?: Function) {
        return super.createAuthenticatedRequest(
            () => MdmDasService.getMobileDataModel(),
            success,
            failure
        );
    }

    static getNumberOfCompanies (success: Function, failure?: Function) {
        return super.createProcessFilterQueryRequest(
            {
                mustList: [
                    {
                        mdmFilterType: 'TYPE_FILTER',
                        mdmValue: 'mdmcompanyGolden'
                    }
                ]
            },
            {
                pageSize: 0
            },
            (response) => success(ResponseHelper.totalHits(response)),
            failure
        );
    }

    static search (query: string, pageSize: number, offset: number, success: Function, failure?: Function) {
        return super.createProcessFilterQueryRequest(
            {
                mustList: [
                    {
                        mdmFilterType: 'TYPE_FILTER',
                        mdmValue: 'mdmcompanyGolden'
                    },
                    {
                        mdmFilterType: 'NESTED_EXISTS_FILTER',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmname.raw',
                        mdmPath: 'mdmGoldenFieldAndValues'
                    }
                ],
                shouldList: [
                    {
                        mdmFilterType: 'NESTED_TERM_FILTER',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmtaxid.raw',
                        mdmPath: 'mdmGoldenFieldAndValues',
                        mdmValue: query
                    },
                    {
                        mdmFilterType: 'NESTED_SIMPLE_QUERY_STRING',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmname',
                        mdmPath: 'mdmGoldenFieldAndValues',
                        mdmValue: query
                    },
                    {
                        mdmFilterType: 'NESTED_SIMPLE_QUERY_STRING',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmname',
                        mdmPath: 'mdmGoldenFieldAndValues',
                        mdmValue: query + '*~2'
                    },
                    {
                        mdmFilterType: 'NESTED_SIMPLE_QUERY_STRING',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmdba',
                        mdmPath: 'mdmGoldenFieldAndValues',
                        mdmValue: query
                    },
                    {
                        mdmFilterType: 'NESTED_SIMPLE_QUERY_STRING',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmdba',
                        mdmPath: 'mdmGoldenFieldAndValues',
                        mdmValue: query + '*~2'
                    }
                ],
                mustNotList: [
                    {
                        mdmFilterType: 'NESTED_TERM_FILTER',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmname.raw',
                        mdmPath: 'mdmGoldenFieldAndValues',
                        mdmValue: ''
                    }
                ]
            },
            {
                pageSize,
                offset
            },
            (response) => success(ResponseHelper.hits(response).map((mdmRecord) => Company.createObjectFromMdmRecord(mdmRecord)), ResponseHelper.totalHits(response)),
            failure
        );
    }

    static getWithId (id: string, success: Function, failure?: Function) {
        return super.createProcessFilterQueryRequest(
            {
                mustList: [
                    {
                        mdmFilterType: 'TYPE_FILTER',
                        mdmValue: 'mdmcompanyGolden'
                    },
                    {
                        mdmFilterType: 'TERM_FILTER',
                        mdmKey: 'mdmId.raw',
                        mdmValue: id
                    },
                    {
                        mdmFilterType: 'NESTED_EXISTS_FILTER',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmname.raw',
                        mdmPath: 'mdmGoldenFieldAndValues'
                    }
                ],
                mustNotList: [
                    {
                        mdmFilterType: 'NESTED_TERM_FILTER',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmname.raw',
                        mdmPath: 'mdmGoldenFieldAndValues',
                        mdmValue: ''
                    }
                ]
            },
            {
                pageSize: -1
            },
            (response) => {
                if (ResponseHelper.hits(response)[0]) {
                    success(Company.createObjectFromMdmRecord(ResponseHelper.hits(response)[0]));
                }
                else {
                    success(null);
                }
            },
            failure
        );
    }

    static getAllWithIds (ids: Array<string>, success: Function, failure?: Function) {
        return super.createProcessFilterQueryRequest(
            {
                mustList: [
                    {
                        mdmFilterType: 'TYPE_FILTER',
                        mdmValue: 'mdmcompanyGolden'
                    },
                    {
                        mdmFilterType: 'TERMS_FILTER',
                        mdmKey: 'mdmId.raw',
                        mdmValue: ids
                    },
                    {
                        mdmFilterType: 'NESTED_EXISTS_FILTER',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmname.raw',
                        mdmPath: 'mdmGoldenFieldAndValues'
                    }
                ],
                mustNotList: [
                    {
                        mdmFilterType: 'NESTED_TERM_FILTER',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmname.raw',
                        mdmPath: 'mdmGoldenFieldAndValues',
                        mdmValue: ''
                    }
                ]
            },
            {
                pageSize: -1
            },
            (response) => success(ResponseHelper.hits(response).map((mdmRecord) => Company.createObjectFromMdmRecord(mdmRecord))),
            failure
        );
    }

    static getAllWithTaxIds (taxIds: Array<string>, success: Function, failure?: Function) {
        return super.createProcessFilterQueryRequest(
            {
                mustList: [
                    {
                        mdmFilterType: 'TYPE_FILTER',
                        mdmValue: 'mdmcompanyGolden'
                    },
                    {
                        mdmFilterType: 'NESTED_TERMS_FILTER',
                        mdmPath: 'mdmGoldenFieldAndValues',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmtaxid.raw',
                        mdmValue: taxIds
                    },
                    {
                        mdmFilterType: 'NESTED_EXISTS_FILTER',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmname.raw',
                        mdmPath: 'mdmGoldenFieldAndValues'
                    }
                ],
                mustNotList: [
                    {
                        mdmFilterType: 'NESTED_TERM_FILTER',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmname.raw',
                        mdmPath: 'mdmGoldenFieldAndValues',
                        mdmValue: ''
                    }
                ]
            },
            {
                pageSize: -1
            },
            (response) => success(ResponseHelper.hits(response).map((mdmRecord) => Company.createObjectFromMdmRecord(mdmRecord))),
            failure
        );
    }

    static getRelatedCompanies (taxId: string, success: Function, failure?: Function) {
        return super.createProcessFilterQueryRequest(
            {
                mustList: [
                    {
                        mdmFilterType: 'TYPE_FILTER',
                        mdmValue: 'mdmcompanyGolden'
                    },
                    {
                        mdmFilterType: 'NESTED_WILDCARD_FILTER',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmtaxid.raw',
                        mdmPath: 'mdmGoldenFieldAndValues',
                        mdmValue: `${taxId.substring(0, 8)}*`
                    },
                    {
                        mdmFilterType: 'NESTED_EXISTS_FILTER',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmname.raw',
                        mdmPath: 'mdmGoldenFieldAndValues'
                    }
                ],
                mustNotList: [
                    {
                        mdmFilterType: 'NESTED_WILDCARD_FILTER',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmtaxid.raw',
                        mdmPath: 'mdmGoldenFieldAndValues',
                        mdmValue: taxId
                    },
                    {
                        mdmFilterType: 'NESTED_TERM_FILTER',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmname.raw',
                        mdmPath: 'mdmGoldenFieldAndValues',
                        mdmValue: ''
                    }
                ]
            },
            {
                pageSize: -1
            },
            (response) => success(ResponseHelper.hits(response).map((mdmRecord) => Company.createObjectFromMdmRecord(mdmRecord))),
            failure
        );
    }
}

export default CompanyService;
