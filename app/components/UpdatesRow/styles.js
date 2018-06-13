// @flow
import c from '../../helpers/color';
import s from '../../helpers/spacing';

export default {
    'update__type': {
        marginBottom: s('x-small')
    },
    'update__title': {
        color: c('core text--darkest')
    },
    'update__date': {
        fontSize: 12,
        minWidth: 80,
        paddingLeft: s('small'),
        textAlign: 'right'
    },
    'update__date--highlighted': {
        color: c('core primary')
    }
};
