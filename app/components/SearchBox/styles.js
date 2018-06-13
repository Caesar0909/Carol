// @flow
import { Platform } from 'react-native';

export default {
    'search-box--navigation': {
        flex: 1,
        justifyContent: 'center',
        marginLeft: Platform.OS === 'ios' ? 40 : 0,
        marginRight: 16
    }
};
