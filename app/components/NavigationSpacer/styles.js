// @flow
import { Platform } from 'react-native';

export default {
    'navigation-spacer': {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 8,
        marginRight: Platform.OS === 'ios' ? 8 : 16
    }
};
