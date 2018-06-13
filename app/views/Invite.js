// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, View, Keyboard } from 'react-native';

import * as Animatable from 'react-native-animatable';
import Intercom from 'react-native-intercom';
import I18n from 'react-native-i18n';

import BackgroundView from '../components/BackgroundView/';
import NavigationAction from '../components/NavigationAction/';
import TextBox from '../components/TextBox/';
import { SideBySide, SideBySide__Item } from '../components/SideBySide/';
import T from '../components/T/';
import Icon from '../components/Icon/';
import Button from '../components/Button/';
import Spinner from '../components/Spinner/';
import EmptyState from '../components/EmptyState/';

import { CancelablePromise } from '../helpers/makeCancelable';

import SessionHelper from '../helpers/SessionHelper';
import c from '../helpers/color';
import u from '../helpers/utils/utils';

import UserService from '../services/UserService';

import { paperPlaneFlyIn } from '../settings/animations';

Animatable.initializeRegistryWithDefinitions({ paperPlaneFlyIn });

class Invite extends Component {
    state: {
        email: string,
        hasAttemptedInvite: boolean,
        hasInvited: boolean,
        isAttemptingInvite: boolean,
        errorMessage: string | null
    };

    _subscribeToInviteEvent: Function;
    _inviteUser: CancelablePromise;

    static route = {
        navigationBar: {
            title: (params) => params.title,
            renderRight: (props) => (
                <NavigationAction {...props} eventName="invite" canBeDisabled={true}>
                    {
                        Platform.OS === 'ios' ?
                            <T style={[u('font-size-16'), { color: '#fff' }]}>{I18n.t(['invite', 'sendButton'])}</T> :
                            <Icon name="AndroidPaperPlane" fill="#fff" height="16" width="16" />
                    }
                </NavigationAction>
            )
        }
    }

    constructor () {
        super();

        this.state = {
            name: '',
            email: '',
            hasAttemptedInvite: false,
            hasInvited: false,
            isAttemptingInvite: false,
            errorMessage: null
        };
    }

    _setNameValue (name: string) {
        this.setState({ name }, this._validateNameValue);
    }

    _validateNameValue (): any {
        if (this.state.email.trim().length > 0 && this.state.name.trim().length > 0) {
            this.props.route.getEventEmitter().emit('inviteEnable');

            return true;
        }

        this.props.route.getEventEmitter().emit('inviteDisable');

        return false;
    }

    _setEmailValue (email: string) {
        this.setState({ email }, this._validateEmailValue);
    }

    _validateEmailValue (): any {
        if (this.state.email.trim().length > 0 && this.state.name.trim().length > 0) {
            this.props.route.getEventEmitter().emit('inviteEnable');

            return true;
        }

        this.props.route.getEventEmitter().emit('inviteDisable');

        return false;
    }

    _invite = () => {
        // Intercom.logEvent('tapped-send-invite');

        if (!this._validateEmailValue()) {
            return;
        }

        this.setState({
            isAttemptingInvite: true,
            errorMessage: null
        });

        if (!this.state.hasAttemptedInvite) {
            this.setState({ hasAttemptedInvite: true });
        }

        const user = SessionHelper.currentSession();

        this._inviteUser = UserService.inviteUser(
            this.state.email.trim(),
            this.state.name,
            user.tenantSubDomain,
            () => {
                this.setState({ isAttemptingInvite: false });
                Keyboard.dismiss();
                this.props.route.getEventEmitter().emit('inviteDisable');
                this.props.route.getEventEmitter().emit('inviteHide');
                this.setState({ hasInvited: true });
            },
            (error) => {
                this.setState({
                    isAttemptingInvite: false,
                    errorMessage: error.message
                });
            }
        );
    };

    _goBack = () => {
        this.props.navigation.back();
    };

