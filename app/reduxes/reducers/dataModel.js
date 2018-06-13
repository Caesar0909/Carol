import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import {
    FETCH_DATA_MODELS_REQUEST,
    FETCH_DATA_MODELS_SUCCESS,
    FETCH_DATA_MODELS_FAILURE,
    GLOBAL_SEARCH_REQUEST,
    GLOBAL_SEARCH_SUCCESS,
    GLOBAL_SEARCH_FAILURE,
    SET_GOLDEN_DATA_MODELS,
    SEARCH_RECORDS_REQUEST,
    SEARCH_RECORDS_SUCCESS,
    SEARCH_RECORDS_FAILURE
} from '../constants';

import ResponseHelper from '../../helpers/ResponseHelper';
import Customer from '../../models/Customer';
import Company from '../../models/Company';
import Person from '../../models/Person';

const initialState = fromJS({
    dataModels: [],
    dataModelsRequesting: false,
    dataModelsError: null,
    goldenDataModels: [],
    goldenDataModelsRequesting: false,
    goldenDataModelsError: null,
    records: [],
    recordsTotal: 0,
    recordsRequesting: false,
    recordsError: null
});

const fetchDataModelsRequestHandler = (state) =>
    state
    .set('dataModelsRequesting', true)
    .set('dataModelsError', null);
const fetchDataModelsFailureHandler = (state, action) =>
    state
    .set('dataModelsRequesting', false)
    .set('dataModelsError', action.payload);

const fetchDataModelsSuccessHandler = (state, action) =>
    state
    .set('dataModels', fromJS(action.payload))
    .set('dataModelsRequesting', false)
    .set('dataModelsError', null);

const globalSearchRequestHandler = (state) =>
    state
    .set('goldenDataModelsRequesting', true)
    .set('goldenDataModelsError', null);

const globalSearchFailureHandler = (state, action) =>
    state
    .set('goldenDataModelsRequesting', false)
    .set('goldenDataModelsError', action.payload);

const globalSearchSuccessHandler = (state, action) => {
    const categoryMap = state.get('dataModels').toJS().reduce((map, dataModel) => {
        map[dataModel.name] = dataModel;
        map[dataModel.name + 'Golden'] = dataModel; //Some search results will append 'Golden'

        return map;
    }, {});

    const results = Object.values(ResponseHelper.aggregationBuckets(action.payload));
    const newResults = [];

    results.forEach((resultItem) => {
        const dataModel = categoryMap[resultItem.key];

        //NOTE: categoryMap only includes dataModels that are for mobile. search results may include from other dataModels
        if (dataModel) {
            console.log('FOUND: ' + resultItem.docCount + ' search hits inside "' + dataModel.label + '"');
            newResults.push({
                ...resultItem,
                label: dataModel.label,
                id: dataModel.id
            });
        }
    });

    return state
        .set('goldenDataModels', fromJS(newResults))
        .set('goldenDataModelsRequesting', false)
        .set('goldenDataModelsError', null);
};

const setGoldenDataModelsHandler = (state, action) =>
    state
    .set('goldenDataModels', fromJS(action.payload))
    .set('goldenDataModelsRequesting', false)
    .set('goldenDataModelsError', null);

const searchRecordsRequestHandler = (state) =>
    state
    .set('recordsRequesting', true)
    .set('recordsError', null);

const searchRecordsFailureHandler = (state, action) =>
    state
    .set('recordsRequesting', false)
    .set('recordsError', action.payload);

const searchRecordsSuccessHandler = (state, action) => {
    let records = [];

    const {
        hits,
        totalHits
     } = action.payload;

    if (hits.length > 0) {

        const type = hits[0].mdmEntityType;

        if (type === 'mdmcustomerGolden') {
            records = hits.map((rawData) => Customer.createObjectFromMdmRecord(rawData));
        }
        else if (type === 'mdmcompanyGolden') {
            records = hits.map((rawData) => Company.createObjectFromMdmRecord(rawData));
        }
        else if (type === 'mdmpersonGolden') {
            records = hits.map((rawData) => Person.createObjectFromMdmRecord(rawData));
        }
    }

    return state
        .set('records', fromJS(records))
        .set('recordsTotal', totalHits)
        .set('recordsRequesting', false)
        .set('recordsError', null);
};

export const dataModel = handleActions({
    [FETCH_DATA_MODELS_REQUEST]: fetchDataModelsRequestHandler,
    [FETCH_DATA_MODELS_SUCCESS]: fetchDataModelsSuccessHandler,
    [FETCH_DATA_MODELS_FAILURE]: fetchDataModelsFailureHandler,
    [GLOBAL_SEARCH_REQUEST]: globalSearchRequestHandler,
    [GLOBAL_SEARCH_SUCCESS]: globalSearchSuccessHandler,
    [GLOBAL_SEARCH_FAILURE]: globalSearchFailureHandler,
    [SET_GOLDEN_DATA_MODELS]: setGoldenDataModelsHandler,
    [SEARCH_RECORDS_REQUEST]: searchRecordsRequestHandler,
    [SEARCH_RECORDS_SUCCESS]: searchRecordsSuccessHandler,
    [SEARCH_RECORDS_FAILURE]: searchRecordsFailureHandler
}, initialState);
