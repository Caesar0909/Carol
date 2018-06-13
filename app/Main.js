// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Platform, StatusBar, View, TouchableOpacity } from 'react-native';
//import { createRouter, NavigationProvider, StackNavigation } from '@expo/ex-navigation';
import { StackNavigator, NavigationActions } from 'react-navigation';
// import ReactNativeUA from 'react-native-ua';
import I18n from 'react-native-i18n';
import SplashScreen from 'react-native-smart-splash-screen';
import Drawer from 'react-native-drawer';
import LinearGradient from 'react-native-linear-gradient';

import CompanyDetail from './views/CompanyDetail';
import Home from './views/Home';
import Invite from './views/Invite';
import Login from './views/Login';
import Team from './views/Team';
import LoginFluigIdentity from './views/LoginFluigIdentity';
import Map from './views/Map';
import Updates from './views/Updates';
import UserAccount from './views/UserAccount';
import SearchFilterValues from './views/SearchFilterValues';
import VoiceAndroid from './views/VoiceAndroid';
import VoiceIOS from './views/VoiceIOS';
import View360 from './views/View360';
import Company360 from './views/360/Company360';
import Product360 from './views/360/Product360';
import Person360 from './views/360/Person360';
import FullScreen from './views/FullScreen';
import CompanyHome from './views/CompanyHome';
import Welcome from './views/Welcome';
import SearchHome from './views/SearchHome';
import SearchResults from './views/SearchResults';
import SearchFilter from './views/SearchFilter';
import AddState from './views/AddState';
import Instructions from './views/Instructions';

import {
    BackgroundView,
    IconButton,
    T,
    Menu
} from './components';

import SessionHelper from './helpers/SessionHelper';
import { generateUUID } from './helpers/utils/uuid';
import { immediatelyResetStack, immediatelyNavigate} from './helpers/immediatelyResetStack';

// import navigationBarDefaults from './settings/navigationBarDefaults';
import translations from './settings/translations';

import Update from './models/Update';

import c from './helpers/color';
import { ratio, windowSize } from './helpers/windowSize';

import { connect } from 'react-redux';

import {
    selectMenu,
    toggleMenu
} from './reduxes/actions';
import {
    currentMenuIdSelector,
    bottomSettingSelector,
    uiSelector
} from './reduxes/selectors';

const mapStateToProps = state => ({
    currentMenuId: currentMenuIdSelector(state),
    currentBottomState: bottomSettingSelector(state),
    ui: uiSelector(state)
});

const mapDispatchToProps = dispatch => ({
    selectMenu: (id) => dispatch(selectMenu(id)),
    closeMenu: () => dispatch(toggleMenu(false))
});

const stackNavigator = StackNavigator;

export const ViewStack = stackNavigator({
    companyDetail: {
        screen: CompanyDetail
    },
    home: {
        screen: Home
    },
    team: {
        screen: Team
    },
    invite: {
        screen: Invite
    },
    login: {
        screen: Login
    },
    loginFluigIdentity: {
        screen: LoginFluigIdentity
    },
    instructions: {
        screen: Instructions
    },
    map: {
        screen: Map
    },
    searchFilterValues: {
        screen: SearchFilterValues
    },
    updates: {
        screen: Updates
    },
    userAccount: {
        screen: UserAccount
    },
    voiceAndroid: {
        screen: VoiceAndroid
    },
    voiceIOS: {
        screen: VoiceIOS
    },
    view360: {
        screen: View360
    },
    fullScreen: {
        screen: FullScreen
    },
    company360: {
        screen: Company360
    },
    product360: {
        screen: Product360
    },
    person360: {
        screen: Person360
    },
    companyHome: {
        screen: CompanyHome
    },
    welcome: {
        screen: Welcome
    },
    searchHome: {
        screen: SearchHome
    },
    searchResults: {
        screen: SearchResults
    },
    searchFilter: {
        screen: SearchFilter
    },
    addState: {
        screen: AddState
    }
}, {
    initialRouteName: SessionHelper.currentSession() ? 'companyHome' : 'team',
    initialRouteParams: {
        showInviteCallout: false
    },
    headerMode: 'none'
});

I18n.defaultLocale = 'en';
I18n.fallbacks = true;
I18n.translations = translations;

class Main extends Component {
    static propTypes = {
        currentBottomState: PropTypes.bool,
        ui: ImmutablePropTypes.map.isRequired,
        selectMenu: PropTypes.func.isRequired,
        closeMenu: PropTypes.func.isRequired,
        currentMenuId: PropTypes.string.isRequired,
        navigator: PropTypes.any
    };
    
    constructor (props) {
        super(props);
        this.state = {
            showAlert: true
        };
        // ReactNativeUA.on_notification((notification) => {
        //     Update.create({
        //         id: generateUUID(),
        //         recordId: notification.data.recordId,
        //         type: notification.data.type,
        //         title: notification.data.title,
        //         description: notification.data.description,
        //         unread: true,
        //         createdAt: new Date()
        //     });

        //     ReactNativeUA.handle_background_notification();

        //     console.log('on_notification', notification.data); // eslint-disable-line no-console
        // });
    }

    
    componentDidMount () {
        if (Platform.OS === 'android') {
            SplashScreen.close({
                animationType: SplashScreen.animationType.scale,
                duration: 1000,
                delay: 500
            });
        }
    }

    _initializeNavigator = (ref) => {
        this.navigator = ref;
    }

