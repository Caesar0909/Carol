import { createSelector } from 'reselect';

const rootSelector = state => state.get('dataModel');

export const dataModelsSelector = createSelector(
    rootSelector,
    dataModel => dataModel.get('dataModels')
);

export const dataModelsErrorSelector = createSelector(
    rootSelector,
    dataModel => dataModel.get('dataModelsError')
);

export const dataModelsRequestingSelector = createSelector(
    rootSelector,
    dataModel => dataModel.get('dataModelsRequesting')
);

export const goldenDataModelsSelector = createSelector(
    rootSelector,
    dataModel => dataModel.get('goldenDataModels')
);

export const goldenDataModelsRequestingSelector = createSelector(
    rootSelector,
    dataModel => dataModel.get('goldenDataModelsRequesting')
);

export const goldenDataModelsErrorSelector = createSelector(
    rootSelector,
    dataModel => dataModel.get('goldenDataModelsError')
);

export const recordsSelector = createSelector(
    rootSelector,
    dataModel => dataModel.get('records')
);

export const recordsTotalSelector = createSelector(
    rootSelector,
    dataModel => dataModel.get('recordsTotal')
);

export const recordsRequestingSelector = createSelector(
    rootSelector,
    dataModel => dataModel.get('recordsRequesting')
);

export const recordsErrorSelector = createSelector(
    rootSelector,
    dataModel => dataModel.get('recordsError')
);
