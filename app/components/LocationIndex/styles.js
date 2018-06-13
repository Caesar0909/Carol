// @flow
import c from '../../helpers/color';

export const locationSize = 18;

export default {
    'location-index': {
        alignItems: 'center',
        backgroundColor: c('core primary'),
        borderColor: '#fff',
        borderRadius: locationSize / 2,
        borderWidth: 1,
        height: locationSize,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            height: 0,
            width: 0
        },
        shadowOpacity: 0.7,
        shadowRadius: 1,
        width: locationSize
    },
    'location-index__number': {
        color: '#fff',
        fontSize: 10
    }
};
