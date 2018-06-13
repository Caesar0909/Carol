// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import LinearGradient from 'react-native-linear-gradient';
import Container from '../Container/';
import T from '../T/';
import styles from './styles';
import c from '../../helpers/color';

const DetailsIntro = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        
        <LinearGradient
            {...props}
            colors={[c('green light-background'), c('green dark-background')]}
            start={{x: 0.0, y: 0}} end={{x: 1.0, y: 0.0}}
            style={[{ flex: 2, justifyContent: 'center'}, b('details-intro')]}
        >
            <Container>
                <T style={b('details-intro__primary')} numberOfLines={3}>{props.primary}</T>
                {props.secondary && <T style={b('details-intro__secondary')}>{props.secondary}</T>}
                <View style={b('details-intro__inner')}>
                    {props.tertiary && <T style={b('details-intro__tertiary')}>{props.tertiary}</T>}
                    {props.quaternary && <T style={b('details-intro__quaternary')}>{props.quaternary}</T>}
                </View>
            </Container>
        </LinearGradient>
    );
};

DetailsIntro.propTypes = {
    primary: PropTypes.string.isRequired,
    secondary: PropTypes.string,
    tertiary: PropTypes.string,
    quaternary: PropTypes.string
};

export default DetailsIntro;
