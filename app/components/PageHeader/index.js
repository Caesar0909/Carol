// @flow
import React from 'react';
import PropTypes from 'prop-types';
import bem from 'react-native-bem';

import {
    ShadowView
} from '../../components';

import styles from './styles';

export const PageHeader = ({
    children,
    ...restProps
}) => {
    const b = (selector) => bem(selector, restProps, styles);

    return (
        <ShadowView Mcolor="black" MhasShadow={restProps.MhasShadow} style={b('header')}>
            { children }
        </ShadowView>
    );
};

PageHeader.propTypes = {
    MhasShadow: PropTypes.bool,
    Msmall: PropTypes.bool,
    children: PropTypes.node.isRequired
};

PageHeader.defaultProps = {
    MhasShadow: true,
    Msmall: false
};

export default PageHeader;
