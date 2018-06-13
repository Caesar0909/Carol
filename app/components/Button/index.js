// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableHighlight, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import bem from 'react-native-bem';
import Icon from '../Icon';
import styles from './styles';
import c from '../../helpers/color';
import { ratio } from '../../helpers/windowSize';

const Button = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);
    const ButtonElem = props.SisDisabled ? View : TouchableHighlight;

    if (props.MSolid && props.MWhite) {
        return (
            <ButtonElem {...props} underlayColor="transparent">
            <LinearGradient
                start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 1.0}}
                colors={['#fff', '#fff']}
                style={[b('button'), {borderRadius: 22, width: 100}]}>

                    <Text style={[b('button__label'), {color: c('green dark-background'), fontSize: 17}]}>{props.label}</Text>
                </LinearGradient>
            </ButtonElem>
        );
    }
    if (props.MSolid && props.Mcolor) {
        return (
            <ButtonElem {...props} underlayColor={c('purple active')} style={[b('button'), {borderRadius: 6, width: props.Mwidth, height: props.Mheight, borderWidth: 1, borderColor: styles[`button--color-${props.Mcolor} gradient`].borderColor, alignSelf: 'center'}]}>
            <LinearGradient
                start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 1.0}}
                colors={[styles[`button--color-${props.Mcolor} gradient`].startColor, styles[`button--color-${props.Mcolor} gradient`].endColor]}
                style={[b('button'), {width: props.Mwidth, height: props.Mheight, borderRadius: 6}]}>

                    <Text style={[b('button__label'), {color: '#fff', fontSize: 14 * ratio}]}>{props.label}</Text>
                </LinearGradient>
            </ButtonElem>
        );
    }
    if (props.MSolid && !props.Mcolor) {
        return (
            <ButtonElem {...props} underlayColor={c('purple active')} style={[b('button'), {borderRadius: 6, width: props.Mwidth, height: props.Mheight, borderWidth: 1, borderColor: c('purple border'), alignSelf: 'center'}]}>
            <LinearGradient
                start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 1.0}}
                colors={[c('transparent'), c('transparent')]}
                style={[b('button'), {width: 100}]}>

                    <Text style={[b('button__label'), {color: '#fff', fontSize: 14 * ratio}]}>{props.label}</Text>
                </LinearGradient>
            </ButtonElem>
        );
    }
    
    return (
        <ButtonElem {...props} underlayColor="transparent">
        <LinearGradient
            start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 1.0}}
            colors={[styles[`button--color-${props.Mcolor} gradient`].startColor, styles[`button--color-${props.Mcolor} gradient`].endColor]}
            style={b('button')}>

                {props.icon && (
                    <View style={b('button__icon')}>
                        <Icon
                            name={props.icon}
                            fill={styles[`button--color-${props.Mcolor} button__label`].color}
                            height="21"
                            width="21"
                        />
                    </View>
                )}
                <Text style={b('button__label')}>{props.label}</Text>
            </LinearGradient>
        </ButtonElem>
    );
};

Button.defaultProps = {
    Mcolor: 'primary'
};

Button.propTypes = {
    Mcolor: PropTypes.string,
    SisDisabled: PropTypes.bool,
    MSolid: PropTypes.bool,
    MWhite: PropTypes.bool,
    icon: PropTypes.string,
    label: PropTypes.string.isRequired,
    Mwidth: PropTypes.number.isRequired,
    Mheight: PropTypes.number.isRequired
};

export default Button;
