// @flow
import React from 'react';
import { View } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';

const Line = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return <View style={b('line')} />;
};

export default Line;
