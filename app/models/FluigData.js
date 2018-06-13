// @flow
import Realm from 'realm';
import realm from '../helpers/realm';

class FluigData {
    static _get () {
        return realm.objects('FluigData').values().next().value;
    }

    static _create (fluigData: Object) {
        realm.write(() => {
            fluigData = realm.create('FluigData', fluigData);
        });
    }

    static _update (fluigData: Realm.Object, updateObject: Object) {
        realm.write(() => {
            Object.assign(fluigData, updateObject);
        });
    }

    static getNumberOfCompanies () {
        const fluigData = this._get();

        return fluigData ? fluigData.numberOfCompanies : 0;
    }

    static updateNumberOfCompanies (numberOfCompanies: number) {
        const fluigData = this._get();

        if (!fluigData) {
            this._create({ numberOfCompanies });
        }
        else {
            this._update(fluigData, { numberOfCompanies });
        }
    }
}

export default FluigData;
