// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';

const PillList = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('pill-list')}>
            {props.children}
        </View>
    );
};

PillList.propTypes = {
    children: PropTypes.node
};

export default PillList;
