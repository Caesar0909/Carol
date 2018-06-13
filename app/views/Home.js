// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Platform, Image } from 'react-native';
import { TabViewAnimated } from 'react-native-tab-view';
import Intercom from 'react-native-intercom';
// import ReactNativeUA from 'react-native-ua';
import I18n from 'react-native-i18n';

import Images from '../assets/icons/images/';
import BackgroundView from '../components/BackgroundView/';
import Callout from '../components/Callout/';
import StatList from '../components/StatList/';
import IconButton from '../components/IconButton/';
import Link from '../components/Link/';
import Tabs from '../components/Tabs/';

import Company from '../models/Company';
import FluigData from '../models/FluigData';
import Update from '../models/Update';
import User from '../models/User';

import u from '../helpers/utils/utils';
import c from '../helpers/color';
import immediatelyResetStack from '../helpers/immediatelyResetStack';
import SessionHelper from '../helpers/SessionHelper';
import PersistenceHelper from '../helpers/PersistenceHelper';

import CompanyService from '../services/CompanyService';

import Stats from '../models/Stats';

import { connect } from 'react-redux';
import {showBottomBar} from '../reduxes/actions';

const mapDispatchToProps = dispatch => ({
    showBottomBar: () => dispatch(showBottomBar())
});

let hasShownInviteCallout = false; // This would really benefit from being in a Redux store...

class Home extends Component {

    static propTypes = {
        showBottomBar: PropTypes.func
    };

    state: {
        badgeCount: number,
        favoriteCompanies: Array<Object>,
        numberOfCompanies: number,
        stDArr: Array<Object>,
        stWArr: Array<Object>,
        stMArr: Array<Object>,
        activeButton: boolean,
        index: number,
        upcomingIndex: number,
        routes: [{
            key: string,
            title: string
        }]
    };

    _shouldScrollToTopAfterTabChange: boolean;
    statsArr: Array<Object>;
    mdmArr: Array<Object>;
    statsDayArr: Array<Object>;
    statsWeekArr: Array<Object>;
    statsMonthArr: Array<Object>;
    cachStats: Object;

    constructor () {
        super();

        this._shouldScrollToTopAfterTabChange = true;

        this.state = {
            badgeCount: Update.unreadCount(),
            favoriteCompanies: Company.getAll().filter((company) => (company.favorite)),
            numberOfCompanies: FluigData.getNumberOfCompanies(),
            stDArr: [],
            stWArr: [],
            stMArr: [],
            activeButton: false,
            index: 0,
            upcomingIndex: 0,
            routes: [
                {
                    key: 'today',
                    title: 'Today'
                },
                {
                    key: 'week',
                    title: 'This week'
                },
                {
                    key: 'month',
                    title: 'This month'
                }
            ]
        };
        this.statsArr = [];
        this.mdmArr = [];
        this.statsDayArr = [];
        this.statsWeekArr = [];
        this.statsMonthArr = [];
        

    }

    static route = {
        navigationBar: null,
        styles: {
            gestures: null
        }
    };

    _onRealmChange = () => {
        if (!SessionHelper.currentSession()) {
            immediatelyResetStack(this.props, 'login');
        }
        else {
            this.setState({
                badgeCount: Update.unreadCount(),
                favoriteCompanies: Company.getAll().filter((company) => (company.favorite)),
                numberOfCompanies: FluigData.getNumberOfCompanies()
            });
        }
    };

    _updateCompanies = (success?: Function, failure?: Function) => {
        CompanyService.getAllWithIds(
            this.state.favoriteCompanies.map((company) => company.mdmData.id),
            (companies) => {
                companies.forEach((company) => {
                    Company.update(company.mdmData.id, company);
                });

                success ? success() : null;
            },
            failure);
    };

    _goToUpdates = () => {
        this.props.navigation.navigate('updates', { title: I18n.t(['updates', 'title']) });
    };

    _goToUserAccount = () => {
        Intercom.logEvent('navigated-to-user-account');

        this.props.navigation.navigate('userAccount', { title: I18n.t(['userAccount', 'title']) });
    };

    _goToInvite = () => {
        Intercom.logEvent('navigated-to-invite-from-home');

        this.props.navigation.navigate('invite');
    };

    _goToSearch = () => {
        Intercom.logEvent('tapped-search');

        this.props.navigation.navigate('searchResults');
    };

