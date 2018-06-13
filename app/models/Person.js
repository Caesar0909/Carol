// @flow
import realm from '../helpers/realm';

import MdmData from './MdmData';

class Person {
    static createObjectFromMdmFields (mdmFields: Object) {
        return {
            taxId: mdmFields.mdmtaxid,
            companyCode: mdmFields.mdmcompanycode,
            homePage: mdmFields.mdmhomepage
        };
    }

    static createObjectFromMdmRecord (mdmRecord: Object) {
        return {
            ...Person.createObjectFromMdmFields(mdmRecord.mdmGoldenFieldAndValues),
            mdmData: MdmData.createObjectFromMdmRecord(mdmRecord)
        };
    }

    static getWithId (mdmDataId: string) {
        return realm.objects('Person').snapshot().filtered('mdmData.id = $0', mdmDataId).values().next().value;
    }
}

export default Person;
