// @flow
class Email {
    static createObjectFromMdmFields (mdmFields: Object) {
        return {
            emailAddress: mdmFields.mdmemailaddress,
            emailType: mdmFields.mdmemailtype
        };
    }

    static createObjectFromRealmObject (realmObject: Object) {
        return {
            emailAddress: realmObject.emailAddress,
            emailType: realmObject.emailType
        };
    }
}

export default Email;
