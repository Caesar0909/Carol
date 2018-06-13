// @flow
import ExploreService from './ExploreService';

import ResponseHelper from '../helpers/ResponseHelper';

import Nps from '../models/Nps';

class NpsService extends ExploreService {
    static getTwoMostRecentWithCompanyCode (companyCode: string, success: Function, failure?: Function) {
        return super.createProcessFilterQueryRequest(
            {
                mustList: [
                    {
                        mdmFilterType: 'TYPE_FILTER',
                        mdmValue: 'mdmnpsGolden'
                    },
                    {
                        mdmFilterType: 'NESTED_TERM_FILTER',
                        mdmPath: 'mdmGoldenFieldAndValues',
                        mdmKey: 'mdmGoldenFieldAndValues.customercode.raw',
                        mdmValue: `${companyCode}`
                    }
                ]
            },
            {
                pageSize: 2,
                sortBy: 'mdmGoldenFieldAndValues.mdmeventdate'
            },
            (response) => success(ResponseHelper.hits(response).map((mdmRecord) => Nps.createObjectFromMdmRecord(mdmRecord)), ResponseHelper.totalHits(response)),
            failure
        );
    }
}

export default NpsService;
