// @flow
import realm from '../helpers/realm';

class PersistenceHelper {
    static addChangeListener (listener: Function) {
        realm.addListener('change', listener);
    }

    static removeChangeListener (listener: Function) {
        realm.removeListener('change', listener);
    }
}

export default PersistenceHelper;
