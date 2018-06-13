// @flow
import React from 'react';
import PropTypes from 'prop-types';
import Container from '../Container/';
import bem from 'react-native-bem';
import T from '../T/';
import styles from './styles';

const Update = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <Container Msize="default">
            <T style={b('empty-state')}>{props.text}</T>
        </Container>
    );
};

Update.propTypes = {
    text: PropTypes.string.isRequired
};

export default Update;
