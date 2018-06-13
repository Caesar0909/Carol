// @flow
class ResponseHelper {
    static wasSuccessful (response) {
        if (response.code) {
            return !response.code >= 400;
        }

        return !response.errorCode;
    }

    static wasUnauthorized (response) {
        return response.errorCode === 401;
    }

    static aggregationBuckets (response) {
        return response.errorCode ? {} : response.aggs && response.aggs.types && response.aggs.types.buckets;
    }

    static totalHits (response) {
        return response.errorCode ? 0 : response.totalHits;
    }

    static timeTaken (response) {
        return response.errorCode ? 0 : response.took;
    }

    static errorCode (response) {
        return response.errorCode;
    }

    static errorMessage (response) {
        return response.errorMessage;
    }

    static hits (response) {
        return response.hits;
    }
}

export default ResponseHelper;
