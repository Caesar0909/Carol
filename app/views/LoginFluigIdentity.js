// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, Platform, View, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import { TextField } from 'react-native-material-textfield';

import SessionHelper from '../helpers/SessionHelper';

import { loginType } from '../models/User';

import BackButton from '../components/BackButton/';
import Spinner from '../components/Spinner/';
import TextBox from '../components/TextBox/';
import Button from '../components/Button/';
import Icon from '../components/Icon/';
import T from '../components/T/';
import Images from '../assets/icons/images/';
import { windowSize, ratio } from '../helpers/windowSize';

import u from '../helpers/utils/utils';
import c from '../helpers/color';
import immediatelyResetStack from '../helpers/immediatelyResetStack';

class LoginFluigIdentity extends Component {
    state: {
        emailValue: string,
        passwordValue: string,
        formAnimation: ?any,
        showSpinner: boolean,
        passwordHasFocus: boolean,
        errorMessage: string | null,
        keyboardShow: boolean
    };

    constructor () {
        super();

        this.state = {
            emailValue: '',
            passwordValue: '',
            formAnimation: null,
            showSpinner: false,
            passwordHasFocus: false,
            errorMessage: null,
            keyboardShow: false
        };
    }

    static route = {
        navigationBar: null
    };

    _moveFocusToPassword = () => {
        this.setState({ passwordHasFocus: true });
    };

    _showSpinner = () => {
        this.setState({ showSpinner: true });
    };

    _goToMain = () => {
        Platform.OS === 'android' ? immediatelyResetStack(this.props, 'home', { showInviteCallout: true }) : this.props.navigation.navigate('home', { showInviteCallout: true });
    };

