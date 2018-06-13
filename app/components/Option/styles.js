// @flow
import c from '../../helpers/color';
import { ratio } from '../../helpers/windowSize';

export default {
    'wrapper': {
        flexDirection: 'row',
        alignItems: 'center'
    },
    'outer': {
        justifyContent: 'center',
        alignItems: 'center',
        width: 22 * ratio,
        height: 22 * ratio,
        borderWidth: 1,
        borderRadius: 11 * ratio,
        borderColor: '#979797'
    },
    'inner': {
        width: 18 * ratio,
        height: 18 * ratio,
        borderRadius: 9 * ratio,
        borderWidth: 0
    },
    'inner--selected': {
        backgroundColor: c('purple main')
    },
    'content': {
        marginLeft: 23 * ratio,
        justifyContent: 'center',
        alignItems: 'center'
    }
};
