// @flow
import Realm from 'realm';

import realm from '../helpers/realm';

class Insights {

    static createObjectFromMdmFields (mdmFields: Object) {
        return {
            id: mdmFields.mdmId,
            label: mdmFields.mdmConfigLabel,
            accessType: mdmFields.mdmAccessType,
            namedQueryName: mdmFields.mdmNamedQueryName
        };
    }

    static createObjectFromRealm (realmObj: Object) {
        return {
            id: realmObj.id,
            label: realmObj.label,
            accessType: realmObj.accessType,
            namedQueryName: realmObj.namedQueryName
        };
    }

    static createObjectFromMdmRecord (rawData: Object) {

        const result = this.createObjectFromMdmFields(rawData);

        if (rawData.mdmInsightConfiguration) {
            result.config = JSON.parse(rawData.mdmInsightConfiguration);
        }

        return result;
    }

    static createObjectFromRealmObject (realmObject: Realm.Object) {

        const result = this.createObjectFromRealm(realmObject);

        if (realmObject.config) {
            result.config = JSON.parse(realmObject.config);
        }

        return result;
    }

    // PERSISTENCE

    static createPersistObj (modelObj) {
        const obj = {};

        obj.id = modelObj.id;
        obj.label = modelObj.label;
        obj.accessType = modelObj.accessType ? modelObj.accessType : '';
        obj.insights = modelObj.insights;
        obj.namedQueryName = modelObj.namedQueryName ? modelObj.namedQueryName : '';

        obj.config = JSON.stringify(modelObj.config);

        return obj;
    }

    static create (insights: Object) {

        realm.write(() => {
            realm.create('Insights', Insights.createPersistObj(insights));
        });
    }

    static update (mdmDataId: string, updateObject: Object) {
        const insight = this.getWithId(mdmDataId);

        if (insight) {
            realm.write(() => {
                Object.assign(insight, Insights.createPersistObj(updateObject));
            });
        } else {
            realm.write(() => {
                realm.create('Insights', Insights.createPersistObj(updateObject));
            });
        }
    }

    static delete (mdmDataId: string) {
        const insight = this.getWithId(mdmDataId);

        if (insight) {
            realm.write(() => {
                realm.delete(insight);
            });
        }
    }

    static getWithId (mdmDataId: string) {

        const results = realm.objects('Insights').snapshot();
        
        return results.filtered('mdmData.id = $0', mdmDataId).values().next().value;
        
    }

    static deleteAll () {
        const results = realm.objects('Insights').snapshot();

        results.forEach((insight) => {
            realm.write(() => {
                realm.delete(insight);
            });
        });
    }

    static getAll () {

        const results = realm.objects('Insights').snapshot();

        if (results)
            return Array.from(results).slice(0, results.length);
        else 
            return [];
    }
}

export default Insights;
