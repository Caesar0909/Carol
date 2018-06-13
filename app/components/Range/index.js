import React, { Component } from 'react';
import {
  Platform,
  View,
  ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import c from '../../helpers/color';
import { ratio } from '../../helpers/windowSize';
import { abbreviate } from '../../helpers/utils/number';

import {
  RoundOption,
  T
} from '../index';
import styles from './styles';

export class Range extends Component {
    buildFigureLabel = (value) => {
        return value ? `${this.props.prefix}${abbreviate(value)}` : '';
    };

    handleValuesChange = (values) => {
        const {
            minValue,
            maxValue,
            onValuesChange
        } = this.props;
        let leftVal = values[0];
        let rightVal = values[1];

        if (leftVal === minValue) {
            leftVal = null;
        }

        if (rightVal === maxValue) {
            rightVal = null;
        }

        onValuesChange([leftVal, rightVal]);
    }

    render () {
        const {
            label,
            minValue,
            maxValue,
            step,
            sliderLength,
            style
        } = this.props;
        let { values } = this.props;

        const rangeLabel = `${this.buildFigureLabel(values[0])} ~ ${this.buildFigureLabel(values[1])}`;

        values = [values[0] || minValue, values[1] || maxValue];

        return (
            <View style={style}>
                <View style={styles.labelRow}>
                    <T>
                        { label }
                    </T>
                    <RoundOption
                        label={rangeLabel}
                        style={{ width: 112 * ratio }}
                    />
                </View>
                <View style={styles.sliderRow}>
                    <MultiSlider
                        values={values}
                        min={minValue}
                        max={maxValue}
                        step={step}
                        sliderLength={sliderLength}
                        markerStyle={{
                            ...Platform.select({
                                ios: {
                                    borderColor: c('purple main')
                                },
                                android: {
                                }
                            })
                        }}
                        trackStyle={{
                            marginTop: -4 * ratio,
                            height: 8 * ratio,
                            backgroundColor: c('newgray shadow')
                        }}
                        selectedStyle={{
                            marginTop: -4 * ratio,
                            height: 8 * ratio,
                            backgroundColor: c('purple main')
                        }}
                        onValuesChange={this.handleValuesChange}
                    />
                </View>
            </View>
        );
    }
}

Range.defaultProps = {
    label: '',
    minValue: 0,
    maxValue: 100,
    step: 1,
    prefix: '',
    style: {}
};

Range.propTypes = {
    label: PropTypes.string,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    step: PropTypes.number,
    sliderLength: PropTypes.number.isRequired,
    values: PropTypes.array.isRequired,
    prefix: PropTypes.string,
    style: ViewPropTypes.style,
    onValuesChange: PropTypes.func.isRequired
};

export default Range;
