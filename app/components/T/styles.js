// @flow
import c from '../../helpers/color';
import { ratio } from '../../helpers/windowSize';
export default {
    'text': {
        backgroundColor: 'transparent',
        color: c('newgray text'),
        fontSize: 14 * ratio,
        fontFamily: 'SF UI Text'
    },
    'text--bold': {
        fontWeight: 'bold'
    },
    'text--italic': {
        fontStyle: 'italic'
    },
    'text--color-purple': {
        color: c('purple main')
    }
};
