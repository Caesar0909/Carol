// @flow
import c from '../../helpers/color';
import s from '../../helpers/spacing';

export default {
    'tabs': {
        backgroundColor: '#fff',
        elevation: 0,
        shadowOpacity: 0
    },
    'tabs--home': {
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0
    },
    'tab-label': {
        color: c('core text'),
        padding: s('default')
    },
    'tab-indicator': {
        backgroundColor: 'transparent',
        bottom: 15,
        borderTopColor: c('core primary'),
        borderTopWidth: 0,
        height: 0,
        left: 0,
        position: 'absolute',
        right: 0
    },
    'tab-indicator__inner': {
        alignItems: 'center',
        marginTop: -4
    }
};
