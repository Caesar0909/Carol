// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import StatusBarSpacer from '../StatusBarSpacer/';
import styles from './styles';

const ModalBackdrop = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('modal-backdrop')}>
            <StatusBarSpacer />
            {props.children}
        </View>
    );
};

ModalBackdrop.propTypes = {
    children: PropTypes.node
};

export default ModalBackdrop;
