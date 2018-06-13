// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight, View } from 'react-native';
import bem from 'react-native-bem';
import ListItemDivider from '../ListItemDivider/';
import T from '../T/';
import styles from './styles';

const ListItemButton = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <TouchableHighlight {...props}>
            <View>
                <ListItemDivider style={b('list-item-button')} Mbottom={!props.hideBorder} Mtop={props.topBorder}>
                    <T style={b('list-item-button__label')}>{props.label}</T>
                </ListItemDivider>
            </View>
        </TouchableHighlight>
    );
};

ListItemButton.propTypes = {
    hideBorder: PropTypes.bool,
    topBorder: PropTypes.bool,
    label: PropTypes.string.isRequired,
    Malign: PropTypes.string,
    Mcolor: PropTypes.string,
    Msize: PropTypes.number
};

export default ListItemButton;
