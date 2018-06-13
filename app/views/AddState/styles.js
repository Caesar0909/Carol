import c from '../../helpers/color';
import { ratio } from '../../helpers/windowSize';

export default {
    pageWrapper: {
        flex: 1,
        backgroundColor: 'white'
    },
    title: {
        flex: 1,
        marginLeft: 5 * ratio,
        marginRight: 20 * ratio,
        fontSize: 16 * ratio,
        fontWeight: 'bold',
        lineHeight: 19 * ratio,
        color: c('newgray text')
    },
    contentWrapper: {
        flex: 1
    },
    scrollContent: {
        paddingHorizontal: 20 * ratio,
        paddingTop: 28 * ratio,
        paddingBottom: 16 * ratio
    },
    optionMargin: {
        marginBottom: 12 * ratio
    }
};
