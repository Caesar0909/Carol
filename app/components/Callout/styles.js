// @flow
import c from '../../helpers/color';
import triangle from '../../helpers/triangle';

export default {
    'callout': {
        flexDirection: 'row'
    },
    'callout__bubble': {
        backgroundColor: c('gray river-bed'),
        borderRadius: 2,
        paddingHorizontal: 10,
        paddingVertical: 6,
        shadowColor: '#000',
        shadowOffset: {
            height: 0,
            width: 0
        },
        shadowOpacity: 0.5,
        shadowRadius: 1
    },
    'callout__arrow': {
        ...triangle(c('gray river-bed'), 4, 5, 'left'),
        top: 7,
        zIndex: 1
    }
};
