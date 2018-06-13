import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import {
    FETCH_RELATIONSHIPS_REQUEST,
    FETCH_RELATIONSHIPS_SUCCESS,
    FETCH_RELATIONSHIPS_FAILURE,
    FETCH_GOLDEN_RECORD_REQUEST,
    FETCH_GOLDEN_RECORD_SUCCESS,
    FETCH_GOLDEN_RECORD_FAILURE,
    FETCH_VERTICALS_SUCCESS
} from '../constants';

const initialState = fromJS({
    basic: {},
    relationships: [],
    segments: [],
    requesting: false,
    error: null
});

const fetchRelationshipsRequestHandler = (state, action) =>
    state
    .set('requesting', true)
    .set('error', null);

const fetchRelationshipsFailureHandler = (state, action) =>
    state
    .set('requesting', false)
    .set('error', action.payload);

const fetchRelationshipsSuccessHandler = (state, action) =>
    state
    .set('relationships', fromJS(action.payload))
    .set('requesting', false)
    .set('error', null);

const fetchGoldenRecordSuccessHandler = (state, action) =>
    state
    .set('basic', fromJS(action.payload.mdmGoldenFieldAndValues));

const fetchVerticalsSuccessHandlder = (state, action) =>
    state
    .set('segments', fromJS(action.payload.hits));

export const record = handleActions({
    [FETCH_RELATIONSHIPS_REQUEST]: fetchRelationshipsRequestHandler,
    [FETCH_RELATIONSHIPS_FAILURE]: fetchRelationshipsFailureHandler,
    [FETCH_RELATIONSHIPS_SUCCESS]: fetchRelationshipsSuccessHandler,
    [FETCH_GOLDEN_RECORD_SUCCESS]: fetchGoldenRecordSuccessHandler,
    [FETCH_VERTICALS_SUCCESS]: fetchVerticalsSuccessHandlder
}, initialState);
