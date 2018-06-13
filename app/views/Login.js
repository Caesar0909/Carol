// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, Platform, View, Image, TouchableOpacity, TouchableWithoutFeedback, StatusBar, AsyncStorage } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import { TextField } from 'react-native-material-textfield';
import ImmutablePropTypes from 'react-immutable-proptypes';

import SessionHelper from '../helpers/SessionHelper';

import { loginType } from '../models/User';
import Spinner from '../components/Spinner/';
import TextBox from '../components/TextBox/';
import Button from '../components/Button/';
import Link from '../components/Link/';
import T from '../components/T/';
import Images from '../assets/icons/images/';
import BackButton from '../components/BackButton/';
import IconButton from '../components/IconButton/';
import Icon from '../components/Icon/';


import u from '../helpers/utils/utils';
import c from '../helpers/color';
import immediatelyResetStack from '../helpers/immediatelyResetStack';

import { windowSize, ratio, vRatio } from '../helpers/windowSize';

import { connect } from 'react-redux';

import {
    selectMenu
} from '../reduxes/actions';

import {hideBottomBar, showBottomBar} from '../reduxes/actions';

const mapDispatchToProps = dispatch => ({
    selectMenu: (id) => dispatch(selectMenu(id)),
    hideBottomBar: () => dispatch(hideBottomBar()),
    showBottomBar: () => dispatch(showBottomBar())
});

class Login extends Component {

    static propTypes = {
        hideBottomBar: PropTypes.func,
        showBottomBar: PropTypes.func,
        currentMenuId: PropTypes.string.isRequired,
        menuData: ImmutablePropTypes.list.isRequired
    };

    state: {
        emailValue: string,
        passwordValue: string,
        formAnimation: ?any,
        showSpinner: boolean,
        passwordHasFocus: boolean,
        errorMessage: string | null,
        step: number,
        keyboardShow: boolean,
        showPassword: boolean,
        emailfocused: boolean,
        passwordfocused: boolean
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
            step: 1,
            keyboardShow: false,
            showPassword: false,
            emailfocused: false,
            passwordfocused: false
        };

