import { createApiAction } from './helper';

import DataModelService from '../../services/DataModelService';

import {
  FETCH_RELATIONSHIPS_REQUEST,
  FETCH_RELATIONSHIPS_SUCCESS,
  FETCH_RELATIONSHIPS_FAILURE,
  FETCH_GOLDEN_RECORD_REQUEST,
  FETCH_GOLDEN_RECORD_SUCCESS,
  FETCH_GOLDEN_RECORD_FAILURE,
  FETCH_VERTICALS_REQUEST,
  FETCH_VERTICALS_SUCCESS,
  FETCH_VERTICALS_FAILURE
} from '../constants';

export const fetchGoldenRecord = createApiAction(
  [FETCH_GOLDEN_RECORD_REQUEST, FETCH_GOLDEN_RECORD_SUCCESS, FETCH_GOLDEN_RECORD_FAILURE],
  DataModelService.getGoldenRecord
);

export const fetchVerticals = createApiAction(
  [FETCH_VERTICALS_REQUEST, FETCH_VERTICALS_SUCCESS, FETCH_VERTICALS_FAILURE],
  DataModelService.getAllVerticals
);

export const fetchRelationships = createApiAction(
  [FETCH_RELATIONSHIPS_REQUEST, FETCH_RELATIONSHIPS_SUCCESS, FETCH_RELATIONSHIPS_FAILURE],
  DataModelService.getRelationships
);
