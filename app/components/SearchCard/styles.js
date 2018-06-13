// @flow
import c from '../../helpers/color';
import { ratio } from '../../helpers/windowSize';

export default {
    tagWrapper: {
        position: 'absolute',
        top: 20 * ratio,
        right: 15 * ratio,
        paddingHorizontal: 10 * ratio,
        paddingVertical: 3 * ratio,
        borderRadius: 2 * ratio,
        backgroundColor: c('purple border')
    },
    tagLabel: {
        color: '#fff',
        fontSize: 14 * ratio,
        lineHeight: 17 * ratio
    },
    title1: {
        marginTop: 56 * ratio,
        marginLeft: 11 * ratio,
        fontSize: 18 * ratio,
        lineHeight: 22 * ratio,
        color: c('newgray text')
    },
    title2: {
        marginTop: 5 * ratio,
        marginLeft: 11 * ratio,
        marginBottom: 24 * ratio,
        fontSize: 12 * ratio,
        color: c('purple border')
    },
    divider: {
        height: 1,
        backgroundColor: c('shadow black')
    },
    bottomContainer: {
        height: 100 * ratio,
        paddingHorizontal: 11 * ratio,
        justifyContent: 'center'
    },
    description1: {
        marginBottom: 10 * ratio,
        fontSize: 12 * ratio,
        color: c('newgray text')
    },
    description2: {
        marginBottom: 4 * ratio,
        fontSize: 12 * ratio,
        color: c('black light')
    },
    description3: {
        fontSize: 12 * ratio,
        color: c('purple border')
    }
};