        this.emailRef = this.updateRef.bind(this, 'emailText');
        this.passwordRef = this.updateRef.bind(this, 'passwordText');
    }

    static route = {
        navigationBar: null
    };

    updateRef = (name, ref) => {
        this[name] = ref;
    }

    _showSpinner = () => {
        this.setState({ showSpinner: true });
    };

    _goToInstructions = () => {
        AsyncStorage.getItem('seenInstructions')
        .then(seen => {
            if (seen === 'yes') {
                this._goToMain();
            }
            else {
                Platform.OS === 'android' ?
                    immediatelyResetStack(this.props, 'instructions') : this.props.navigation.navigate('instructions');
            }
        }).catch(error => {
            console.log(error);
        });
    }

    _goToMain = () => {
        this.props.selectMenu('1');
        Platform.OS === 'android' ? immediatelyResetStack(this.props, 'welcome', { showInviteCallout: true }) : this.props.navigation.navigate('welcome', { showInviteCallout: true });
    };

    _goToTeam = () => {
        if (this.state.step === 1) {
            Platform.OS === 'android' ? immediatelyResetStack(this.props, 'team', {showInviteCallout: true}) : this.props.navigation.navigate('team', {showInviteCallout: true});
        }
        else {
            this.setState({step: 1});
        }
    };

    _goToLoginFluigIdentity = () => {
        this.props.navigation.navigate('loginFluigIdentity');
    };

    _validateEmail = (email) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return re.test(email);
    };

    _login = () => {
        if (this.state.step === 1) {
            if (!this._validateEmail(this.state.emailValue)) {
                this.setState({errorMessage: I18n.t(['login', 'invalidEmail'])});
            }
            else {
                this.setState({errorMessage: '', passwordHasFocus: true, step: 2});
            }

            return;
        }
            
        let createSessionResponse = (response) => {
            if (response === true) {
                this._goToInstructions();
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
            SessionHelper.createSession(this.state.emailValue, this.state.passwordValue, loginType.explore).then(createSessionResponse);
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
    };

    componentWillMount () {
        this.props.hideBottomBar();
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

    _handleBlur = () => {
        if (this.emailText && this.emailText !== undefined) {
            this.emailText.blur();
        }

        if (this.passwordText && this.passwordText !== undefined) {
            this.passwordText.blur();
        }
    }

    render () {
        return (
            <TouchableWithoutFeedback onPress={this._handleBlur}>
                <LinearGradient
                    colors={[c('purple bg--color'), c('purple bg--color')]}
                    start={{x: 0.0, y: 0.0}} end={{x: 0.0, y: 0.0}}
                    style={{ flex: 1, justifyContent: 'center' }}
                >
                    <StatusBar barStyle="light-content" />
                    <BackButton onPress={this._goToTeam} />
                    <View style={{
                        paddingHorizontal: 40 * ratio,
                        paddingVertical: 15 * vRatio,
                        flex: 1,
                        justifyContent: 'flex-start',
                        marginTop: this.state.keyboardShow ? -30 * vRatio : 0
                    }}>
                        <Image source={Images.BACKGROUND} style={{flex: 1, resizeMode: 'cover', position: 'absolute', width: windowSize.width, height: windowSize.height + 2}}/>
                            
                        <View style= {{position: 'absolute', width: windowSize.width, height: windowSize.height, justifyContent: 'center', alignItems: 'center'}}>
                            <Animatable.View
                                duration={300}
                                style={{
                                    opacity: this.state.showSpinner ? 1 : 0
                                }}
                                transition="opacity"
                            >
                                <Spinner style={u('spacing-mt-xx-large')} />
                            </Animatable.View>
                        </View>

                        <Animatable.View
                            style={{marginTop: 190 * ratio}}
                            animation={this.state.formAnimation}
                            duration={150}
                            pointerEvents={this.state.showSpinner ? 'none' : null}
                        >
                            {
                                this.state.step === 1 && <View style={{ height: 64 * vRatio }}>
                                    <TextField
                                        ref={this.emailRef}
                                        label={I18n.t(['login', 'emailPlaceholder'])}
                                        value={this.state.emailValue}
                                        autoCorrect={false}
                                        autoFocus
                                        keyboardType="email-address"
                                        baseColor={'#ffffff'}
                                        tintColor={'#ffffff'}
                                        textColor={'#ffffff'}
                                        autoCapitalize="none"
                                        labelFontSize={10 * vRatio}
                                        fontSize = {16 * vRatio}
                                        labelPadding={4 * vRatio}
                                        inputContainerStyle={{borderBottomWidth: 1 * vRatio, paddingBottom: 8 * vRatio, borderBottomColor: this.state.emailfocused ? c('purple border') : 'white'}}
                                        onChangeText={(emailValue) => this.setState({ emailValue })}
                                        onFocus = {() => { this.setState({emailfocused: true}); }}
                                        onBlur = {() => { this.setState({emailfocused: false}); }}
                                        error={this.state.errorMessage}
                                        errorColor={'#FC6180'}
                                        onClear={() => this.setState({ emailValue: '' })}
                                        returnKeyType="next"
                                        onSubmitEditing={this._login}
                                    />
                                </View>
                            }
                            {
                                this.state.step === 2 && <View style={{ height: 64 * vRatio }}>
                                    <TextField
                                        ref={this.passwordRef}
                                        label={I18n.t(['login', 'passwordPlaceholder'])}
                                        autoFocus
                                        setFocus={this.state.passwordHasFocus}
                                        value={this.state.passwordValue}
                                        keyboardType="default"
                                        secureTextEntry={!this.state.showPassword}
                                        baseColor={'#ffffff'}
                                        tintColor={'#ffffff'}
                                        textColor={'#ffffff'}
                                        autoCapitalize="none"
                                        labelFontSize={10 * vRatio}
                                        fontSize = {16 * vRatio}
                                        labelPadding={4 * vRatio}
                                        inputContainerStyle={{borderBottomWidth: 1 * vRatio, paddingBottom: 8 * vRatio, borderBottomColor: this.state.passwordfocused ? c('purple border') : 'white'}}
                                        onChangeText={(passwordValue) => this.setState({ passwordValue })}
                                        onClear={() => this.setState({ passwordValue: '' })}
                                        onFocus = {() => { this.setState({passwordfocused: true}); }}
                                        onBlur = {() => { this.setState({passwordfocused: false}); }}
                                        error={this.state.errorMessage}
                                        errorColor={'#FC6180'}
                                        returnKeyType="done"
                                        onSubmitEditing={this._login}
                                        style={{fontFamily: 'SF UI Text'}}
                                    />
                                    <View style={{position: 'absolute', right: 0, bottom: 10 * vRatio}}>{this.state.showPassword === false && <IconButton name="Eye" size={20 * ratio} color={'white'} fill={'white'} onPress={() => { this.setState({showPassword: !this.state.showPassword, passwordValue: this.state.passwordValue + ' ' }); setTimeout(() => { this.setState({ passwordValue: this.state.passwordValue.substring(0, this.state.passwordValue.length - 1)}); }, 100); }}/>}{this.state.showPassword === true && <IconButton name="EyeSlash" size={20} color={'white'} fill={'white'} onPress={() => { this.setState({showPassword: !this.state.showPassword}); }}/>}</View>
                                </View>
                            }
                            <T style={{
                                color: 'white',
                                fontSize: 12 * vRatio,
                                textAlign: 'center',
                                textDecorationLine: 'underline',
                                marginTop: 15 * vRatio,
                                marginBottom: 40 * vRatio,
                                alignSelf: 'flex-end',
                                opacity: this.state.step === 2 ? 1 : 0
                            }} onPress={this._goToTeam}>
                                {I18n.t(['team', 'reminder'])}
                            </T>
                            <Button Mwidth={132 * vRatio} Mheight={40 * vRatio} Mcolor={(this.state.step === 1 && this.state.emailValue.length > 0) || (this.state.step === 2 && this.state.passwordValue.length > 0) ? 'primary' : 'transparent'} MSolid={true} label={I18n.t(['login', 'loginButton'])} onPress={this._login} />
                            
                            <View style={[{alignItems: 'center', marginTop: 45 * vRatio}]}>
                                <Link
                                    text={I18n.t(['login', 'fluigIdentityButton'])} onPress={this._goToLoginFluigIdentity}
                                    style={{ textAlign: 'center', color: 'white', textDecorationLine: 'underline', fontSize: 12 * vRatio} }
                                />
                                <TouchableOpacity onPress={this._goToLoginFluigIdentity} style={{marginTop: 16 * vRatio}}>
                                    <Icon name="LogoFluigIdentityWhite" height={47 * vRatio} width={68 * vRatio} stroke={'#2C0D3A'} />
                                </TouchableOpacity>
                            </View>
                            
                        </Animatable.View>
                    </View>
                </LinearGradient>
            </TouchableWithoutFeedback>
        );
    }
}

Login.propTypes = {
    navigation: PropTypes.any
};

export default connect(null, mapDispatchToProps)(Login);
