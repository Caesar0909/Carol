// @flow
import MdmRestService from 'totvslabs-ui-framework/react-native/rest/rest.api.js';
import MdmFetchRestService from 'totvslabs-ui-framework/react-native/rest/fetch.rest.api.js';
import MdmService from 'totvslabs-ui-framework/react-native/rest/services/mdm.service.js';

import ResponseHelper from '../helpers/ResponseHelper';
import ServiceHelper from '../helpers/ServiceHelper';
import SessionHelper from '../helpers/SessionHelper';

import makeCancelable from '../helpers/makeCancelable';

const appConfig = {
    domain: 'carol.ai',
    subdomain: '',
    restServer: 'carol.ai',
    restPort: '',
    restBaseUrl: '/api/v1/'
};

class ExploreService {

    static updateConfig (subdomain: string) {
        appConfig.subdomain = subdomain;
        appConfig.restServer = subdomain + '.' + appConfig.domain;
    }

    static _updateAccessToken () {
        const user = SessionHelper.currentSession();

        if (user) {
            MdmRestService.configure().token(user.accessToken);
        }
    }

    static _runRequest (request: Promise<any>, success: Function, failure: Function) {
        MdmRestService.configure()
            .error((data, status) => {
                console.log('runRequest error', data, status); // eslint-disable-line no-console

                failure({
                    type: ServiceHelper.errorTypeForStatus(status),
                    message: ServiceHelper.errorMessageForStatus(status)
                });
            });

        request
            .then((response) => {
                console.log('runRequest response', response); // eslint-disable-line no-console

                if (ResponseHelper.wasSuccessful(response)) {
                    success(response);
                }
                else {
                    failure({
                        type: ServiceHelper.errorTypeForStatus(ResponseHelper.errorCode(response)),
                        message: ResponseHelper.errorMessage(response) ? ResponseHelper.errorMessage(response) : ServiceHelper.errorMessageForStatus(ResponseHelper.errorCode(response))
                    });
                }
            })
            .catch((reason) => {
                console.log('runRequest exception', reason); // eslint-disable-line no-console

                failure({
                    type: ServiceHelper.errorTypeForException(),
                    message: ServiceHelper.errorMessageForException()
                });
            });
    }

    static setupRestService () {
        const baseUrl = `https://${appConfig.restServer}${appConfig.restBaseUrl}`;
        // const baseUrl = 'http://100.11.89.83:7777/api/v1/';

        MdmRestService.configure()
            .baseUrl(baseUrl)
            .restCaller(MdmFetchRestService);

        this._updateAccessToken();
    }

    static createAuthenticatedRequest (requestBuilder: Function, success: Function, failure?: Function) {
        let cancelableRequest = makeCancelable(requestBuilder());

        this._runRequest(
            cancelableRequest.promise,
            success,
            (error) => {
                if (ServiceHelper.wasUnauthorized(error)) {
                    SessionHelper.refreshSession().then(
                        (refreshSessionResponse) => {
                            if (refreshSessionResponse === true) {
                                this._updateAccessToken();

                                cancelableRequest = makeCancelable(requestBuilder());

                                this._runRequest(cancelableRequest.promise, success, failure ? failure : () => null);
                            }
                            else {
                                SessionHelper.finishSession();
                            }
                        }
                    );
                }
                else {
                    failure ? failure(error) : null;
                }
            }
        );

        return cancelableRequest;
    }

    static createProcessFilterQueryRequest (body: Object, queryParams: Object, success: Function, failure?: Function) {
        this.setupRestService();

        return this.createAuthenticatedRequest(() => MdmService.processFilterQuery(body, queryParams), success, failure);
    }

    static createPublicRequest (request: Promise<any>, success: Function, failure?: Function) {
        const cancelableRequest = makeCancelable(request);

        this._runRequest(
            cancelableRequest.promise,
            success,
            (error) => (failure ? failure(error) : null)
        );

        return cancelableRequest;
    }
}

export default ExploreService;
