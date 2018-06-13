// @flow
class Industry {
    static createObjectFromMdmFields (mdmFields: Object) {
        return {
            description: mdmFields.mdmdescription
        };
    }

    static createObjectFromMdmRecord (mdmRecord: Object) {
        return this.createObjectFromMdmFields(mdmRecord.mdmGoldenFieldAndValues);
    }
}

export default Industry;
