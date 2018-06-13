// @flow
import MdmTenantService from 'totvslabs-ui-framework/react-native/rest/services/tenant.service.js';
import MdmStagingService from 'totvslabs-ui-framework/react-native/rest/services/staging.service.js';
import MdmAuthService from 'totvslabs-ui-framework/react-native/rest/services/auth.service.js';
import MdmPushService from 'totvslabs-ui-framework/react-native/rest/services/push.service.js';
import MdmUserService from 'totvslabs-ui-framework/react-native/rest/services/user.service.js';

import ExploreService from './ExploreService';

const credentials = {
    subdomain: 'mobile',
    applicationId: '0a0829172fc2433c9aa26460c31b78f0'
};

class MiscService extends ExploreService {
    // LOGIN

    static updateSubdomain (subdomain: string) {
        credentials.subdomain = subdomain;
    }

    static logIn (username: string, password: string, success: Function, failure?: Function) {
        super.setupRestService();
        
        return super.createPublicRequest(
            MdmAuthService.grantNewTokenOrRefreshToken(
                'password',
                username,
                password,
                credentials.subdomain,
                credentials.applicationId
            ),
            success,
            failure
        );
    }

    static logInWithFluigIdentity (username: string, password: string, success: Function, failure?: Function) {
        super.setupRestService();

        return super.createPublicRequest(
            MdmUserService.loginUsingExternalApp(
                username,
                password,
                'fluigidentity',
                credentials.subdomain,
                credentials.applicationId
            ),
            success,
            failure
        );
    }

    // TENANT

    static getTenant (tenantId: string, success: Function, failure?: Function) {
        super.setupRestService();

        return super.createAuthenticatedRequest(
            () => MdmTenantService.getTenant(tenantId),
            success,
            failure
        );
    }

    // STAGING

    static saveStagingData (type: string, data: Object, success: Function, failure?: Function) {
        super.setupRestService();

        return super.createAuthenticatedRequest(
            () => MdmStagingService.sendStagingDataInGzipRFC1952Format(type, data),
            success,
            failure
        );
    }

    // PUSH

    static getAllSubscriptions (success: Function, failure?: Function) {
        const queryParam = {
            pageSize: -1
        };

        return super.createAuthenticatedRequest(
            () => MdmPushService.getAllSubscriptions(queryParam),
            success,
            failure
        );
    }

    static addSubscription (entityTemplateId: string, id: string, success: Function, failure?: Function) {
        return super.createAuthenticatedRequest(
            () => MdmPushService.subscribeToGoldenRecord(
                entityTemplateId,
                id,
                {
                    relationshipLabels: ['has ticket', 'has nps', 'has opportunity']
                }),
            success,
            failure
        );
    }

    static deleteSubscription (entityTemplateId: string, id: string, success: Function, failure?: Function) {
        return super.createAuthenticatedRequest(
            () => MdmPushService.deleteSubscription(entityTemplateId, id),
            success,
            failure
        );
    }
}

export default MiscService;
