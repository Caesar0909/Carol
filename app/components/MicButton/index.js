// @flow
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import bem from 'react-native-bem';
import styles from './styles';
import c from '../../helpers/color';

const MicButton = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <LinearGradient
                colors={[c('green light-background'), c('green dark-background')]}
                start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 1.0}}
                style={b('micbutton')}
            >
            test
        </LinearGradient>
    );
};


export default MicButton;

