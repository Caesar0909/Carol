// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import Divider from '../Divider';
import SectionHeader from '../SectionHeader';
import styles from './styles';

const Fieldset = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <Divider {...props}>
            <SectionHeader
                Mtransparent={true}
                heading={props.legend} />
            <View style={b('fieldset')}>
                {props.children}
            </View>
        </Divider>
    );
};

Fieldset.propTypes = {
    children: PropTypes.node.isRequired,
    legend: PropTypes.string.isRequired
};

export default Fieldset;
