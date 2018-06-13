// @flow
import ExploreService from './ExploreService';

import ResponseHelper from '../helpers/ResponseHelper';

import Ticket, { openTicketStatus } from '../models/Ticket';

class TicketService extends ExploreService {
    static getAllOpenWithCompanyCode (companyCode: string, success: Function, failure?: Function) {
        return super.createProcessFilterQueryRequest(
            {
                mustList: [
                    {
                        mdmFilterType: 'TYPE_FILTER',
                        mdmValue: 'ticketGolden'
                    },
                    {
                        mdmFilterType: 'NESTED_TERM_FILTER',
                        mdmPath: 'mdmGoldenFieldAndValues',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmcompanycode.raw',
                        mdmValue: companyCode
                    },
                    {
                        mdmFilterType: 'NESTED_TERM_FILTER',
                        mdmPath: 'mdmGoldenFieldAndValues',
                        mdmKey: 'mdmGoldenFieldAndValues.mdmstatus.raw',
                        mdmValue: openTicketStatus
                    }
                ]
            },
            {
                pageSize: -1
            },
            (response) => success(ResponseHelper.hits(response).map((mdmRecord) => Ticket.createObjectFromMdmRecord(mdmRecord))),
            failure
        );
    }
}

export default TicketService;
