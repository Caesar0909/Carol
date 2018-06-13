// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { SideBySide__Item } from '../SideBySide/';
import Container from '../Container/';

const Table__Cell = (props: Object) => {
    return (
        <SideBySide__Item {...props}>
            <Container {...props}>
                {props.children}
            </Container>
        </SideBySide__Item>
    );
};

Table__Cell.propTypes = {
    children: PropTypes.node
};

export default Table__Cell;
