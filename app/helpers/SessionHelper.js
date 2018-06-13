// @flow
import Intercom from 'react-native-intercom';
// import ReactNativeUA from 'react-native-ua';
import RNFetchBlob from 'react-native-fetch-blob';

import CompanyService from '../services/CompanyService';
import CustomerService from '../services/CustomerService';
import UserService from '../services/UserService';
import MiscService from '../services/MiscService';
import TeamService from '../services/TeamService';

import ResponseHelper from '../helpers/ResponseHelper';
import { generateUUID } from '../helpers/utils/uuid';

import Company, { initialFavoriteCompanyTaxIds } from '../models/Company';
import User, { loginType } from '../models/User';
import FluigData from '../models/FluigData';
import Team from '../models/Team';

class SessionHelper {

    /// COMPANIES

    static _getCompaniesWithTaxIds (taxIds: Array<string>) {
        return new Promise((resolve) => {
            CompanyService.getAllWithTaxIds(
                taxIds,
                (companies) => resolve(companies),
                () => resolve([])
            );
        });
    }

    static _getCompaniesWithIds (ids: Array<string>) {
        return new Promise((resolve) => {
            CompanyService.getAllWithIds(
                ids,
                (companies) => resolve(companies),
                () => resolve([])
            );
        });
    }

    static _getCustomersWithTaxIds (taxIds: Array<string>) {
        return new Promise((resolve) => {
            CustomerService.getAllWithTaxIds(
                taxIds,
                (customers) => resolve(customers),
                () => resolve([])
            );
        });
    }

    static _saveFavoriteCompanies (companies: Array<Object>, customers: Array<Object>) {
        companies = companies.map((company) => (
            {
                ...company,
                customer: customers.find((customer) => customer.taxId === company.taxId)
            }
        ));

        companies.forEach((company) => {
            company.favorite = true;
            Company.create(company);
            MiscService.addSubscription(company.mdmData.entityTemplateId, company.mdmData.id, () => null);
        });

        UserService.saveFavoriteCompanyIds(companies.map((company) => company.mdmData.id));
    }

    static _updateFavoriteCompanies () {
        return new Promise((resolve) => {
            Company.getAll().forEach((company) => {
                Company.delete(company.mdmData.id);
            });

            this.hadSessionBefore().then((hadSessionBefore) => {
                if (!hadSessionBefore) {
                    this._getCompaniesWithTaxIds(initialFavoriteCompanyTaxIds)
                        .then((companies) => (
                            Promise.all([
                                companies,
                                this._getCustomersWithTaxIds(companies.map((company) => company.taxId)),
                                this._storeFirstSession()])
                            )
                        )
                        .then((results) => {
                            this._saveFavoriteCompanies(results[0], results[1]);
                            resolve(true);
                        })
                        .catch((reason) => {
                            console.log('updateFavoriteCompanies exception', reason); // eslint-disable-line no-console

                            resolve(false);
                        });
                }
                else {
                    UserService.getFavoriteCompanyIds((ids) => {
                        if (ids.length > 0) {
                            this._getCompaniesWithIds(ids)
                                .then((companies) => Promise.all([companies, this._getCustomersWithTaxIds(companies.map((company) => company.taxId))]))
                                .then((results) => {
                                    this._saveFavoriteCompanies(results[0], results[1]);
                                    resolve(true);
                                })
                                .catch((reason) => {
                                    console.log('updateFavoriteCompanies exception', reason); // eslint-disable-line no-console

                                    resolve(false);
                                });
                        }
                        else {
                            resolve(false);
                        }
                    });
                }
            });
        });
    }

    /// USER

    static _storeFirstSession () {
        return new Promise((resolve) => {
            UserService.saveHadSessionBefore(true, () => resolve(true));
        });
    }

    static async _downloadAndSaveImage (url: string, ext: string) {
        const documentsDir = RNFetchBlob.fs.dirs.DocumentDir;
        const profileImagesPath = `${documentsDir}/profileImages`;
        const path = `${profileImagesPath}/${generateUUID()}.${ext}`;

        const isDir = await RNFetchBlob.fs.isDir(profileImagesPath);

        if (!isDir) {
            await RNFetchBlob.fs.mkdir(profileImagesPath);
        }

        const res = await RNFetchBlob
            .config({ fileCache: true, path })
            .fetch('GET', `${url}`);

        return res.path();
    }

