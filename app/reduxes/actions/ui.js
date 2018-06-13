import {createAction} from 'redux-actions';

import {
    BOTTOM_SHOW,
    BOTTOM_HIDE,
    SELECT_MENU,
    TOGGLE_MENU
} from '../constants';

export const hideBottomBar = createAction(
    BOTTOM_HIDE,
);

export const showBottomBar = createAction(
    BOTTOM_SHOW,
);

export const selectMenu = createAction(
    SELECT_MENU,
);

export const toggleMenu = createAction(
    TOGGLE_MENU
);
