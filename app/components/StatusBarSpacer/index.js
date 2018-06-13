// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Platform, View } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';

const StatusBarSpacer = (props: Object) => {
    if (Platform.OS === 'android') {
        return null;
    }

    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('status-bar-spacer')} />
    );
};

StatusBarSpacer.defaultProps = {
    Mlarge: PropTypes.bool
};

export default StatusBarSpacer;
