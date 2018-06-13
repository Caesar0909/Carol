// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';

const Container = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('container')}>
            {props.children}
        </View>
    );
};

Container.propTypes = {
    children: PropTypes.node.isRequired,
    Msize: PropTypes.string,
    MalignCenter: PropTypes.bool
};

export default Container;
