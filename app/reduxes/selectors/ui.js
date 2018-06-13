import { createSelector } from 'reselect';

const rootSelector = state => state.get('ui');
const bottomSettingSelector = createSelector(
    rootSelector,
    ui => ui.get('showBottom')
);

const currentMenuIdSelector = createSelector(
    rootSelector,
    ui => ui.get('currentMenuId')
);

const menuDataSelector = createSelector(
    rootSelector,
    ui => ui.get('menuData')
);

export {
    rootSelector as uiSelector,
    bottomSettingSelector,
    currentMenuIdSelector,
    menuDataSelector
};
