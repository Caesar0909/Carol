// @flow
import c from '../../helpers/color';
import s from '../../helpers/spacing';

export default {
    'group-header': {
        paddingHorizontal: s('large'),
        paddingBottom: s('small'),
        paddingTop: s('default')
    },
    'group-header__heading': {
        color: c('green gable'),
        fontSize: 16
    },
    'group-header__heading--sub': {
        color: c('core text--darker'),
        fontSize: 14
    },
    'group-header__heading--align-center': {
        textAlign: 'center'
    },
    'group-header__heading--align-right': {
        textAlign: 'right'
    }
};
