// @flow
import { windowSize, ratio } from '../../helpers/windowSize';
export const buttonBorderRadius = 4;

const bubbleDefaults = {
    'talkBubble': {
        backgroundColor: 'transparent'
    },
    'talkBubbleSquare': {
        backgroundColor: '#ffffff',
        paddingHorizontal: 16 * ratio,
        paddingVertical: 13 * ratio,
        borderRadius: 6,
        borderWidth: 0.3,
        borderColor: '#D5DBFE',
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
        shadowColor: '#000000',
        shadowOpacity: 0.15,
        marginBottom: 10
    },
    'talkBubbleTriangle': {
        position: 'absolute',
        left: -6,
        bottom: 3,
        width: 16,
        height: 16,
        borderTopColor: 'transparent',
        borderTopWidth: 8,
        borderRightWidth: 8,
        borderRightColor: '#ffffff',
        borderBottomWidth: 8,
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent'
    },
    'talkBubbleTriangle--right': {
        position: 'absolute',
        right: -6,
        bottom: 3,
        width: 16,
        height: 16,
        borderTopColor: 'transparent',
        borderTopWidth: 8,
        borderLeftWidth: 8,
        borderLeftColor: '#ffffff',
        borderBottomWidth: 8,
        borderBottomColor: 'transparent',
        borderRightColor: 'transparent'
    }
};

export default Object.assign({}, bubbleDefaults);
