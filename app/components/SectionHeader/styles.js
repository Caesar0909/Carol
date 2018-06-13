// @flow
import c from '../../helpers/color';
import s from '../../helpers/spacing';

export default {
    'section-header': {
        backgroundColor: c('gray white-smoke--lighter'),
        justifyContent: 'center',
        minHeight: 37,
        paddingHorizontal: s('large')
    },
    'section-header--transparent': {
        backgroundColor: c('transparent'),
        justifyContent: 'center',
        minHeight: 37,
        paddingHorizontal: s('large')
    },
    'section-header--white': {
        backgroundColor: '#fff'
    },
    'section-header__heading': {
        color: c('core text--darkest')
    }
};
