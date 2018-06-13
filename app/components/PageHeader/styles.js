import { ratio } from '../../helpers/windowSize';
import c from '../../helpers/color';

export default {
    'header': {
        flexDirection: 'row',
        alignItems: 'center',
        height: 78 * ratio,
        paddingTop: 18 * ratio,
        paddingHorizontal: 15 * ratio,
        borderBottomWidth: 1,
        borderBottomColor: c('divider lighter'),
        zIndex: 10
    },
    'header--small': {
        height: 60 * ratio
    }
};
