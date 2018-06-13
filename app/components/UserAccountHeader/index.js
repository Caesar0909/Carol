// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import bem from 'react-native-bem';

import { SideBySide, SideBySide__Item } from '../SideBySide';
import T from '../T/';

import styles from './styles';

const UserAccountHeader = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <SideBySide style={b('user-account-header')}>
            <SideBySide__Item>
                <Image
                  style={b('user-account-header__avatar')}
                  source={{uri: `file://${props.imagePath}`}}
                />
            </SideBySide__Item>
            <SideBySide__Item MvAlign="center">
                <T style={b('user-account-header__name')}>{props.name}</T>
            </SideBySide__Item>
        </SideBySide>
    );
};

UserAccountHeader.propTypes = {
    name: PropTypes.string.isRequired,
    imagePath: PropTypes.string.isRequired
};

export default UserAccountHeader;
