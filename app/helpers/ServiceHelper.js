// @flow

const badRequestKey = 'BadRequest';
const unauthorizedKey = 'Unauthorized';
const unknownKey = 'Unknown';
const exceptionKey = 'Exception';

class ServiceHelper {
    static wasUnauthorized (error) {
        return error.type === unauthorizedKey;
    }

    static errorTypeForStatus (status: any) {
        switch (status) {
            case 401:
                return unauthorizedKey;
            case 400:
                return badRequestKey;
            default:
                return unknownKey;
        }
    }

    static errorTypeForException () {
        return exceptionKey;
    }

    static errorMessageForStatus (status: any) {
        switch (status) {
            case 401:
                return '';
            case 400:
                return '';
            default:
                return '';
        }
    }

    static errorMessageForException () {
        return '';
    }
}

export default ServiceHelper;
