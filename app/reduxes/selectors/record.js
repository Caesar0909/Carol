import { createSelector } from 'reselect';

const recordSelector = state => state.get('record');

export const recordRequestingSelector = createSelector(
    recordSelector,
    recordModel => recordModel.get('requesting')
);

export const basicRecordSelector = createSelector(
    recordSelector,
    recordModel => recordModel.get('basic')
);

export const segmentsSelector = createSelector(
    recordSelector,
    recordModel => recordModel.get('segments')
);

export const relationshipsSelector = createSelector(
    recordSelector,
    recordModel => recordModel.get('relationships')
);

export const contactsSelector = createSelector(
    recordSelector,
    recordModel => recordModel.get('contacts')
);
