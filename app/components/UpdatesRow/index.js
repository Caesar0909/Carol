// @flow
import React from 'react';
import PropTypes from 'prop-types';
import bem from 'react-native-bem';
import ListItemDivider from '../ListItemDivider/';
import { SideBySide, SideBySide__Item } from '../SideBySide/';
import T from '../T/';
import styles from './styles';

const UpdatesRow = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <ListItemDivider>
            <SideBySide>
                <SideBySide__Item Mfluid={true}>
                    <T style={b('update__type')}>{props.title}</T>
                    <T style={b('update__title')} numberOfLines={1}>{props.description}</T>
                </SideBySide__Item>

                <SideBySide__Item MvAlignCenter={true}>
                    <T style={b('update__date')}>{props.date}</T>
                </SideBySide__Item>
            </SideBySide>
        </ListItemDivider>
    );
};

UpdatesRow.propTypes = {
    Mhighlighted: PropTypes.bool,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired
};

export default UpdatesRow;
