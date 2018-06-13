import c from '../../helpers/color';
import { ratio } from '../../helpers/windowSize';

export default {
    pageWrapper: {
        flex: 1,
        backgroundColor: 'white'
    },
    headerRight: {
        marginLeft: 27 * ratio,
        flex: 1
    },
    contentWrapper: {
        flex: 1
    },
    filterOptions: {
        flexDirection: 'row',
        marginTop: 10 * ratio,
        paddingHorizontal: 20 * ratio
    },
    sectionTitle: {
        marginLeft: 19 * ratio,
        marginTop: 26 * ratio
    },
    text: {
        fontSize: 14 * ratio,
        lineHeight: 16 * ratio
    },
    purple: {
        color: c('purple main')
    },
    newgray: {
        color: c('newgray text')
    },
    searchList: {
        marginTop: 24 * ratio,
        paddingHorizontal: 8 * ratio
    },
    nameRow: {
        marginTop: 26 * ratio,
        marginHorizontal: 13 * ratio,
        marginBottom: 28 * ratio,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    name: {
        marginRight: 15 * ratio,
        fontSize: 18 * ratio,
        lineHeight: 22 * ratio,
        color: c('newgray text')
    },
    watchListTag: {
        marginTop: -2 * ratio,
        paddingVertical: 2 * ratio,
        paddingHorizontal: 10 * ratio,
        borderRadius: 3 * ratio,
        backgroundColor: c('purple main')
    },
    watchListText: {
        color: 'white',
        fontSize: 14 * ratio
    },
    type: {
        marginTop: 17 * ratio,
        marginLeft: 13 * ratio,
        fontSize: 12 * ratio,
        color: c('purple border')
    },
    divider: {
        height: 1,
        backgroundColor: c('shadow black')
    },
    location: {
        marginTop: 4 * ratio,
        marginLeft: 13 * ratio,
        marginBottom: 21 * ratio,
        fontSize: 12 * ratio,
        color: c('black light')
    }
};
