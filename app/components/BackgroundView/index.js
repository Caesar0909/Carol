// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';

const BackgroundView = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    if (props.Mwhite) {
        return (
            <View {...props} style={b('background-view--white')}>
                {props.children}
            </View>
        );
    }
    
    return (
        <View {...props} style={b('background-view')}>
            {props.children}
        </View>
    );
};

BackgroundView.propTypes = {
    children: PropTypes.node,
    Mwhite: PropTypes.bool
};

export default BackgroundView;
