// @flow
import { arrayToString } from '../helpers/utils/array';

class Address {
    static createObjectFromMdmFields (mdmFields: Object) {
        return {
            address1: mdmFields.mdmaddress1,
            address2: mdmFields.mdmaddress2,
            address3: mdmFields.mdmaddress3,
            addressType: mdmFields.mdmaddresstype,
            city: mdmFields.mdmcity,
            country: mdmFields.mdmcountry,
            state: mdmFields.mdmstate,
            zipcode: mdmFields.mdmzipcode,
            latitude: mdmFields.mdmcoordinates ? mdmFields.mdmcoordinates.lat : null,
            longitude: mdmFields.mdmcoordinates ? mdmFields.mdmcoordinates.lon : null
        };
    }

    static createObjectFromRealmObject (realmObject: Object) {
        return {
            address1: realmObject.address1,
            address2: realmObject.address2,
            address3: realmObject.address3,
            addressType: realmObject.addressType,
            city: realmObject.city,
            country: realmObject.country,
            state: realmObject.state,
            zipcode: realmObject.zipcode,
            latitude: realmObject.latitude,
            longitude: realmObject.longitude
        };
    }

    static getShortAddress (address: Object) {
        return arrayToString([
            address.city,
            address.state,
            address.country
        ]);
    }
}

export default Address;
