// @flow

export const openTicketStatus = '1';

class Ticket {
    static createObjectFromMdmRecord (mdmRecord: Object) {
        return {
            code: mdmRecord.mdmGoldenFieldAndValues.ticketcode,
            externalInteractionsCount: mdmRecord.mdmGoldenFieldAndValues.externalinteractionsnum,
            internalInteractionsCount: mdmRecord.mdmGoldenFieldAndValues.internalinteractionsnum,
            creationDate: mdmRecord.mdmGoldenFieldAndValues.mdmcreationdate,
            description: mdmRecord.mdmGoldenFieldAndValues.mdmdescription,
            lastUpdated: mdmRecord.mdmLastUpdated,
            status: mdmRecord.mdmGoldenFieldAndValues.mdmstatus
        };
    }
}

export default Ticket;
