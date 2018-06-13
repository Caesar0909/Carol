// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';

const T = (props: Object) => {
    if (!props.children) {
        return null;
    }

    const b = (selector) => bem(selector, props, styles);
    let bStyle = [b('text')];

    if (props.Mbubble) {
        bStyle.push({lineHeight: 25});
    }
    
    return (
        <Text {...props} style={bStyle}>
            {props.children}
        </Text>
    );
};

T.propTypes = {
    children: PropTypes.node,
    Mbubble: PropTypes.bool,
    Mbold: PropTypes.bool,
    Mitalic: PropTypes.bool,
    Mcolor: PropTypes.string
};

export default T;
