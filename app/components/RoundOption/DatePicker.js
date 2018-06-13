// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    ViewPropTypes
} from 'react-native';
import ReactDatePicker from 'react-native-datepicker';
import moment from 'moment';

import c from '../../helpers/color';
import { ratio } from '../../helpers/windowSize';

import { IconButton, RoundView } from '../index';

import styles from './styles';

export class DatePicker extends Component {
    static propTypes = {
        date: PropTypes.string,
        style: ViewPropTypes.style,
        onDateChange: PropTypes.func.isRequired
    }

    static defaultProps = {
        style: {}
    }

    _initDatePicker = (ref) => {
        this._datePicker = ref;
    }

    _handlePress = () => {
        this._datePicker.onPressDate();
    }

    render () {
        const {
            date,
            style,
            onDateChange
        } = this.props;
        const isActive = !!date;
        let dateLabel = 'Select';

        if (isActive) {
            const dateStr = moment(date).format('MMM D, YYYY');

            dateLabel = dateStr.substr(0, 1).toUpperCase() + dateStr.substring(1);
        }

        return (
            <RoundView
                style={[style, { paddingHorizontal: 10 * ratio }]}
                Mstate={isActive ? 'active' : 'dotted'}
                Mcenter={false}
                onPress={this._handlePress}
            >
                <IconButton
                    color={c('transparent')}
                    fill={isActive ? 'white' : c('black light')}
                    name="Calendar"
                    size={20 * ratio}
                />
                <Text style={[
                    styles.label,
                    styles[isActive ? 'whiteText' : 'grayText'],
                    { marginLeft: 9 * ratio }
                ]}>
                    { dateLabel }
                </Text>
                <ReactDatePicker
                    ref={this._initDatePicker}
                    date={date}
                    mode="date"
                    showIcon={false}
                    hideText
                    confirmBtnText="OK"
                    cancelBtnText="Cancel"
                    onDateChange={onDateChange}
                />
            </RoundView>
        );
    }
}
