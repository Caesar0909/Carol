import c from '../../helpers/color';
import { ratio } from '../../helpers/windowSize';

export default {
    pageWrapper: {
        flex: 1,
        backgroundColor: 'white'
    },
    headerRight: {
        marginLeft: 5 * ratio,
        marginBottom: 30 * ratio,
        flex: 1
    },
    contentWrapper: {
        flex: 1
    },
    sectionTitle: {
        marginLeft: 19 * ratio,
        marginTop: 28 * ratio
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
    scrollContent: {
        paddingHorizontal: 8 * ratio,
        paddingVertical: 13 * ratio
    },
    recentSearchLabel: {
        marginTop: 11 * ratio,
        marginBottom: 11 * ratio
    },
    recentSearchBox: {
        paddingLeft: 8 * ratio
    },
    recentSearchCard: {
        marginBottom: 11 * ratio
    }
};
