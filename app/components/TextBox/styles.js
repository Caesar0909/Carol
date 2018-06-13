// @flow
import { Platform } from 'react-native';
import c from '../../helpers/color';
import s from '../../helpers/spacing';

const vars = {
    height: 32,
    heightNavigation: 34
};

const setClearIconTop = (height) => (height / 2) - (22 / 2);

export default {
    'text-box': {
        backgroundColor: '#fff',
        color: c('core text--darkest'),
        fontSize: 16,
        height: vars.height,
        // paddingLeft: s('default'),
        paddingLeft: 0,
        paddingRight: Platform.OS === 'android' ? s('default') : 0,
        paddingVertical: 0,
        borderWidth: 0
    },
    'text-box--align-center': {
        textAlign: 'center'
    },
    'text-box--bordered': {
        borderColor: c('gray tiara'),
        borderBottomWidth: 1
    },
    'text-box--dark': {
        backgroundColor: c('gray aztec'),
        borderRadius: 4,
        color: c('gray slate')
    },
    'text-box--navigation': {
        height: vars.heightNavigation
    },
    'text-box--red': {
        backgroundColor: 'transparent',
        borderColor: c('blue sky'),
        borderWidth: 1,
        color: '#fff'
    },
    'text-box--searchred': {
        backgroundColor: 'transparent',
        borderColor: c('blue sky'),
        borderWidth: 1,
        color: c('core default')
    },
    'text-box--searchbox': {
        backgroundColor: 'transparent',
        color: '#fff'
    },
    'text-box--transparent': {
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 0,
        color: '#fff'
    }, /*
    'text-box.is-focused': {
        borderColor: c('core primary'),
        borderWidth: 1
    },*/
    'text-box-clear-icon': {
        position: 'absolute',
        right: s('default'),
        top: setClearIconTop(vars.height)
    },
    'text-box-clear-icon--navigation': {
        top: setClearIconTop(vars.heightNavigation)
    }
};
