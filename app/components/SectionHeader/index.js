// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import T from '../T/';
import Divider from '../Divider/';
import styles from './styles';

const SectionHeader = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <Divider>
            <View {...this.props} style={b('section-header')} >
                {props.heading && <T style={b('section-header__heading')}>{props.heading}</T>}
                {props.children}
            </View>
        </Divider>
    );
};

SectionHeader.propTypes = {
    Mtransparent: PropTypes.bool,
    Mwhite: PropTypes.bool,
    children: PropTypes.node,
    heading: PropTypes.string
};

export default SectionHeader;
