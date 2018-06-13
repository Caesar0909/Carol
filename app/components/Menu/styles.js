// @flow
import { Platform } from 'react-native';
import c from '../../helpers/color';
import { ratio } from '../../helpers/windowSize';
import {
    Dimensions
} from 'react-native';
const window = Dimensions.get('window');

export default {
    'menu': {
        width: window.width - 50,
        height: Platform.OS === 'android' ? window.height - 36 : window.height,
        backgroundColor: '#FFFFFFF3',
        zIndex: 100
    },
    'name': {
        position: 'absolute',
        left: 70,
        top: 20
    },
    'item': {
        fontSize: 14,
        fontWeight: '300',
        paddingTop: 5
    },
    'footerItem': {
        height: 65 * ratio,
        alignItems: 'center',
        paddingLeft: 20,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#EAEDF9'
    }
};
