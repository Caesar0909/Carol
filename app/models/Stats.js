// @flow
import Realm from 'realm';
import realm from '../helpers/realm';

class Stats {
    static _get () {
        return realm.objects('Stats').values().next().value;
    }

    static _create (stats: Object) {
        realm.write(() => {
            stats = realm.create('Stats', stats);
        });
    }

    static _update (stats: Realm.Object, updateObject: Object) {
        realm.write(() => {
            Object.assign(stats, updateObject);
        });
    }

    static getStats () {
        const stats = this._get();

        return stats ? stats.data : '';
    }

    static updateStats (data: string) {
        const stats = this._get();

        if (!stats) {
            this._create({ data });
        }
        else {
            this._update(stats, { data });
        }
    }
}

export default Stats;
