import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import {
    FETCH_DASHBOARDS_REQUEST,
    FETCH_DASHBOARDS_SUCCESS,
    FETCH_DASHBOARDS_FAILURE
} from '../constants';

const initialState = fromJS({
    hits: [],
    requesting: false,
    error: null
});

const fetchDashboardsRequestHandler = (state) =>
    state
    .set('requesting', true)
    .set('error', null);

const fetchDashboardsFailureHandler = (state, action) =>
    state
    .set('requesting', false)
    .set('error', action.payload);

const fetchDashboardsSuccessHandler = (state, action) =>
    state
    .set('hits', fromJS(action.payload))
    .set('requesting', false)
    .set('error', null);

export const dashboard = handleActions({
    [FETCH_DASHBOARDS_REQUEST]: fetchDashboardsRequestHandler,
    [FETCH_DASHBOARDS_SUCCESS]: fetchDashboardsSuccessHandler,
    [FETCH_DASHBOARDS_FAILURE]: fetchDashboardsFailureHandler
}, initialState);
