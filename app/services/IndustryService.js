// @flow
import ExploreService from './ExploreService';

import ResponseHelper from '../helpers/ResponseHelper';

import Industry from '../models/Industry';

class IndustryService extends ExploreService {
    static getWithCnaebr (cnaebr: string, success: Function, failure?: Function) {
        return super.createProcessFilterQueryRequest(
            {
                mustList: [
                    {
                        mdmFilterType: 'TYPE_FILTER',
                        mdmValue: 'mdmindustrybrGolden'
                    },
                    {
                        mdmFilterType: 'NESTED_TERMS_FILTER',
                        mdmKey: 'mdmGoldenFieldAndValues.cnaebr.raw',
                        mdmPath: 'mdmGoldenFieldAndValues',
                        mdmValuesField: 'mdmGoldenFieldAndValues.cnaebr',
                        mdmValue: cnaebr
                    }
                ]
            },
            {
                pageSize: -1
            },
            (response) => {
                if (ResponseHelper.hits(response)[0]) {
                    success(Industry.createObjectFromMdmRecord(ResponseHelper.hits(response)[0]));
                }
                else {
                    success(null);
                }
            },
            failure
        );
    }
}

export default IndustryService;
