// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';

const SideBySide__Item = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('side-by-side__item')}>
            {props.children}
        </View>
    );
};

SideBySide__Item.propTypes = {
    Mfluid: PropTypes.bool,
    MvAlign: PropTypes.string,
    children: PropTypes.node.isRequired
};

export default SideBySide__Item;
