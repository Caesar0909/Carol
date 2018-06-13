// @flow
import Realm from 'realm';

class MdmData {
    static createObjectFromMdmRecord (mdmRecord: Object) {
        return {
            id: mdmRecord.mdmId,
            entityTemplateId: mdmRecord.mdmEntityTemplateId
        };
    }

    static createObjectFromRealmObject (realmObject: Realm.Object) {
        return {
            id: realmObject.id,
            entityTemplateId: realmObject.entityTemplateId
        };
    }
}

export default MdmData;
