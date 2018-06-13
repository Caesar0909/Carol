// @flow
import c from '../../helpers/color';
import { ratio } from '../../helpers/windowSize';

export default {
    'wrapper': {
        paddingHorizontal: 7 * ratio,
        height: 31 * ratio,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 6 * ratio,
        borderWidth: 1 * ratio,
        borderColor: c('black light'),
        backgroundColor: c('transparent')
    },
    'wrapper--center': {
        justifyContent: 'center'
    },
    'wrapper--state-active': {
        borderColor: c('purple main'),
        backgroundColor: c('purple main')
    },
    'wrapper--state-dotted': {
        borderColor: c('black light'),
        borderStyle: 'dotted',
        backgroundColor: 'transparent'
    },
    'wrapper--state-border-purple': {
        borderColor: c('purple main')
    }
};
