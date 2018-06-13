// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import T from '../T/';
import Divider from '../Divider/';
import styles from './styles';

const GroupHeader = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);
    const heading = props.uppercase ? props.heading.toUpperCase() : props.heading;

    return (
        <Divider Mbottom={props.divider}>
            <View style={b('group-header')}>
                <T style={b('group-header__heading')}>{heading}</T>
            </View>
        </Divider>
    );
};

GroupHeader.defaultProps = {
    Msub: false,
    divider: true
};

GroupHeader.propTypes = {
    Msub: PropTypes.bool,
    divider: PropTypes.bool,
    heading: PropTypes.string.isRequired,
    uppercase: PropTypes.bool
};

export default GroupHeader;
