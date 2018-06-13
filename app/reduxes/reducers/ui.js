import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import {
    BOTTOM_SHOW,
    BOTTOM_HIDE,
    SELECT_MENU,
    TOGGLE_MENU,
    FETCH_DASHBOARDS_SUCCESS,
    FETCH_DASHBOARDS_FAILURE
} from '../constants';

const initialState = fromJS({
    showBottom: true,
    currentMenuId: '1',
    menuData: [],
    menuOpen: false
});

const selectMenuHandler = (state, { payload }) =>
    state
    .set('currentMenuId', payload);

const toggleMenuHandler = (state, { payload = true }) =>
    state
    .set('menuOpen', payload);

const updateMenuDataHandler = (state, { payload }) =>
    state
    .set('currentMenuId', payload.length > 0 ? payload[0].id : 'noDash')
    .set('menuData', fromJS(payload.map(item => ({
        key: item.id,
        text: item.label,
        typeText: ''
    }))));

const updateMenuDataHandlerFail = (state, { payload }) =>
    state
    .set('currentMenuId', 'noDash')
    .set('menuData', fromJS([]));

export const ui = handleActions({
    [BOTTOM_SHOW]: state => state.set('showBottom', true),
    [BOTTOM_HIDE]: state => state.set('showBottom', false),
    [SELECT_MENU]: selectMenuHandler,
    [TOGGLE_MENU]: toggleMenuHandler,
    [FETCH_DASHBOARDS_SUCCESS]: updateMenuDataHandler,
    [FETCH_DASHBOARDS_FAILURE]: updateMenuDataHandlerFail
}, initialState);
