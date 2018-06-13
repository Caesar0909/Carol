// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, ViewPropTypes } from 'react-native';
import bem from 'react-native-bem';

import { T } from '../index';

import styles from './styles';

export const Option = ({
    style,
    label,
    value,
    children,
    onPress,
    ...restProps
}) => {
    const b = (selector) => bem(selector, restProps, styles);
    const Wrapper = onPress ? TouchableOpacity : View;

    return (
        <Wrapper
            style={[style, styles.wrapper]}
            onPress={() => onPress(value)}
        >
            <View style={styles.outer}>
                <View style={b('inner')} />
            </View>
            <View style={styles.content}>
                { label ? <T>{label}</T> : children }
            </View>
        </Wrapper>
    );
};

Option.defaultProps = {
    label: '',
    Mselected: false,
    style: {},
    onPress: null
};

Option.propTypes = {
    label: PropTypes.string,
    value: PropTypes.any.isRequired,
    Mcenter: PropTypes.bool,
    children: PropTypes.node,
    style: ViewPropTypes.style,
    onPress: PropTypes.func
};

export default Option;
