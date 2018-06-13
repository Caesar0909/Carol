// @flow
import MdmUserService from 'totvslabs-ui-framework/react-native/rest/services/user.service.js';

import ExploreService from './ExploreService';

const favoriteCompaniesKey = 'favoriteCompanies';
const sessionKey = 'session';
const fluigIdentityKey = 'fluig';

class UserService extends ExploreService {
    static _saveProperty (property: string, data: string | Object, success?: Function, failure?: Function) {
        super.setupRestService();

        return super.createAuthenticatedRequest(
            () => MdmUserService.updateUserProperty(property, data),
            success ? success : () => null,
            failure
        );
    }

    static _getProperty (property: string, success: Function, failure?: Function) {
        super.setupRestService();

        return super.createAuthenticatedRequest(
            () => MdmUserService.getUserProperty(property),
            success,
            failure
        );
    }

    static getWithUsername (username: string, success: Function, failure?: Function) {
        super.setupRestService();

        return super.createAuthenticatedRequest(
            () => MdmUserService.getUserByUserLogin(username),
            success,
            failure
        );
    }

    static inviteUser (email: string, name: string, tenantSubDomain: string, success: Function, failure?: Function) {
        super.setupRestService();
        
        return super.createAuthenticatedRequest(
            () => MdmUserService.inviteUser(
                'mdmTenantInvite',
                email,
                name,
                `https://${tenantSubDomain}.fluigdata.com/mdm-ui/#/register?`,
                'explorer',
                'explore'
            ),
            success,
            failure
        );
    }

    static saveFavoriteCompanyIds (companyIds: Array<string>, success?: Function, failure?: Function) {
        return this._saveProperty(
            favoriteCompaniesKey,
            { companyIds },
            success,
            failure
        );
    }

    static getFavoriteCompanyIds (success: Function, failure?: Function) {
        return this._getProperty(
            favoriteCompaniesKey,
            (response) => (success(response.companyIds ? response.companyIds : [])),
            failure
        );
    }

    static saveHadSessionBefore (hadSessionBefore: boolean, success?: Function, failure?: Function) {
        return this._saveProperty(
            sessionKey,
            { hadSessionBefore },
            success,
            failure
        );
    }

    static getHadSessionBefore (success: Function, failure?: Function) {
        return this._getProperty(
            sessionKey,
            (response) => success(response.hadSessionBefore),
            failure
        );
    }

    static getFluigProfileData (success: Function, failure?: Function) {
        return this._getProperty(
            fluigIdentityKey,
            (response) => success(response),
            failure
        );
    }
}

export default UserService;
