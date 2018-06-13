// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';

const Circle = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={[b('circle'), {
            backgroundColor: !props.Mhollow ? props.color : null,
            borderColor: props.Mhollow ? props.color : null,
            borderRadius: Math.ceil(props.size / 2),
            height: props.size,
            width: props.size
        }]}>
            {props.children}
        </View>
    );
};

Circle.propTypes = {
    Mhollow: PropTypes.bool,
    children: PropTypes.node.isRequired,
    color: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired
};

export default Circle;
