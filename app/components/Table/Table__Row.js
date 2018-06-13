// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Divider from '../Divider/';
import { SideBySide } from '../SideBySide/';

const Table__Row = (props: Object) => {
    const WrapperElem = props.noDivider ? View : Divider;

    return (
        <WrapperElem>
            <SideBySide>
                {props.children}
            </SideBySide>
        </WrapperElem>
    );
};

Table__Row.propTypes = {
    children: PropTypes.node.isRequired,
    noDivider: PropTypes.bool
};

export default Table__Row;