    static _getFluigProfileData () {
        return new Promise((resolve, reject) => {
            UserService.getFluigProfileData(resolve, reject);
        });
    }

    static async _getAndSaveFluigProfile (user: Object) {
        const profileData = await this._getFluigProfileData();
        const name = profileData.profile.name;

        if (name) {
            User.update(user.username, { name });
        }

        let url: string;
        let ext: string;

        if (profileData.imageUrl) {
            url = `https://${profileData.imageUrl}`;
            ext = url.substr(url.lastIndexOf('.') + 1);
        }
        else {
            let initials = user.name.match(/\b\w/g) || [];

            initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
            url = `https://placeholdit.imgix.net/~text?txt=${initials}&txtsize=64&w=128&h=128`;
            ext = 'png';
        }

        const imagePath = await this._downloadAndSaveImage(url, ext);

        User.update(user.username, { imagePath });
    }

    /// PUBLIC

    static hadSessionBefore () {
        return new Promise((resolve) => {
            UserService.getHadSessionBefore((hadSessionBefore) => resolve(hadSessionBefore));
        });
    }

    static createSession (username: string, password: string, type: string) {
        return new Promise((resolve) => {
            let logInMethod = MiscService.logIn.bind(MiscService);

            if (type === loginType.fluigIdentity) {
                logInMethod = MiscService.logInWithFluigIdentity.bind(MiscService);
            }

            logInMethod(
                username,
                password,
                (loginResult) => {
                    let user = User.getWithUsername(username);
console.log('/////user', user)
                    if (user) {
                        User.update(user.username, {
                            password,
                            accessToken: loginResult['access_token'],
                            loggedIn: true,
                            loginType: type
                        });
                    }
                    else {
                        User.create({
                            username,
                            password,
                            accessToken: loginResult['access_token'],
                            loggedIn: true,
                            requestedNotification: false,
                            loginType: type
                        });
                    }

                    Intercom.registerIdentifiedUser({ userId: username });

                    UserService.getWithUsername(
                        username,
                        (getUserResult) => {
                            MiscService.getTenant(getUserResult['mdmTenantId'], (getTenantResult) => {
                                if (!user) {
                                    user = User.getWithUsername(username);
                                }

                                User.update(user.username, {
                                    name: getUserResult['mdmName'],
                                    tenantSubDomain: getTenantResult['mdmSubdomain']
                                });

                                this._updateFavoriteCompanies().then(() => {
                                    CompanyService.getNumberOfCompanies((numberOfCompanies) => {
                                        FluigData.updateNumberOfCompanies(numberOfCompanies);

                                        if (type === loginType.fluigIdentity) {
                                            this._getAndSaveFluigProfile(user)
                                            .then(() => resolve(true))
                                            .catch((error) => resolve(error));
                                        }
                                        else {
                                            resolve(true);
                                        }
                                    });
                                });
                            });
                        }
                    );
                },
                (error) => {
                    resolve(error);
                }
            );
        });
    }

    static refreshSession () {
        return new Promise((resolve) => {
            const user = this.currentSession();

            if (user) {
                let logInMethod = MiscService.logIn.bind(MiscService);

                if (user.loginType === loginType.fluigIdentity) {
                    logInMethod = MiscService.logInWithFluigIdentity.bind(MiscService);
                }

                logInMethod(user.username, user.password,
                    (loginResult) => {
                        if (!ResponseHelper.wasSuccessful(loginResult)) {
                            resolve(loginResult);
                        }
                        else {
                            User.update(user.username, {
                                loggedIn: true,
                                accessToken: loginResult['access_token']
                            });

                            resolve(true);
                        }
                    }
                );
            }
            else {
                resolve(false);
            }
        });
    }

    static currentSession () {
        const user = User.getLoggedIn();

        if (user) {
            // ReactNativeUA.set_named_user_id(user.username);
            TeamService.updateServer(Team.getTeamName());
        }

        return user;
    }

    static finishSession () {
        const loggedInUser = User.getLoggedIn();

        if (loggedInUser) {
            User.update(loggedInUser.username, {
                loggedIn: false
            });
        }
    }
}

export default SessionHelper;