    _onRefresh = (finished: Function) => {
        this._updateCompanies(finished, finished);
    };

    _onSelectRow = (row) => {
     
        // this.props.navigation.navigate('companyDetail', { company: row.company, shouldUpdateCompany: true });
        this.props.navigation.navigate('view360', { company: row, shouldUpdateCompany: true });
    };

    _getHeadingText = () => {
        return I18n.t(['home', 'companiesListHeader.counting'], { count: this.state.favoriteCompanies.length });
    };

    _goVoice = () => {
        if (Platform.OS === 'android') {
            this.props.navigation.navigate('voiceAndroid');
        }
        else {
            this.props.navigation.navigate('voiceIOS');
            //this.props.hideBottomBar();
        }
    };
    

    _renderInviteCallout = () => {
        const { showInviteCallout } = this.props.navigation.state.params;

        if (showInviteCallout && !hasShownInviteCallout) {
            hasShownInviteCallout = true;

            return (
                <TouchableOpacity
                    style={u('spacing-ml-small')}
                    activeOpacity={0.5}
                    onPress={this._goToInvite}
                >
                    <Callout>
                        <Link
                            style={u('font-size-12')}
                            text={I18n.t(['home', 'inviteCallout'])}
                            onPress={this._goToInvite}
                        />
                    </Callout>
                </TouchableOpacity>
            );
        }

        return null;
    };

    _activateButton = () => {
        this.setState({activeButton: true});
    };

    _deActivateButton = () => {
        this.setState({activeButton: false});
    };

    _renderButtons = () => {
        if (!this.state.activeButton) {
            return (
                <View>
                    <IconButton
                        circular = {true}
                        posAbsolute={true}
                        color={c('purple main')}
                        hollow = {false}
                        fill={ c('buttons white primary')}
                        name="Plus"
                        size={60}
                        mbottom={60}
                        onPress={this._activateButton}
                    />
                </View>
            );
        }
        
        return (
            <View>
                <IconButton
                    circular = {true}
                    posAbsolute={true}
                    color={ '#ffffff' }
                    hollow = {false}
                    fill={ c('purple main')}
                    name="Cross"
                    size={40}
                    onPress={this._deActivateButton}
                    mbottom={60}
                    mright={30}
                />

                <IconButton
                    circular = {true}
                    posAbsolute={true}
                    color={c('purple main')}
                    hollow = {false}
                    fill={ c('buttons white primary')}
                    name="Mic"
                    size={60}
                    onPress={this._goVoice}
                    mbottom={130}
                />

                <IconButton
                    circular = {true}
                    posAbsolute={true}
                    color={c('purple main')}
                    hollow = {false}
                    fill={ c('buttons white primary')}
                    name="Filter"
                    size={60}
                    onPress={ () => {} }
                    mbottom={210}
                />
            </View>
        );
        
    };

    _handleTabChange = (index: number) => {
        this.setState({ index });

        if (index === 1 && this.statsWeekArr.length === 0 && this.cachStats.statsWeekArr.length > 0) {
            this.setState({stWArr: this.cachStats.week});
        }

        if (index === 2 && this.statsMonthArr.length === 0 && this.cachStats.statsMonthArr.length > 0) {
            this.setState({stMArr: this.cachStats.month});
        }

        if (index === 1 && this.statsWeekArr.length > 0 && this.statsWeekArr[0].trend === undefined) {
            this._loadDetailedStats('WEEKLY', [], this.mdmArr);
        }

        if (index === 2 && this.statsMonthArr.length > 0 && this.statsMonthArr[0].trend === undefined) {
            this._loadDetailedStats('MONTHLY', [], this.mdmArr);
        }
        

        // if (this._shouldScrollToTopAfterTabChange) {
        //     this._scrollView.scrollTo({
        //         x: 0,
        //         y: 0,
        //         animated: false
        //     });

        //     // this._shouldScrollToTopAfterTabChange = false;
        // }
    };

    _handleUpcomingTabChange = (value: number) => {
        const upcomingIndex = value > 0.5 ? 1 : 0;

        if (this.state.upcomingIndex !== upcomingIndex) {
            this.setState({ upcomingIndex });

            if (upcomingIndex === 1 && this._scrollViewOffsetY > this._insightsHeight) {
                this._shouldScrollToTopAfterTabChange = true;
            }
        }
    };

