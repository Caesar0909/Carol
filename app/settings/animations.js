// @flow
import { windowSize } from '../helpers/windowSize';

export const paperPlaneFlyIn = {
    from: {
        opacity: 0,
        scale: 0.2,
        translateX: windowSize.width,
        translateY: windowSize.height / 2
    },
    to: {
        opacity: 1,
        scale: 1,
        translateX: 0,
        translateY: 0
    }
};
