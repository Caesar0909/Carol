// @flow
import Realm from 'realm';
import realm from '../helpers/realm';

class Team {
    static _get () {
        return realm.objects('Team').values().next().value;
    }

    static _create (team: Object) {
        realm.write(() => {
            team = realm.create('Team', team);
        });
    }

    static _update (team: Realm.Object, updateObject: Object) {
        realm.write(() => {
            Object.assign(team, updateObject);
        });
    }

    static getTeamName () {
        const team = this._get();

        return team ? team.teamName : '';
    }

    static updateTeamName (teamName: string) {
        const team = this._get();

        if (!team) {
            this._create({ teamName });
        }
        else {
            this._update(team, { teamName });
        }
    }
}

export default Team;
