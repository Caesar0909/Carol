import { combineReducers } from 'redux-immutable';

import * as reducers from '../reducers';

export default function createReducer () {
    return combineReducers({
        ...reducers
    });
}
