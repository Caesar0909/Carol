// @flow
import c from '../../helpers/color';
import s from '../../helpers/spacing';
import { windowSize } from '../../helpers/windowSize';

export default {
    'modal-backdrop': {
        alignItems: 'center',
        backgroundColor: c('gray black-smoke'),
        flex: 1,
        justifyContent: 'center',
        padding: s('default')
    },
    'modal': {
        backgroundColor: '#fff',
        borderRadius: 8,
        maxHeight: windowSize.height * 0.9 < 650 ? windowSize.height * 0.9 : 650,
        maxWidth: windowSize.width * 0.9 < 500 ? windowSize.width * 0.9 : 500,
        minWidth: 320,
        shadowColor: '#000',
        shadowOffset: {
            height: 6,
            width: 0
        },
        shadowOpacity: 0.1,
        shadowRadius: 13
    },
    'modal__title': {
        borderBottomColor: c('gray alto--lighter'),
        borderBottomWidth: 1,
        padding: s('x-large')
    },
    'modal__title-text': {
        color: c('core text--dark'),
        textAlign: 'center'
    },
    'modal__footer': {
        borderTopColor: c('gray alto--lighter'),
        borderTopWidth: 1,
        padding: s('x-large')
    }
};
