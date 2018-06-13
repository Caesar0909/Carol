// @flow
import c from '../../helpers/color';

export default {
    'list-item-button.is-selected': {
        backgroundColor: c('gray white-smoke')
    },
    'list-item-button.is-selected list-item-button__label': {
        color: c('red raddish')
    },
    'list-item-button__label': {
        color: c('core text--darkest'),
        fontSize: 16
    },
    'list-item-button__label--align-center': {
        textAlign: 'center'
    },
    'list-item-button__label--color-text-darker': {
        color: c('core text--darker')
    },
    'list-item-button__label--color-text-red': {
        color: c('red raddish')
    },
    'list-item-button__label--size-14': {
        fontSize: 14
    }
};