    _renderInputGroup = () => {
        return (
            <Animatable.View
                animation={this.state.hasInvited ? 'fadeOutUp' : null}
                duration={100}
            >
                <Animatable.View
                    transition="maxHeight"
                    style={{ maxHeight: this.state.hasInvited ? 0 : 100 }}
                    duration={100}
                >
                    <SideBySide style={[{ backgroundColor: '#fff' }, u('spacing-p-default')]}>
                        <SideBySide__Item MvAlign="center">
                            <T style={[{ color: u('core text--darkest') }, u('spacing-pr-small')]}>{I18n.t(['invite', 'to'])}:</T>
                        </SideBySide__Item>
                        <SideBySide__Item Mfluid={true}>
                            <TextBox
                                autoCapitalize="none"
                                autoFocus={true}
                                placeholder={I18n.t(['invite', 'namePlaceholder'])}
                                onChangeText={(name) => this._setNameValue(name)}
                                onClear={() => this._setNameValue('')}
                                value={this.state.name}
                            />
                            <TextBox
                                autoCapitalize="none"
                                autoFocus={false}
                                keyboardType="email-address"
                                placeholder={I18n.t(['invite', 'emailPlaceholder'])}
                                returnKeyType="send"
                                onChangeText={(email) => this._setEmailValue(email)}
                                onClear={() => this._setEmailValue('')}
                                onSubmitEditing={this._invite}
                                value={this.state.email}
                            />
                        </SideBySide__Item>
                    </SideBySide>
                </Animatable.View>
            </Animatable.View>
        );
    }

    _renderEmptyState = () => {
        if (this.state.hasAttemptedInvite) {
            return null;
        }

        return <EmptyState text={I18n.t(['invite', 'emptyState'])}/>;
    }

    _renderError = () => {
        if (!this.state.errorMessage) {
            return null;
        }

        return <EmptyState style={{ color: c('core danger') }} text={this.state.errorMessage} />;
    }

    _renderSpinner = () => {
        if (!this.state.isAttemptingInvite) {
            return null;
        }

        return (
            <View style={{ alignItems: 'center' }}>
                <Spinner style={u('spacing-mt-x-large')} />
            </View>
        );
    }

    _renderSuccess = () => {
        
        return (
            <View
                style={{
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'center',
                    opacity: this.state.hasInvited ? 1 : 0
                }}
            >
                <Animatable.View
                    animation={this.state.hasInvited ? 'paperPlaneFlyIn' : null}
                    duration={500}
                    easing="ease-out-expo"
                >
                    <Icon name="PaperPlaneWithTrail" width="284" height="243" />
                </Animatable.View>

                <Animatable.View
                    animation={this.state.hasInvited ? 'zoomIn' : null}
                    duration={300}
                    easing="ease-in-out-back"
                >
                    <T style={u(['color-text--darkest', 'font-size-24', 'spacing-mv-xx-large'])}>{I18n.t(['invite', 'success'])}</T>
                </Animatable.View>

                <View style={u('spacing-mt-large')}>
                    <Animatable.View
                        animation={this.state.hasInvited ? 'slideInUp' : null}
                        duration={400}
                        easing="ease-out-quint"
                    >
                        <Button
                            label="OK"
                            style={{ width: 130 }}
                            onPress={this._goBack}
                        />
                    </Animatable.View>
                </View>
            </View>
        );
    }

    componentDidMount () {
        // this._subscribeToInviteEvent = this.props.route.config.eventEmitter.addListener('invite', this._invite);
    }

    componentWillUnmount () {
        Intercom.logEvent('navigated-away-invite');
        this._subscribeToInviteEvent.remove();
    }

    render () {
        return (
            <View style={{backgroundColor: 'white'}}>
                {this._renderInputGroup()}
                {this._renderEmptyState()}
                {this._renderError()}
                {this._renderSpinner()}
                {this._renderSuccess()}
            </View>
        );
    }
}

Invite.propTypes = {
    navigation: PropTypes.any,
    route: PropTypes.any
};

export default Invite;
