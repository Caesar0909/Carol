import { createApiAction } from './helper';

import DataModelService from '../../services/DataModelService';

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

export const fetchDataModels = createApiAction(
  [FETCH_DATA_MODELS_REQUEST, FETCH_DATA_MODELS_SUCCESS, FETCH_DATA_MODELS_FAILURE],
  DataModelService.getDataModels
);

export const globalSearch = createApiAction(
  [GLOBAL_SEARCH_REQUEST, GLOBAL_SEARCH_SUCCESS, GLOBAL_SEARCH_FAILURE],
    DataModelService.globalSearch
);

export const searchRecords = createApiAction(
    [SEARCH_RECORDS_REQUEST, SEARCH_RECORDS_SUCCESS, SEARCH_RECORDS_FAILURE],
    DataModelService.searchRecords
);

export const setGoldenDataModels = (goldenDataModels) => ({
    type: SET_GOLDEN_DATA_MODELS,
    payload: goldenDataModels
});
