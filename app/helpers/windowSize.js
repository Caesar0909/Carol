// @flow
import { Dimensions } from 'react-native';

export function getWindowSize () {
    return Dimensions.get('window');
}

export function getRatio () {
    let wSize = getWindowSize();
    
    return wSize.width / 320;
}

export function getVRatio () {
    let wSize = getWindowSize();
    return wSize.height / 568;
}

export const windowSize = getWindowSize();
export const ratio = getRatio();
export const vRatio = getVRatio();
