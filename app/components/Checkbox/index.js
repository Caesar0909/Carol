// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import bem from 'react-native-bem';
import T from '../T';
import Icon from '../Icon';
import styles, { inputSize } from './styles';

const Checkbox = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => { props.onPress(); }}
        >
            <View style={b('checkbox')}>
                <View style={b('checkbox__input')}>
                    <Icon name="Checkbox" fill="#fff" height={inputSize} width={inputSize} />
                </View>
                <T style={b('checkbox__label')}>{props.label}</T>
            </View>
        </TouchableOpacity>
    );
};

Checkbox.propTypes = {
    SisSelected: PropTypes.bool,
    label: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired
};

export default Checkbox;
