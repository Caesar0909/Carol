// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, ViewPropTypes } from 'react-native';
import bem from 'react-native-bem';

import styles from './styles';

export const RoundView = (props) => {
    const b = (selector) => bem(selector, props, styles);
    const Wrapper = props.onPress ? TouchableOpacity : View;

    return (
        <Wrapper
            style={[props.style, b('wrapper')]}
            onPress={props.onPress}
        >
            { props.children }
        </Wrapper>
    );
};

RoundView.defaultProps = {
    Mstate: '',
    Mcenter: true,
    style: {},
    onPress: null
};

RoundView.propTypes = {
    Mstate: PropTypes.string,
    Mcenter: PropTypes.bool,
    children: PropTypes.node.isRequired,
    style: ViewPropTypes.style,
    onPress: PropTypes.func
};

export default RoundView;
