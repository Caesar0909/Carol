// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';

const ShadowView = ({
    children,
    ...props
}) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('shadow')}>
            { children }
        </View>
    );
};

ShadowView.propTypes = {
    children: PropTypes.node.isRequired,
    Mcolor: PropTypes.string,
    MhasShadow: PropTypes.bool
};

ShadowView.defaultProps = {
    MhasShadow: true
};

export default ShadowView;
