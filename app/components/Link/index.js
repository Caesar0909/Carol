// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import bem from 'react-native-bem';
import T from '../../components/T';
import styles from './styles';

const Link = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);
    let sanitizedProps = Object.assign({}, props);

    delete sanitizedProps.style;

    return (
        <TouchableOpacity {...sanitizedProps}>
            <T Mmorelink={props.Mmorelink} style={b('link')} numberOfLines={props.numberOfLines}>{props.text}</T>
        </TouchableOpacity>
    );
};

Link.defaultProps = {
    activeOpacity: 0.5
};

Link.propTypes = {
    activeOpacity: PropTypes.number,
    numberOfLines: PropTypes.number,
    text: PropTypes.string.isRequired,
    Mmorelink: PropTypes.bool
};

export default Link;
