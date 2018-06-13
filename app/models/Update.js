// @flow
import Realm from 'realm';

import realm from '../helpers/realm';
import SessionHelper from '../helpers/SessionHelper';

export const updateTypeKeys = {
    opportunity: 'mdmopportunityGolden',
    ticket: 'ticketGolden',
    company: 'mdmcompanyGolden',
    nps: 'mdmnpsGolden',
    customer: 'mdmcustomerGolden'
};

class Update {
    static create (update: Object) {
        update.user = SessionHelper.currentSession();

        realm.write(() => {
            realm.create('Update', update);
        });
    }

    static get (id: string) {
        const loggedInUser = SessionHelper.currentSession();

        if (loggedInUser) {
            const updateResults = realm.objects('Update').snapshot();

            return updateResults.filtered('id = $0 && user.username = $1', id, loggedInUser.username).values().next().value;
        }

        return null;
    }

    static getAllForType (type: string) {
        const loggedInUser = SessionHelper.currentSession();

        if (loggedInUser) {
            const updateResults = realm.objects('Update').snapshot();

            return Array.from(updateResults.filtered('type = $0 && user.username = $1', type, loggedInUser.username)).slice(0, updateResults.length);
        }

        return [];
    }

    static update (update: Realm.Object, updateObject: Object) {
        realm.write(() => {
            update = Object.assign(update, updateObject);
        });
    }

    static delete (id: string) {
        const update = this.get(id);

        if (update) {
            realm.write(() => {
                realm.delete(update);
            });
        }
    }

    static deleteAllForType (type: string) {
        const updates = this.getAllForType(type);

        realm.write(() => {
            updates.forEach((update) => {
                realm.delete(update);
            });
        });
    }

    static unreadCount () {
        return realm.objects('Update').snapshot().filtered('unread = true').length;
    }

    static addListener (listener: Function) {
        realm.addListener('change', listener);
    }

    static removeListener (listener: Function) {
        realm.removeListener('change', listener);
    }
}

export default Update;