    _goToLogin = () => {
        this.props.navigation.goBack();
    };

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardDidHide);
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        this.setState({keyboardShow: true});
    }

    _keyboardDidHide = () => {
        this.setState({keyboardShow: false});
    }

    _login = () => {
        let createSessionResponse = (response) => {
            if (response === true) {
                this._goToMain();
            }
            else {
                this.setState({
                    formAnimation: 'zoomIn',
                    showSpinner: false,
                    errorMessage: response.errorMessage || response.message
                });
            }
        };

        if (this.state.emailValue && this.state.passwordValue) {
            this.setState({
                formAnimation: 'zoomOut',
                showSpinner: true
            });

            Keyboard.dismiss();
            SessionHelper.createSession(this.state.emailValue, this.state.passwordValue, loginType.fluigIdentity).then(createSessionResponse);
        }
        else if (!this.state.emailValue && !this.state.passwordValue) {
            this.setState({ errorMessage: I18n.t(['login', 'emailAndPasswordMissing'])});
        }
        else if (!this.state.emailValue) {
            this.setState({ errorMessage: I18n.t(['login', 'emailMissing'])});
        }
        else {
            this.setState({ errorMessage: I18n.t(['login', 'passwordMissing'])});
        }
    }

    render () {
        return (
            <LinearGradient
                colors={[c('purple bg--color'), c('purple bg--color')]}
                start={{x: 0.0, y: 0.0}} end={{x: 0.0, y: 0.0}}
                style={{
                    bottom: 0,
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    top: 0
                }}
            >
                <BackButton onPress={this._goToLogin} />
                <Image source={Images.IDENTITYBG} style={{ resizeMode: 'cover', position: 'absolute', width: windowSize.width, height: windowSize.height}}/>

                <View style={[u(['spacing-pv-x-large']), { paddingHorizontal: 42 * ratio, flex: 1, justifyContent: 'center', marginTop: this.state.keyboardShow ? -230 * ratio : -80 * ratio}]}>
                    <View style={[{ alignItems: 'center', marginBottom: 34 * ratio }]}>
                        <Icon name="LogoFluigIdentityWhite" height={windowSize.width * 0.173 * ratio} width={windowSize.width * ratio / 4} stroke={"#2C0D3A"} />
                        <View>
                            <Animatable.View
                                duration={300}
                                style={{
                                    left: -17,
                                    opacity: this.state.showSpinner ? 1 : 0,
                                    position: 'absolute'
                                }}
                                transition="opacity"
                            >
                                <Spinner style={u('spacing-mt-xx-large')} />
                            </Animatable.View>
                        </View>
                    </View>

                    <Animatable.View
                        animation={this.state.formAnimation}
                        duration={150}
                        pointerEvents={this.state.showSpinner ? 'none' : null}
                    >
                            {/* <TextBox
                                Mtransparent={true}
                                MalignCenter={false}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                placeholder="Email"
                                returnKeyType="next"
                                value={this.state.emailValue}
                                onChangeText={(emailValue) => this.setState({ emailValue })}
                                onClear={() => this.setState({ emailValue: '' })}
                                onSubmitEditing={this._moveFocusToPassword}
                            />
                            <TextBox
                                Mtransparent={true}
                                MalignCenter={false}
                                autoCapitalize="none"
                                placeholder={I18n.t(['login', 'passwordPlaceholder'])}
                                returnKeyType="go"
                                secureTextEntry={true}
                                setFocus={this.state.passwordHasFocus}
                                value={this.state.passwordValue}
                                onChangeText={(passwordValue) => this.setState({ passwordValue })}
                                onClear={() => this.setState({ passwordValue: '' })}
                                onSubmitEditing={this._login}
                            /> */}
                        
                        <TextField
                            label={I18n.t(['login', 'emailPlaceholder'])}
                            setFocus={this.state.emailHasFocus}
                            value={this.state.emailValue}
                            autoCorrect={false}
                            keyboardType="email-address"
                            baseColor={'#ffffff'}
                            tintColor={'#ffffff'}
                            textColor={'#ffffff'}
                            autoCapitalize="none"
                            labelFontSize={10 * ratio}
                            fontSize={16 * ratio}
                            labelPadding={0}
                            inputContainerStyle={{borderBottomWidth: 2 * ratio, paddingBottom: 10 * ratio}}
                            onChangeText={(emailValue) => this.setState({ emailValue })}
                            error={this.state.errorMessage}
                            errorColor={'#FC6180'}
                            onClear={() => this.setState({ emailValue: '' })}
                            returnKeyType="next"
                            onSubmitEditing={this._moveFocusToPassword}
                        />

                        <TextField
                            label={I18n.t(['login', 'passwordPlaceholder'])}
                            setFocus={this.state.passwordHasFocus}
                            value={this.state.passwordValue}
                            secureTextEntry={true}
                            keyboardType="email-address"
                            baseColor={'#ffffff'}
                            tintColor={'#ffffff'}
                            textColor={'#ffffff'}
                            autoCapitalize="none"
                            labelFontSize={10 * ratio}
                            fontSize={16 * ratio}
                            labelPadding={0}
                            inputContainerStyle={{borderBottomWidth: 2 * ratio, paddingBottom: 10 * ratio}}
                            onChangeText={(passwordValue) => this.setState({ passwordValue })}
                            error={this.state.errorMessage}
                            errorColor={'#FC6180'}
                            onClear={() => this.setState({ passwordValue: '' })}
                            returnKeyType="go"
                            onSubmitEditing={this._login}
                        />

                        {/* <Animatable.View
                            duration={this.state.errorMessage ? 100 : 0}
                            style={[
                                u(['spacing-n-mt-default', 'spacing-mb-x-large']),
                                {
                                    opacity: this.state.errorMessage ? 1 : 0,
                                    transform: [{ scale: this.state.errorMessage ? 1 : 0 }]
                                }
                            ]}
                            transition={['opacity', 'scale']}
                        >
                            <T style={{
                                color: c('core highlight'),
                                textAlign: 'center'
                            }}>
                                {this.state.errorMessage}
                            </T>
                        </Animatable.View> */}
                        <View style={{paddingTop: 45 * ratio}}>
                            <Button Mwidth={132 * ratio} Mheight={40 * ratio} Mcolor={(this.state.step === 1 && this.state.emailValue.length > 0) || (this.state.step === 2 && this.state.passwordValue.length > 0) ? 'primary' : 'transparent'} MSolid={true} label={I18n.t(['login', 'loginButton'])} onPress={this._login} />
                        </View>

                    </Animatable.View>
                </View>
            </LinearGradient>
        );
    }
}

LoginFluigIdentity.propTypes = {
    navigation: PropTypes.any
};

export default LoginFluigIdentity;
