// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import T from '../T/';
import ListItemDivider from '../ListItemDivider/';
import styles from './styles';

const ListItem = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <ListItemDivider>
            <T style={b('list-item__primary')} numberOfLines={1}>{props.primary}</T>
            {props.secondary &&
                <View style={b('list-item-supp')}>
                    {props.prefix1 && <T style={b('list-item-supp__prefix1')}>{props.prefix1}</T>}
                    {props.prefix2 && <T style={b('list-item-supp__prefix2')}>{props.prefix2}</T>}

                    <View style={b('list-item-supp__inner')}>
                        <T style={b('list-item-supp__secondary')}>{props.secondary}</T>
                        {props.suffix && <T style={b('list-item-supp__suffix')}>{props.suffix}</T>}
                    </View>
                </View>
            }
        </ListItemDivider>
    );
};

ListItem.propTypes = {
    primary: PropTypes.string.isRequired,
    secondary: PropTypes.string,
    prefix1: PropTypes.string,
    prefix2: PropTypes.string,
    suffix: PropTypes.string
};

export default ListItem;
