// @flow
import MdmTenantService from 'totvslabs-ui-framework/react-native/rest/services/tenant.service.js';

import ExploreService from './ExploreService';
import MiscService from './MiscService';
import Team from '../models/Team';

class TeamService extends ExploreService {

    static checkServer (subdomain: string, success: Function, failure?: Function) {
        Team.updateTeamName(subdomain);
        super.updateConfig(subdomain);
        MiscService.updateSubdomain(subdomain);

        super.setupRestService();
        
        return super.createAuthenticatedRequest(
            () => MdmTenantService.getTenantByDomain(subdomain),
            success,
            failure
        );
    }

    static updateServer (subdomain: string) {
        //Team.updateTeamName(subdomain);
        super.updateConfig(subdomain);
        MiscService.updateSubdomain(subdomain);
    }

}

export default TeamService;
