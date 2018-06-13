// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableHighlight, View, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import bem from 'react-native-bem';
import Icon from '../Icon';
import styles from './styles';
import c from '../../helpers/color';

const CardView = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);
    return (
        <LinearGradient
            start={{x: 0.0, y: 0.0}} end={{x: 0.0, y: 1.0}}
            colors={[props.Mstartcolor, props.Mendcolor]}
            style={[b('cardView'), {
                width: props.Mwidth,
                height: props.Mheight,
                borderRadius: props.Mbradius,
                borderWidth: 0.3,
                borderColor: props.Mstartcolor === c('transparent') ? '#D5DBFE' : c('transparent'),
                shadowRadius: 3,
                elevation: 2,
                shadowOffset: { width: 0, height: 3 },
                shadowColor: Platform.OS == 'android' ? '#00000022' : '#000000',
                shadowOpacity: props.Mstartcolor === c('transparent') ? 0.15 : 0.0,
                marginRight: props.hasMarginRight ? 10 : 0,
                marginLeft: props.Mkey === 1 ? 19 : 0,
                marginBottom: 5
                }]}>
            {props.Mcontent}
        </LinearGradient>
    );
};

CardView.defaultProps = {
    Mstartcolor: c('transparent'),
    Mendcolor: c('transparent'),
    Mbradius: 6,
    MalignCenter: true,
    hasMarginRight: true
};

CardView.propTypes = {
    Mstartcolor: PropTypes.string,
    Mendcolor: PropTypes.string,
    Mwidth: PropTypes.number,
    Mheight: PropTypes.number,
    Mbradius: PropTypes.number,
    Mcontent: PropTypes.object,
    MalignCenter: PropTypes.bool,
    hasMarginRight: PropTypes.bool,
    Mkey: PropTypes.number
};

export default CardView;
