// @flow
import c from '../../helpers/color';

export default {
    'pill': {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderColor: c('gray tiara'),
        borderRadius: 50,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6
    },
    'pill.is-selected': {
        backgroundColor: c('green selected'),
        borderColor: c('green selected')
    },
    'pill__label': {
        color: c('gray outer-space--darker')
    },
    'pill.is-selected pill__label': {
        color: '#fff'
    }
};
