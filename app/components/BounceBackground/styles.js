// @flow
import c from '../../helpers/color';
import { windowSize } from '../../helpers/windowSize';

export default {
    'bounce-background': {
        backgroundColor: c('gray outer-space--darker'),
        height: windowSize.height / 2,
        left: 0,
        position: 'absolute',
        top: 0,
        width: windowSize.width
    }
};
