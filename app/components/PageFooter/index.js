// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    ViewPropTypes
} from 'react-native';
import bem from 'react-native-bem';

import styles from './styles';

export const PageFooter = ({
    style,
    children,
    ...restProps
}) => {
    const b = (selector) => bem(selector, restProps, styles);

    return (
        <View style={[b('footer'), style]}>
            { children }
        </View>
    );
};

PageFooter.propTypes = {
    style: ViewPropTypes.style,
    children: PropTypes.node.isRequired
};

PageFooter.defaultProps = {
    style: {}
};

export default PageFooter;
