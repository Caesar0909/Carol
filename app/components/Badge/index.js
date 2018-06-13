// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback, View } from 'react-native';
import bem from 'react-native-bem';
import T from '../T/';
import styles from './styles';

const Badge = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);
    const WrapperElem = props.onPress ? TouchableWithoutFeedback : View;

    return (
        <View {...props} style={b('badge')}>
            {props.count && (
                <WrapperElem onPress={props.onPress} pointerEvents={!props.onPress && 'none'}>
                    <View style={b('badge__pill')}>
                        <T style={b('badge__count')}>{props.count}</T>
                    </View>
                </WrapperElem>
            )}
            {props.children}
        </View>
    );
};

Badge.propTypes = {
    children: PropTypes.node,
    count: PropTypes.number,
    onPress: PropTypes.func
};

export default Badge;