    _handleRouting = (routeName) => {
        const currentRoute = this.navigator.state.nav.routes[this.navigator.state.nav.index];

        if (routeName !== currentRoute.routeName) {
            // immediatelyResetStack({
            //     navigation: this.navigator._navigation
            // }, routeName);
            this.navigator._navigation.navigate(routeName);
        }
    }

    _goToCompanyHome = () => {
        this._handleRouting('companyHome');
        // SessionHelper.finishSession();
    }

    _goToSearchHome = () => {
        this._handleRouting('searchHome');
    }

    _goToInteractionHome = () => {
        if (Platform.OS === 'android') {
            this.navigator._navigation.navigate('voiceAndroid', { showInviteCallout: true });
        }
        else {
            this.navigator._navigation.navigate('voiceIOS', { showInviteCallout: true });
        }
    }

    _renderBottomBar = () => {
        if (this.props.currentBottomState) {
            return (<View
                style={{
                    backgroundColor: c('purple bg--color'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    height: 40 * ratio
                }}
            >
                <IconButton
                    circular={true}
                    color={c('transparent')}
                    fill={c('purple main')}
                    name="Home"
                    size= {30 * ratio}
                    onPress={this._goToCompanyHome}
                />
                <IconButton
                    circular={true}
                    color={c('transparent')}
                    fill={c('purple main')}
                    name="Microphone"
                    size= {30 * ratio}
                    onPress={this._goToInteractionHome}
                />
                <IconButton
                    circular={true}
                    color={c('transparent')}
                    fill={c('purple main')}
                    name="Search"
                    size= {30 * ratio}
                    onPress={this._goToSearchHome}
                />
                {/* <IconButton
                    circular={true}
                    color={'transparent'}
                    fill={'#6F4FB0'}
                    stroke={'#6F4FB0'}
                    name="StarEmpty"
                    size= {32 * ratio}
                    onPress={this._goToUserAccount}
                />
                <View style={{backgroundColor: 'transparent', width: 40}}>
                    <IconButton
                        circular={true}
                        color={'transparent'}
                        fill={'#6F4FB0'}
                        stroke={'#6F4FB0'}
                        name="Bell"
                        size= {30 * ratio}
                    />
                    <View style={{width: 20 * ratio,
                        height: 15 * ratio,
                        backgroundColor: '#FC6180',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        top: -2 * ratio,
                        borderRadius: 8 * ratio,
                        borderColor: '#FC6180',
                        right: -3 * ratio,
                        zIndex: 555}}>
                        <T style={{fontSize: 10 * ratio, color: 'white', textAlign: 'center'}}>99</T>
                    </View>
                </View> */}
            </View>
            );
        }

        return null;
    };

    onMenuItemSelected = (item) => {
        this.props.closeMenu();

        if ( item === 'logout' ) {
            SessionHelper.finishSession();
            immediatelyResetStack({
                navigation: this.navigator._navigation
            }, 'login', { showInviteCallout: true });

            return;
        }

        if ( item === 'invite') {
            immediatelyNavigate({
                navigation: this.navigator._navigation
            }, 'invite', { showInviteCallout: true });

            return;
        }
        if (item !== 'close') {
            this.props.selectMenu(item);
        }
    };

    _renderAlertView = () => {
        if (this.props.currentMenuId !== 'noDash' || !this.state.showAlert) {
            return null;
        }

        return (<View style={{
            zIndex: 555,
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#00000080',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 30 * ratio}}>
            <T style={{color: 'white', fontSize: 20 * ratio, fontWeight: 'bold'}}>Hi {SessionHelper.currentSession().name},</T>
            <T style={{color: 'white', fontSize: 15 * ratio, textAlign: 'center'}}>You don't have insights configured yet</T>
            <TouchableOpacity
                style={{borderRadius: 6, backgroundColor: 'transparent'}}
                onPress = {() => this.setState({showAlert: false})}
            >
                <LinearGradient
                    colors={[c('purple active'), c('purple main')]}
                    style={[{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 15,
                        overflow: 'hidden',
                        width: windowSize.width - 100,
                        height: 40 * ratio,
                        borderWidth: 1,
                        borderColor: c('purple border'),
                        borderRadius: 6
                    }]}
                >
                    <T style={{borderRadius: 6, fontSize: 18 * ratio, color: 'white'}}>OK</T>
                </LinearGradient>
            </TouchableOpacity>
        </View>);
    }

    render () {
        const { ui } = this.props;
        const menuOpen = ui.get('menuOpen');
        const menuContent = <Menu
            onItemSelected={this.onMenuItemSelected}
            menus={ui.get('menuData').toJS()}
            active={ui.get('currentMenuId')}
        />;

        return (
            <Drawer
                type="overlay"
                content={menuContent}
                ref={(ref) => { this._drawer = ref; }}
                style = {{ shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3, backgroundColor: 'red', height: 500}}
                tweenDuration={menuOpen ? 250 : 200}
                tweenEasing="easeOutCubic"
                open={menuOpen}
            >
                <BackgroundView
                    Mwhite={true}>

                    {this._renderAlertView()}
                    <StatusBar barStyle="light-content" />

                    <View
                        style={{
                            flex: 1
                        }}
                    >
                        <ViewStack ref={this._initializeNavigator}/>
                    </View>
                    
                    {this._renderBottomBar()}
                </BackgroundView>
            </Drawer>
        );
    }

// <NavigationProvider router={Router}>
//     <StatusBar barStyle="light-content" />
//     <StackNavigation
//     defaultRouteConfig={{ navigationBar: navigationBarDefaults }}
//     initialRoute={SessionHelper.currentSession() ? Router.getRoute('home') : Router.getRoute('team')}
//     />
// </NavigationProvider>
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
