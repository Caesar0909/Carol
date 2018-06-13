// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import bem from 'react-native-bem';
import T from '../T';
import styles from './styles';

const Pill = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => { props.onPress(); }}
        >
            <View style={b('pill')}>
                <T style={b('pill__label')} numberOfLines={1}>{props.label}</T>
            </View>
        </TouchableOpacity>
    );
};

Pill.propTypes = {
    SisSelected: PropTypes.bool,
    label: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired
};

export default Pill;
