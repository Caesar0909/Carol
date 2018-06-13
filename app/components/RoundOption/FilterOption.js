// @flow
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Text, View } from 'react-native';

import c from '../../helpers/color';
import { ratio } from '../../helpers/windowSize';

import { IconButton, RoundView } from '../index';

import styles from './styles';

export const FilterOption = ({
    value,
    number,
    isActive,
    style,
    onPress
}) => (
    <RoundView
        style={style}
        Mstate={isActive ? 'active' : ''}
        onPress={() => onPress(value, isActive)}
    >
        <IconButton
            color={c('transparent')}
            fill={isActive ? 'white' : c('black light')}
            name="Filters"
            size={20 * ratio}
        />
        <Text style={[
            styles.label,
            styles[isActive ? 'whiteText' : 'grayText'],
            { marginLeft: 9 * ratio }
        ]}>
            Filters
        </Text>
        {
            number !== undefined && number !== null &&
            <View style={[styles.numberWrapper, styles[isActive ? 'whiteBg' : 'purpleBg']]}>
                <Text style={[styles.number, styles[isActive ? 'grayText' : 'whiteText']]}>
                    { number > 999 ? '999+' : number }
                </Text>
            </View>
        }
    </RoundView>
);

FilterOption.defaultProps = {
    isActive: false,
    onPress: () => {}
};

FilterOption.propTypes = {
    value: ImmutablePropTypes.map.isRequired,
    number: PropTypes.string,
    isActive: PropTypes.bool,
    style: PropTypes.shape(),
    onPress: PropTypes.func
};
