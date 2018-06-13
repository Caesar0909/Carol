// @flow
import c from '../../helpers/color';

export default {
    'badge': {
        position: 'relative'
    },
    'badge__pill': {
        backgroundColor: c('red venetian-red'),
        borderRadius: 10,
        paddingHorizontal: 3,
        paddingVertical: 1,
        position: 'absolute',
        right: -5,
        top: -1,
        zIndex: 1
    },
    'badge__count': {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold'
    }
};
