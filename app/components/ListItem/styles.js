// @flow
import c from '../../helpers/color';
import s from '../../helpers/spacing';

export default {
    'list-item__primary': {
        color: c('core text--darkest'),
        fontSize: 20
    },
    'list-item-supp': {
        flex: 1,
        flexDirection: 'row',
        paddingTop: s('small')
    },
    'list-item-supp__prefix1': {
        color: c('core highlight'),
        fontSize: 12,
        paddingRight: s('small')
    },
    'list-item-supp__prefix2': {
        color: c('core primary'),
        fontSize: 12,
        paddingRight: s('small')
    },
    'list-item-supp__inner': {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    'list-item-supp__secondary': {
        fontSize: 12
    },
    'list-item-supp__suffix': {
        fontSize: 12,
        paddingLeft: s('small')
    }
};
