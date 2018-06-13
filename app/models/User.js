// @flow
import realm from '../helpers/realm';

export const loginType = {
    explore: 'explore',
    fluigIdentity: 'fluigIdentity'
};

class User {
    static create (user: Object) {
        realm.write(() => {
            user = realm.create('User', user);
        });
    }

    static update (username: string, updateObject: Object) {
        let user = this.getWithUsername(username);

        realm.write(() => {
            user = Object.assign(user, updateObject);
        });
    }

    static getWithUsername (username: string) {
        const allUsersResult = realm.objects('User');

        return allUsersResult.filtered('username = $0', username).values().next().value;
    }

    static getLoggedIn () {
        const allUsersResult = realm.objects('User');

        return allUsersResult.filtered('loggedIn = true').values().next().value;
    }
}

export default User;
