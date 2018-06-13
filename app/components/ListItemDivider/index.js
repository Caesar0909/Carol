// @flow
import React from 'react';
import PropTypes from 'prop-types';
import bem from 'react-native-bem';
import Container from '../Container/';
import Divider from '../Divider/';
import styles from './styles';

const ListItemDivider = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <Divider {...props} style={b('list-item-divider')}>
            <Container>
                {props.children}
            </Container>
        </Divider>
    );
};

ListItemDivider.propTypes = {
    children: PropTypes.node.isRequired,
    Mflex: PropTypes.bool
};

export default ListItemDivider;
