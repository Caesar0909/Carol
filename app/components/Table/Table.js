// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';

const Table = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('table')}>
            {props.children}
        </View>
    );
};

Table.propTypes = {
    children: PropTypes.node.isRequired
};

export default Table;