    _renderTabHeader = (props: Object) => {
        return (<Tabs {...props} upcomingIndex={this.state.upcomingIndex} mHome={true}/>);
    };

    _renderTabScene = ({ route }) => {
        switch (route.key) {
            case 'today':
                return (
                    <View style={{flex: 1}}>
                        <StatList
                            emptyStateText={I18n.t(['home', 'stateListEmptyState'])}
                            headingText={this._getHeadingText()}
                            rows={
                                this.state.stDArr
                            }
                            showEmptyState={!this.state.stDArr.length}
                            showHeading={true}
                            canRefresh={true}
                            onRefresh={this._refreshStats}
                            onSelectRow={this._onSelectRow}
                        />
                    </View>
                );

            case 'week':
                return (
                    <View style={{flex: 1}}>
                        <StatList
                            emptyStateText={I18n.t(['home', 'stateListEmptyState'])}
                            headingText={this._getHeadingText()}
                            rows={
                                this.state.stWArr
                            }
                            showEmptyState={!this.state.stWArr.length}
                            showHeading={true}
                            onSelectRow={() => {}}
                        />
                    </View>
                );
            case 'month':
                return (
                    <View style={{flex: 1}}>
                        <StatList
                            emptyStateText={I18n.t(['home', 'stateListEmptyState'])}
                            headingText={this._getHeadingText()}
                            rows={
                                this.state.stMArr
                            }
                            showEmptyState={!this.state.stMArr.length}
                            showHeading={true}
                            onSelectRow={() => {}}
                        />
                    </View>
                );
            default:
                return null;
        }
    };

    _refreshStats = (finished: Function) => {

        if (this.state.index === 0) {
            this._loadDetailedStats('DAILY', [], this.mdmArr, finished);
        }

        if (this.state.index === 1) {
            this._loadDetailedStats('WEEKLY', [], this.mdmArr, finished);
        }

        if (this.state.index === 2) {
            this._loadDetailedStats('MONTHLY', [], this.mdmArr, finished);
        }
    };

    _loadDetailedStats = (period, tArr, mArr, callback) => {
        CompanyService.getRecordStats(mArr, period, (suResult) => {
            //let Today = new Date();
            
            if (period === 'DAILY') {
                for (let i in suResult) {
                    let data = suResult[i];

                    for (let k = 0; k < this.statsDayArr.length; k++) {
                        if (this.statsDayArr[k].mdmName + 'Golden' === i) {
                            this.statsDayArr[k].rightVal = data.total;
                            this.statsDayArr[k].trend = data.trend;
                        }
                    }
                }
                this.setState({stDArr: this.statsDayArr});
                this.cachStats.today = this.statsDayArr;
                
            }

            if (period === 'WEEKLY') {
                for (let i in suResult) {
                    let data = suResult[i];

                    for (let k = 0; k < this.statsWeekArr.length; k++) {
                        if (this.statsWeekArr[k].mdmName + 'Golden' === i) {
                            this.statsWeekArr[k].rightVal = data.total;
                            this.statsWeekArr[k].trend = data.trend;
                        }
                    }
                }
                this.setState({stWArr: this.statsWeekArr});
                this.cachStats.week = this.statsWeekArr;
            }

            if (period === 'MONTHLY') {
                for (let i in suResult) {
                    let data = suResult[i];

                    for (let k = 0; k < this.statsMonthArr.length; k++) {
                        if (this.statsMonthArr[k].mdmName + 'Golden' === i) {
                            this.statsMonthArr[k].rightVal = data.total;
                            this.statsMonthArr[k].trend = data.trend;
                        }
                    }
                }
                this.setState({stMArr: this.statsMonthArr});
                this.cachStats.month = this.statsMonthArr;
            }
            Stats.updateStats(JSON.stringify(this.cachStats));
                
            if (callback !== undefined) { callback(); }
        }, (failResult) => {
            console.log(failResult);
            if (callback !== undefined) { callback(); }
        });
    };

