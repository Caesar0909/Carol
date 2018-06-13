// @flow
import { CNPJ } from 'cpf_cnpj';
import Realm from 'realm';

import realm from '../helpers/realm';
import SessionHelper from '../helpers/SessionHelper';

import Activity from './Activity';
import Address from './Address';
import Email from './Email';
import Phone from './Phone';
import MdmData from './MdmData';

export const initialFavoriteCompanyTaxIds = [
    '17298092000130',
    '60746948000112',
    '33000167000101',
    '02916265000160',
    '33592510000154',
    '01838723000127',
    '33256439000139',
    '42150391000170',
    '01027058000191',
    '05914650000166',
    '33611500000119'
];

class Company {
    static createObjectFromMdmFields (mdmFields: Object) {
        return {
            name: mdmFields.mdmname,
            dba: mdmFields.mdmdba,
            cnaebr: mdmFields.industrybr,
            taxId: mdmFields.mdmtaxid,
            marketValue: mdmFields.marketvalue,
            numberOfEmployees: mdmFields.numberofemployees,
            homePage: mdmFields.mdmhomepage,
            revenue: mdmFields.companyrevenue,
            registerDate: mdmFields.mdmregisterdate
        };
    }

    static createObjectFromMdmRecord (mdmRecord: Object) {
        const fields = mdmRecord.mdmGoldenFieldAndValues;

        return {
            ...this.createObjectFromMdmFields(fields),
            mainActivity: fields.mdmmainactivity && fields.mdmmainactivity.reduce((mainActivity, activityFields) =>
                Activity.createObjectFromMdmFields(activityFields)
            , null),
            secondaryActivities: fields.mdmsecondaryactivity && fields.mdmsecondaryactivity.map((activityFields) =>
                Activity.createObjectFromMdmFields(activityFields)
            ),
            addresses: fields.mdmaddress.map((addressFields) =>
                Address.createObjectFromMdmFields(addressFields)
            ),
            emails: fields.mdmemail && fields.mdmemail.map((emailFields) =>
                Email.createObjectFromMdmFields(emailFields)
            ),
            phones: fields.mdmphone && fields.mdmphone.map((phoneFields) =>
                Phone.createObjectFromMdmFields(phoneFields)
            ),
            _raw: {
                mdmGoldenFieldAndValues: mdmRecord.mdmGoldenFieldAndValues,
                mdmMasterFieldAndValues: mdmRecord.mdmMasterFieldAndValues
            },
            mdmData: MdmData.createObjectFromMdmRecord(mdmRecord)
        };
    }

    static createObjectFromRealmObject (realmObject: Realm.Object) {
        return {
            favorite: realmObject.favorite,
            name: realmObject.name,
            dba: realmObject.dba,
            cnaebr: realmObject.cnaebr,
            taxId: realmObject.taxId,
            marketValue: realmObject.marketValue,
            numberOfEmployees: realmObject.numberOfEmployees,
            homePage: realmObject.homePage,
            revenue: realmObject.revenue,
            registerDate: realmObject.registerDate,
            lastViewed: realmObject.lastViewed,
            mainActivity: realmObject.mainActivity !== null ? Activity.createObjectFromRealmObject(realmObject.mainActivity) : null,
            secondaryActivities: realmObject.secondaryActivities.map((activity) =>
                Activity.createObjectFromRealmObject(activity)
            ),
            addresses: realmObject.addresses.map((address) =>
                Address.createObjectFromRealmObject(address)
            ),
            emails: realmObject.emails.map((email) =>
                Email.createObjectFromRealmObject(email)
            ),
            phones: realmObject.phones.map((phone) =>
                Phone.createObjectFromRealmObject(phone)
            ),
            mdmData: MdmData.createObjectFromRealmObject(realmObject.mdmData)
        };
    }

    // PERSISTENCE

    static create (company: Object) {
        company.user = SessionHelper.currentSession();

        realm.write(() => {
            realm.create('Company', company);
        });
    }

    static update (mdmDataId: string, updateObject: Object) {
        let company = this.getWithId(mdmDataId);

        if (company) {
            realm.write(() => {
                Object.assign(company, updateObject);
            });
        }
    }

    static delete (mdmDataId: string) {
        const company = this.getWithId(mdmDataId);

        if (company) {
            realm.write(() => {
                realm.delete(company);
            });
        }
    }

    static getWithId (mdmDataId: string) {
        const loggedInUser = SessionHelper.currentSession();

        if (loggedInUser) {
            const companyResults = realm.objects('Company').snapshot();

            return companyResults.filtered('mdmData.id = $0 && user.username = $1', mdmDataId, loggedInUser.username).values().next().value;
        }

        return null;
    }

    static getWithCustomerId (customerMdmDataId: string) {
        const loggedInUser = SessionHelper.currentSession();

        if (loggedInUser) {
            const companyResults = realm.objects('Company').snapshot();

            return companyResults.filtered('customer.mdmData.id = $0 && user.username = $1', customerMdmDataId, loggedInUser.username).values().next().value;
        }

        return null;
    }

    static getAll () {
        const loggedInUser = SessionHelper.currentSession();

        if (loggedInUser) {
            const companyResults = realm.objects('Company').snapshot();

            return Array.from(companyResults.filtered('user.username = $0', loggedInUser.username)).slice(0, companyResults.length);
        }

        return [];
    }

    // UTILS

    static isHQ (company: Object) {
        switch (company.addresses[0].country) {
            default:
                const formattedTaxId = CNPJ.format(company.taxId);
                const branch = formattedTaxId.substring(11, 15);

                return branch === '0001';
        }
    }

    static getFormattedTaxId (company: Object) {
        switch (company.addresses[0].country) {
            default:
                return CNPJ.format(company.taxId);
        }
    }

    static getHomePage (company: Object) {
        if (company.homePage) {
            return company.homePage;
        }

        if (company.customer && company.customer.homePage) {
            return company.customer.homePage;
        }

        return null;
    }
}

export default Company;
