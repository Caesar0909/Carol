// @flow
import { Platform } from 'react-native';
import c from '../../helpers/color';
import s from '../../helpers/spacing';

const borderWidth = 1;

export const inputSize = 15;

export default {
    'checkbox': {
        borderColor: c('gray tiara'),
        flexDirection: 'row'
    },
    'checkbox__input': {
        backgroundColor: '#fff',
        borderColor: c('gray tiara'),
        paddingTop: 3,
        paddingLeft: 3,
        borderRadius: (inputSize + 5 + (borderWidth * 2)) / 2,
        borderWidth,
        height: inputSize + 5 + (borderWidth * 2),
        marginRight: s('default'),
        width: inputSize + 5 + (borderWidth * 2)
    },
    'checkbox.is-selected checkbox__input': {
        borderColor: c('green selected'),
        backgroundColor: c('green selected')
    },
    'checkbox__label': {
        color: c('gray outer-space--darker'),
        marginRight: inputSize + 5 + (borderWidth * 2),
        marginTop: Platform.OS === 'ios' ? 3 : 1
    }
};
