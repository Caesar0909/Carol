// @flow
import React from 'react';
import { View } from 'react-native';
import bem from 'react-native-bem';
import Button from '../../components/Button/';
import styles from './styles';

const FloatingButton = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('floating-button')}>
            <View style={b('floating-button__shadow')}>
                <Button {...props} />
            </View>
        </View>
    );
};

export default FloatingButton;
