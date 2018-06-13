// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';

const SideBySide = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('side-by-side')}>
            {props.children}
        </View>
    );
};

SideBySide.propTypes = {
    children: PropTypes.node.isRequired
};

export default SideBySide;
