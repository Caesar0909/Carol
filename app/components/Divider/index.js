// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';

const Divider = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('divider')}>
            {props.children}
        </View>
    );
};

Divider.defaultProps = {
    Mbottom: true
};

Divider.propTypes = {
    Mbottom: PropTypes.bool,
    Mleft: PropTypes.bool,
    Mright: PropTypes.bool,
    Mtop: PropTypes.bool,
    Mlighter: PropTypes.bool,
    children: PropTypes.node
};

export default Divider;
