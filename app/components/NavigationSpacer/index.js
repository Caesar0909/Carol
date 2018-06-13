// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';

const NavigationSpacer = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('navigation-spacer')}>
            {props.children}
        </View>
    );
};

NavigationSpacer.propTypes = {
    children: PropTypes.node.isRequired
};

export default NavigationSpacer;
