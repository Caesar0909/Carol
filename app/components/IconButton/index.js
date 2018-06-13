// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight, View } from 'react-native';

import Circle from '../Circle/';
import Icon from '../Icon/';

const IconButton = (props: Object) => {
    let iconSize = props.circular ? Math.floor(props.size / 1.5) : props.size;

    const styledIcon = <Icon name={props.name} fill={props.fill} height={iconSize} width={iconSize} />;
    let touchTarget = {
        borderRadius: Math.ceil(props.size / 2),
        width: props.size
    };

    if (props.posAbsolute) {
        touchTarget = {
            borderRadius: Math.ceil(props.size / 2),
            width: props.size,
            'position': 'absolute',
            bottom: props.mbottom ? props.mbottom : 20,
            right: props.mright ? props.mright : 20
        };
    }

    if (props.circular) {
        return (
            <TouchableHighlight {...props} style={touchTarget}>
                <View>
                    <Circle color={props.color} size={props.size} Mhollow={props.hollow}>
                        {styledIcon}
                    </Circle>
                </View>
            </TouchableHighlight>
        );
    }

    return (
        <TouchableHighlight {...props} style={touchTarget}>
            <View>
                {styledIcon}
            </View>
        </TouchableHighlight>
    );
};

IconButton.propTypes = {
    circular: PropTypes.bool,
    posAbsolute: PropTypes.bool,
    color: PropTypes.string.isRequired,
    fill: PropTypes.string.isRequired,
    hollow: PropTypes.bool,
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
    mbottom: PropTypes.number,
    mright: PropTypes.number
};

export default IconButton;
