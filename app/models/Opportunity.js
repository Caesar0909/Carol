// @flow

export const openOpportunityStatus = 'open';

class Opportunity {
    static createObjectFromMdmRecord (mdmRecord: Object) {
        return {
            description: mdmRecord.mdmGoldenFieldAndValues.mdmdescription,
            status: mdmRecord.mdmGoldenFieldAndValues.mdmstatus,
            priority: mdmRecord.mdmGoldenFieldAndValues.mdmpriority,
            expectedCloseDate: mdmRecord.mdmGoldenFieldAndValues.expectedclosedate
        };
    }
}

export default Opportunity;
