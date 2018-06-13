// @flow
class Phone {
    static createObjectFromMdmFields (mdmFields: Object) {
        return {
            phoneNumber: mdmFields.mdmphonenumber,
            phoneType: mdmFields.mdmphonetype
        };
    }

    static createObjectFromRealmObject (realmObject: Object) {
        return {
            phoneNumber: realmObject.phoneNumber,
            phoneType: realmObject.phoneType
        };
    }
}

export default Phone;
