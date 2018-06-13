// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem, { renderBemChild } from 'react-native-bem';
import styles from './styles';

const DummyTouchTarget = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);
    const children = props.children.slice(0, -1);

    return (
        <View style={b('dummy-touch-target')}>
            {children}
            {renderBemChild(props, b('dummy-touch-target__target'), props.children.length - 1)}
        </View>
    );
};

DummyTouchTarget.propTypes = {
    children: PropTypes.node
};

export default DummyTouchTarget;
