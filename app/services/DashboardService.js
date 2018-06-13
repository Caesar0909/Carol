// @flow
import ExploreService from './ExploreService';

import ResponseHelper from '../helpers/ResponseHelper';

import Dashboard from '../models/Dashboard';

import tsDashboardService from 'totvslabs-ui-framework/react-native/rest/services/dashboard.service.js';

class DashboardService extends ExploreService {

    static getDashboard (id: String, success: Function, failure?: Function) {

        super.setupRestService();

        return super.createAuthenticatedRequest(
            () => tsDashboardService.getDashboardConfiguration(id),
            (response) => success(Dashboard.createObjectFromMdmRecord(response)),
            failure
        );
    }

    static getDashboards () {
        let params = {
            pageSize: -1,
            sortBy: 'mdmName.raw',
            accessType: 'EVERYONE',
            mobileAccessibleOnly: true
        };

        ExploreService.setupRestService();

        return new Promise((resolve, reject) => {
            return ExploreService.createAuthenticatedRequest(
                () => tsDashboardService.getAllDashboardConfigurationsForUser(params),
                (response) => resolve(ResponseHelper.hits(response).map((mdmDashboard) => Dashboard.createObjectFromMdmRecord(mdmDashboard)).filter((mdmDashboard) => mdmDashboard.insightIds.length), ResponseHelper.totalHits(response)),
                (failure) => reject(failure)
            );
        });
    }
}

export default DashboardService;
