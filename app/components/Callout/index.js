// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';

const Callout = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('callout')}>
            <View style={b('callout__arrow')} />
            <View style={b('callout__bubble')}>
                {props.children}
            </View>
        </View>
    );
};

Callout.propTypes = {
    children: PropTypes.node.isRequired
};

export default Callout;
