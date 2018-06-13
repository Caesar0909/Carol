// @flow
import ExploreService from './ExploreService';

import ResponseHelper from '../helpers/ResponseHelper';

import Customer from '../models/Customer';

class CustomerService extends ExploreService {
    static getAllWithTaxIds (taxIds: Array<string>, success: Function, failure?: Function) {
        return super.createProcessFilterQueryRequest(
            {
                mustList: [
                    {
                        mdmFilterType: 'TYPE_FILTER',
                        mdmValue: 'mdmcustomerGolden'
                    },
                    {
                        mdmFilterType: 'TERMS_FILTER', /* 'NESTED_TERMS_FILTER',*/
                        // mdmPath: 'mdmGoldenFieldAndValues',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmtaxid.raw',
                        mdmValue: taxIds
                    }
                ]
            },
            {
                pageSize: -1
            },
            (response) => success(ResponseHelper.hits(response).map((mdmRecord) => ({
                ...Customer.createObjectFromMdmRecord(mdmRecord),
                _raw: mdmRecord
            }))),
            failure
        );
    }
}

export default CustomerService;
