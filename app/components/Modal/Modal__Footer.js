// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';

const Modal__Footer = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('modal__footer')}>
            {props.children}
        </View>
    );
};

Modal__Footer.propTypes = {
    children: PropTypes.node
};

export default Modal__Footer;
