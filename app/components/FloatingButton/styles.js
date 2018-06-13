// @flow
import s from '../../helpers/spacing';
import { windowSize } from '../../helpers/windowSize';
import { buttonBorderRadius } from '../Button/styles';

export default {
    'floating-button': {
        alignItems: 'center',
        bottom: s('x-large'),
        left: 0,
        position: 'absolute',
        width: windowSize.width,
        zIndex: 1
    },
    'floating-button__shadow': {
        borderRadius: buttonBorderRadius,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            height: 1,
            width: 0
        },
        shadowOpacity: 0.3,
        shadowRadius: 1.5
    }
};