    componentDidMount () {
        PersistenceHelper.addChangeListener(this._onRealmChange);

        this.cachStats = Stats.getStats() !== '' ? JSON.parse(Stats.getStats()) : { today: [], week: [], month: [], statsDayArr: [], statsWeekArr: [], statsMonthArr: []};

        this.setState({stDArr: this.cachStats.today});


        const loggedInUser = SessionHelper.currentSession();

        if (!loggedInUser.requestedNotification) {
            // ReactNativeUA.are_notifications_enabled((error, enabled) => {
            //     if (!enabled) {
            //         ReactNativeUA.enable_notification();
            //     }
            // });

            User.update(loggedInUser.username, {
                requestedNotification: true
            });
        }

        CompanyService.getNumberOfCompanies((numberOfCompanies) => {
            FluigData.updateNumberOfCompanies(numberOfCompanies);
        });
        //CompanyService.getRecordStats(["mdmclassGolden", "mdmstudentGolden"],(successResult) => {
        CompanyService.getExploreStat((successResult) => {
            // this.setState({statsArr: successResult});
            let stArr = successResult;
            
            CompanyService.getMobileDataModel((succResult) => {
                let filterArr = succResult.hits;

                for (let i = 0; i < filterArr.length; i++) {
                    this.mdmArr.push(filterArr[i].mdmName + 'Golden');
                }
                this.statsDayArr = [];
                this.statsWeekArr = [];
                this.statsMonthArr = [];
                stArr.forEach((item) => {
                    for (let i = 0; i < filterArr.length; i++) {
                        if (filterArr[i].mdmName === item.dataModelName) {
                            this.statsDayArr.push({mdmName: item.dataModelName, label: filterArr[i].mdmLabel['en-US'], totalNumberOfRecords: item.totalNumberOfRecords});
                            this.statsWeekArr.push({mdmName: item.dataModelName, label: filterArr[i].mdmLabel['en-US'], totalNumberOfRecords: item.totalNumberOfRecords});
                            this.statsMonthArr.push({mdmName: item.dataModelName, label: filterArr[i].mdmLabel['en-US'], totalNumberOfRecords: item.totalNumberOfRecords});
                        }
                    }
                });
                this.cachStats.statsDayArr = this.statsDayArr;
                this.cachStats.statsWeekArr = this.statsWeekArr;
                this.cachStats.statsMonthArr = this.statsMonthArr;
                Stats.updateStats(JSON.stringify(this.cachStats));
                this._loadDetailedStats('DAILY', this.statsArr, this.mdmArr);

            }, (failResult) => {
                console.log(failResult);
            });
        }, (failResult) => {
            console.log(failResult);
        });
    }

    componentWillUnmount () {
        PersistenceHelper.removeChangeListener(this._onRealmChange);
    }
    
    componentWillMount () {
        this.props.showBottomBar();
    }

    render () {
        return (
            <BackgroundView style={[u('spacing-pt-large')]}>
                <Image source={Images.HOMETOP} style={[{position: 'absolute', width: '100%'}]}/>
                
                <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, u('spacing-mb-small'), u('spacing-mt-default'), u('spacing-ph-default'), {backgroundColor: 'transparent'}]}>
                    <View style={[]}>
                        <IconButton
                            circular={true}
                            color={c('transparent')}
                            fill={c('buttons white primary')}
                            name="Hamburger"
                            size= {30}
                            onPress={this._goToUserAccount}
                        />
                        
                        {this._renderInviteCallout()}
                    </View>

                    <View style={[{ alignItems: 'center' }]}>
                        <Image source={Images.LOGO} style={[{width: 153, height: 11}]}/>
                    </View>

                    <IconButton
                        circular={true}
                        color={c('transparent')}
                        fill={c('buttons white primary')}
                        name="Magnifier"
                        size={30}
                        onPress={this._goToSearch}
                    />
                </View>
                    
                
                {/*<TabViewAnimated*/}
                    {/*style={{flex: 1}}*/}
                    {/*navigationState={this.state}*/}
                    {/*renderScene={this._renderTabScene}*/}
                    {/*renderHeader={this._renderTabHeader}*/}
                    {/*onRequestChangeTab={this._handleTabChange}*/}
                    {/*onChangePosition={this._handleUpcomingTabChange}*/}
                    {/*onIndexChange={this._handleUpcomingTabChange}*/}
                {/*/>*/}

                {this._renderButtons()}
            </BackgroundView>
        );
    }
}

Home.propTypes = {
    navigation: PropTypes.any,
    route: PropTypes.any
};

export default connect(null, mapDispatchToProps)(Home);
