// @flow
import c from '../../helpers/color';
import { ratio } from '../../helpers/windowSize';

export default {
    label: {
        fontSize: 12 * ratio,
        lineHeight: 14 * ratio
    },
    numberWrapper: {
        marginLeft: 11 * ratio,
        justifyContent: 'center',
        alignItems: 'center',
        width: 30 * ratio,
        height: 20 * ratio,
        borderRadius: 10 * ratio
    },
    number: {
        fontSize: 10 * ratio
    },
    whiteBg: {
        backgroundColor: 'white'
    },
    purpleBg: {
        backgroundColor: c('purple main')
    },
    whiteText: {
        color: 'white'
    },
    grayText: {
        color: c('newgray text')
    }
};
