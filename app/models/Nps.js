// @flow
class Nps {
    static createObjectFromMdmFields (mdmFields: Object) {
        return {
            score: mdmFields.nps,
            eventDate: mdmFields.mdmeventdate
        };
    }

    static createObjectFromMdmRecord (mdmRecord: Object) {
        return this.createObjectFromMdmFields(mdmRecord.mdmGoldenFieldAndValues);
    }
}

export default Nps;
