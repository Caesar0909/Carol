// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem, { renderBemChild } from 'react-native-bem';
import Icon from '../Icon/';
import styles from './styles';

const IconOverTextBox = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('icon-over-text-box')}>
            {renderBemChild(props, b('icon-over-text-box__text-box'))}
            <View style={b('icon-over-text-box__icon')} pointerEvents="none">
                <Icon {...props} height="20" width="20" />
            </View>
        </View>
    );
};

IconOverTextBox.propTypes = {
    fill: PropTypes.string,
    name: PropTypes.string
};

export default IconOverTextBox;
