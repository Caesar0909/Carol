// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Intercom from 'react-native-intercom';
import I18n from 'react-native-i18n';
import LinearGradient from 'react-native-linear-gradient';

import BackgroundView from '../components/BackgroundView/';
import ListItemButton from '../components/ListItemButton/';
import UserAccountHeader from '../components/UserAccountHeader';

import SessionHelper from '../helpers/SessionHelper';
import u from '../helpers/utils/utils';
import c from '../helpers/color';

import { loginType } from '../models/User';

class UserAccount extends Component {
    static route = {
        navigationBar: {
            title: (params) => params.title,
            renderBackground: () => (
                <LinearGradient
                    colors={[c('green light-background'), c('green dark-background')]}
                    start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 1.0}}
                    style={[{ flex: 2, justifyContent: 'center'}]}
                >
                </LinearGradient>
            )
        }
    };

    _goToInvite = () => {
        Intercom.logEvent('navigated-to-invite');

        this.props.navigation.navigate('invite', { title: I18n.t(['invite', 'title']) });
    };

    _giveFeedback = () => {
        Intercom.displayMessageComposer();
    };

    _logOut = () => {
        SessionHelper.finishSession();
    };

    render () {
        const user = SessionHelper.currentSession();

        return (
            <BackgroundView
                Mwhite={true}>
                {user.loginType === loginType.fluigIdentity && user.name && user.imagePath &&
                    <UserAccountHeader
                        name={user.name}
                        imagePath={user.imagePath}
                    />
                }
                <View style={u('spacing-mb-xx-large')}>
                    <ListItemButton
                        label={I18n.t(['userAccount', 'inviteButton'])}
                        onPress={this._goToInvite}
                    />
                    <ListItemButton
                        label={I18n.t(['userAccount', 'feedbackButton'])}
                        onPress={this._giveFeedback}
                    />
                </View>
                <ListItemButton
                    label={I18n.t(['userAccount', 'logOutButton'])}
                    Mcolor="text-red"
                    topBorder={true}
                    onPress={this._logOut}
                />
            </BackgroundView>
        );
    }
}

UserAccount.propTypes = {
    navigation: PropTypes.any,
    route: PropTypes.any
};

export default UserAccount;
