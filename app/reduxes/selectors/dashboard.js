import { createSelector } from 'reselect';

const rootSelector = state => state.get('dashboard');

export const dashboardSelector = createSelector(
    rootSelector,
    dataModel => dataModel.get('hits')
);
