// @flow
import realm from '../helpers/realm';

import Address from './Address';
import Email from './Email';
import Phone from './Phone';
import MdmData from './MdmData';

class Customer {
    static createObjectFromMdmFields (mdmFields: Object) {
        return {
            taxId: mdmFields.mdmtaxid,
            companyCode: mdmFields.mdmcompanycode,
            companyName: mdmFields.mdmcompanyname,
            doingBusinessAs: mdmFields.mdmdba,
            homePage: mdmFields.mdmhomepage,
            industryCode: mdmFields.mdmindustry,
            firstPurchaseDate: mdmFields.mdmfirstpurchasedate
        };
    }

    static createObjectFromMdmRecord (mdmRecord: Object) {
        const fields = mdmRecord.mdmGoldenFieldAndValues;

        return {
            ...Customer.createObjectFromMdmFields(mdmRecord.mdmGoldenFieldAndValues),
            addresses: fields.mdmaddress.map((addressFields) =>
                Address.createObjectFromMdmFields(addressFields)
            ),
            emails: fields.mdmemail.map((emailFields) =>
                Email.createObjectFromMdmFields(emailFields)
            ),
            phones: fields.mdmphone ? fields.mdmphone.map((phoneFields) =>
                Phone.createObjectFromMdmFields(phoneFields)
            ) : [],
            mdmData: MdmData.createObjectFromMdmRecord(mdmRecord)
        };
    }

    static getWithId (mdmDataId: string) {
        return realm.objects('Customer').snapshot().filtered('mdmData.id = $0', mdmDataId).values().next().value;
    }
}

export default Customer;
