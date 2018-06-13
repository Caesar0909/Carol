// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, View, Image, Keyboard, TouchableWithoutFeedback, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import I18n from 'react-native-i18n';
import { TextField } from 'react-native-material-textfield';

import Spinner from '../components/Spinner/';
import TextBox from '../components/TextBox/';
import Button from '../components/Button/';
import T from '../components/T/';
import Images from '../assets/icons/images/';

import Insights from '../models/Insights';

import u from '../helpers/utils/utils';
import c from '../helpers/color';
import immediatelyResetStack from '../helpers/immediatelyResetStack';

import TeamService from '../services/TeamService';
import { windowSize, ratio, vRatio } from '../helpers/windowSize';

import { connect } from 'react-redux';
import {hideBottomBar} from '../reduxes/actions';

const mapDispatchToProps = dispatch => ({
    hideBottomBar: () => dispatch(hideBottomBar())
});

class Team extends Component {

    static propTypes = {
        hideBottomBar: PropTypes.func
    };

    state: {
        teamValue: string,
        formAnimation: ?any,
        showSpinner: boolean,
        errorMessage: string | null,
        keyboardShow: boolean,
        focused: boolean
    };

    constructor () {
        super();

        this.state = {
            teamValue: '',
            formAnimation: null,
            showSpinner: false,
            errorMessage: null,
            keyboardShow: false,
            focused: false
        };

        this.emailRef = this.updateRef.bind(this, 'emailText');
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

    _goToLogin = () => {
        Insights.deleteAll();
        Platform.OS === 'android' ? immediatelyResetStack(this.props, 'login', { showInviteCallout: true }) : this.props.navigation.navigate('login', { showInviteCallout: true });
    };

    _validate = () => {
        this.setState({ errorMessage: '' });
        if (this.state.teamValue) {
            this._showSpinner();
            TeamService.checkServer(this.state.teamValue.trim(), () => {
                this.setState({ showSpinner: false });
                this._goToLogin();
            }, () => {
                this.setState({ showSpinner: false });
                this.setState({ errorMessage: I18n.t(['team', 'teamNotExist']) });
            });
        }
        else {
            this.setState({ errorMessage: I18n.t(['team', 'teamMissing']) });
        }
        //this._goToLogin();
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

    render () {
        return (
            <TouchableWithoutFeedback onPress={() => { this.emailText.blur(); }}>
                <LinearGradient
                    colors={[c('purple bg--color'), c('purple bg--color')]}
                    start={{x: 0.0, y: 0.0}} end={{x: 0.0, y: 0.0}}
                    style={[u(['spacing-pv-large']), { flex: 1, justifyContent: 'flex-start', paddingHorizontal: 40 * ratio, marginTop: this.state.keyboardShow ? -30 * ratio : 0 }]}
                >
                    <StatusBar barStyle="light-content" />
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
                        animation={this.state.formAnimation}
                        duration={150}
                        pointerEvents={this.state.showSpinner ? 'none' : null}
                    >
                        <View style={[{ marginTop: 204 * ratio, marginBottom: 63 * ratio}]}>
                            <TextField
                                ref={this.emailRef}
                                label={I18n.t(['team', 'teamPlaceholder'])}
                                value={this.state.teamValue}
                                baseColor={'#ffffff'}
                                textColor={'#ffffff'}
                                tintColor={'#ffffff'}
                                autoCapitalize="none"
                                labelFontSize={10 * vRatio}
                                fontSize={16 * vRatio}
                                labelPadding={4 * vRatio}
                                inputContainerStyle={{borderBottomWidth: 1 * vRatio, paddingBottom: 8 * vRatio, borderBottomColor: this.state.focused ? c('purple border') : 'white'}}
                                onChangeText={(teamValue) => this.setState({ teamValue })}
                                error={this.state.errorMessage}
                                errorColor={'#FC6180'}
                                onClear={() => this.setState({ teamValue: '' })}
                                returnKeyType="next"
                                onSubmitEditing={this._validate}
                                onFocus = {() => { this.setState({focused: true}); }}
                                onBlur = {() => { this.setState({focused: false}); }}
                                labelTextStyle={{ fontWeight: 'normal' }}
                                autoCorrect={false}
                                autoFocus
                            />
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <Button Mwidth={132 * ratio} Mheight={40 * ratio} Mcolor={this.state.teamValue.length > 0 ? 'primary' : 'transparent'} MSolid={true} label={I18n.t(['team', 'nextButton'])} onPress={this._validate} />
                        </View>
                    </Animatable.View>
                </LinearGradient>
            </TouchableWithoutFeedback>
        );
    }
}

Team.propTypes = {
    navigation: PropTypes.any
};

export default connect(null, mapDispatchToProps)(Team);
