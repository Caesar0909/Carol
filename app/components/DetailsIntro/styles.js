// @flow
import c from '../../helpers/color';
import s from '../../helpers/spacing';

export default {
    'details-intro': {
        backgroundColor: c('red raddish'),
        justifyContent: 'flex-end',
        minHeight: 180
    },
    'details-intro__primary': {
        color: '#fff',
        fontSize: 24,
        marginBottom: s('default')
    },
    'details-intro__secondary': {
        marginBottom: s('default')
    },
    'details-intro__inner': {
        flexDirection: 'row'
    },
    'details-intro__tertiary': {
        color: c('core highlight'),
        fontSize: 12,
        marginRight: s('default')
    },
    'details-intro__quaternary': {
        color: c('core primary'),
        fontSize: 12
    }
};
