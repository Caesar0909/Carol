// @flow
import { Platform } from 'react-native';

export default {
    'back-button': {
        left: 0,
        position: 'absolute',
        top: Platform.OS === 'ios' ? 20 : 0,
        zIndex: 1
    },
    'back-button--flex': {
        position: 'relative',
        top: 0
    },
    'back-button__spacer': {
        ...Platform.select({
            ios: {
                paddingHorizontal: 19,
                paddingVertical: 18
            },
            android: {
                padding: 16
            }
        })
    },
    'back-button__image': {
        tintColor: '#fff',
        ...Platform.select({
            ios: {
                height: 21,
                width: 13
            },
            android: {
                height: 24,
                width: 24
            }
        })
    }
};
