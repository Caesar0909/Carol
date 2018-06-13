import { createApiAction } from './helper';

import DashboardService from '../../services/DashboardService';

import {
  FETCH_DASHBOARDS_REQUEST,
  FETCH_DASHBOARDS_SUCCESS,
  FETCH_DASHBOARDS_FAILURE
} from '../constants';

export const fetchDashboards = createApiAction(
  [FETCH_DASHBOARDS_REQUEST, FETCH_DASHBOARDS_SUCCESS, FETCH_DASHBOARDS_FAILURE],
  DashboardService.getDashboards
);
