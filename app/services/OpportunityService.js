// @flow
import ExploreService from './ExploreService';

import ResponseHelper from '../helpers/ResponseHelper';

import Opportunity, { openOpportunityStatus } from '../models/Opportunity';

class OpportunityService extends ExploreService {
    static getAllOpenWithCompanyCode (companyCode: string, success: Function, failure?: Function) {
        return super.createProcessFilterQueryRequest(
            {
                mustList: [
                    {
                        mdmFilterType: 'TYPE_FILTER',
                        mdmValue: 'mdmopportunityGolden'
                    },
                    {
                        mdmFilterType: 'NESTED_TERM_FILTER',
                        mdmPath: 'mdmGoldenFieldAndValues',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmcompanycode.raw',
                        mdmValue: `${companyCode}`
                    },
                    {
                        mdmFilterType: 'NESTED_TERM_FILTER',
                        mdmPath: 'mdmGoldenFieldAndValues',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmstatus.raw',
                        mdmValue: openOpportunityStatus
                    }
                ]
            },
            {
                pageSize: -1
            },
            (response) => success(ResponseHelper.hits(response).map((mdmRecord) => Opportunity.createObjectFromMdmRecord(mdmRecord)), ResponseHelper.totalHits(response)),
            failure
        );
    }
}

export default OpportunityService;
