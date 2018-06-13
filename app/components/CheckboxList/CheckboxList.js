// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';

const CheckboxList = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('checkbox-list')}>
            {props.children}
        </View>
    );
};

CheckboxList.propTypes = {
    children: PropTypes.node
};

export default CheckboxList;
