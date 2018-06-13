// @flow
import { Platform } from 'react-native';

export const markerSize = 22;

export default {
    'map-marker': {
        alignItems: 'center',
        height: markerSize,
        justifyContent: 'flex-end',
        width: markerSize
    },
    'map-marker.has-pin': {
        height: markerSize * 2,
        marginTop: Platform.OS === 'ios' ? markerSize * -1 : 0
    },
    'map-marker__image': {
        height: markerSize,
        width: markerSize
    },
    'map-marker__pin': {
        top: 0,
        left: 0,
        position: 'absolute'
    }
};
