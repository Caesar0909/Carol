// @flow
import React from 'react';
import { Platform } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import c from '../../helpers/color';

const BounceBackground = (props: Object) => {
    if (Platform.OS === 'android') {
        return null;
    }

    const b = (selector) => bem(selector, props, styles);

    return <LinearGradient
            colors={[c('green light-background'), c('green dark-background')]}
            start={{x: 0.0, y: 0}} end={{x: 1.0, y: 0.0}}
            style={[{ flex: 2, justifyContent: 'center'}, b('bounce-background')]}
        />;
};

export default BounceBackground;
