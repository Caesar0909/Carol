// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import T from '../T/';
import styles from './styles';

const LocationIndex = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View {...props} style={b('location-index')}>
            <T style={b('location-index__number')}>{props.number}</T>
        </View>
    );
};

LocationIndex.propTypes = {
    number: PropTypes.number.isRequired
};

export default LocationIndex;
