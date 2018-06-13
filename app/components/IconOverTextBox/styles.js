// @flow
import s from '../../helpers/spacing';

export default {
    'icon-over-text-box': {
        position: 'relative'
    },
    'icon-over-text-box__icon': {
        flex: 1,
        height: 44,
        justifyContent: 'center',
        left: 0,
        marginLeft: s('default'),
        position: 'absolute',
        top: 0,
        width: 20,
        zIndex: 1
    },
    'icon-over-text-box--navigation icon-over-text-box__icon': {
        height: 34
    },
    'icon-over-text-box__text-box': {
        paddingLeft: 20 + (s('default') * 2)
    }
};
