// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';

import { RoundView } from '../index';

import styles from './styles';

export const RoundOption = ({
    label,
    value,
    number,
    isActive,
    dotted,
    style,
    onPress
}) => {
    let state = '';

    if (isActive) {
        state = 'active';
    }
    else if (dotted) {
        state = 'dotted';
    }

    return (
        <RoundView
            style={style}
            Mstate={state}
            onPress={() => onPress(value, isActive)}
        >
            <Text style={[styles.label, styles[isActive ? 'whiteText' : 'grayText']]}>
                { label }
            </Text>
            { number !== undefined && number !== null &&
                <View style={[styles.numberWrapper, styles[isActive ? 'whiteBg' : 'purpleBg']]}>
                    <Text style={[styles.number, styles[isActive ? 'grayText' : 'whiteText']]}>
                        { number > 999 ? '999+' : number }
                    </Text>
                </View>
            }
        </RoundView>
    );
};

RoundOption.defaultProps = {
    value: null,
    isActive: false,
    dotted: false,
    onPress: null
};

RoundOption.propTypes = {
    label: PropTypes.string,
    value: PropTypes.any,
    number: PropTypes.number,
    isActive: PropTypes.bool,
    dotted: PropTypes.bool,
    style: PropTypes.shape(),
    onPress: PropTypes.func
};
