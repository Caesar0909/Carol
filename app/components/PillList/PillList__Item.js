// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';

const PillList__Item = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('pill-list__item')}>
            {props.children}
        </View>
    );
};

PillList__Item.propTypes = {
    children: PropTypes.node
};

export default PillList__Item;
