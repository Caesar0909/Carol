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
    row: {
        paddingHorizontal: 20 * ratio,
        paddingVertical: 20 * ratio
    },
    marginBottom: {
        marginBottom: 24 * ratio
    },
    horizontal: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    dateColLeft: {
        flex: 1
    },
    dateColMiddle: {
        width: 40 * ratio
    },
    dateColRight: {
        flex: 1
    }
};
