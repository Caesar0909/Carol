import c from '../../helpers/color';
import { vRatio } from '../../helpers/windowSize';

export default {
    container: {
        position: 'relative',
        flex: 1,
        backgroundColor: 'white'
    },
    button: {
        position: 'absolute',
        bottom: 40 * vRatio,
        fontSize: 16 * vRatio,
        color: c('black light')
    },
    leftButton: {
        left: 40 * vRatio
    },
    rightButton: {
        right: 40 * vRatio
    },
    page: {
        flex: 1,
        alignItems: 'center'
    },
    thumbnail: {
        marginTop: 122 * vRatio,
        width: 173 * vRatio,
        height: 173 * vRatio
    },
    title: {
        marginTop: 37 * vRatio,
        color: '#606060',
        fontSize: 24 * vRatio,
        lineHeight: 31 * vRatio
    },
    description: {
        color: c('black light'),
        fontSize: 16 * vRatio,
        lineHeight: 25 * vRatio,
        textAlign: 'center'
    },
    bold: {
        fontWeight: 'bold'
    },
    paginationRow: {
        bottom: 40 * vRatio
    },
    activeDot: {
        width: 12 * vRatio,
        height: 12 * vRatio,
        borderRadius: 6 * vRatio,
        borderWidth: 1 * vRatio,
        borderColor: '#335C5F',
        backgroundColor: '#E068D5',
        marginLeft: 5 * vRatio,
        marginRight: 5 * vRatio
    },
    dot: {
        width: 12 * vRatio,
        height: 12 * vRatio,
        borderRadius: 6 * vRatio,
        backgroundColor: c('black light'),
        marginLeft: 5 * vRatio,
        marginRight: 5 * vRatio
    },
    button2: {
        position: 'absolute',
        left: 20 * vRatio,
        bottom: 28 * vRatio
    },
    fullImage: {
        resizeMode: 'cover',
        width: '100%',
        height: '100%'
    }
};
