// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import T from '../T/';
import styles from './styles';

const Modal__Title = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('modal__title')}>
            <T style={b('modal__title-text')}>{props.title}</T>
        </View>
    );
};

Modal__Title.propTypes = {
    title: PropTypes.string.isRequired
};

export default Modal__Title;
