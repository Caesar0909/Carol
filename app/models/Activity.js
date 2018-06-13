// @flow
import Realm from 'realm';

class Activity {
    static createObjectFromMdmFields (mdmFields: Object) {
        return {
            description: mdmFields.mdmactivitydescription
        };
    }

    static createObjectFromRealmObject (realmObject: Realm.Object) {
        return {
            description: realmObject.description
        };
    }
}

export default Activity;
