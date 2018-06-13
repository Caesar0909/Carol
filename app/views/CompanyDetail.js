// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, RefreshControl, ScrollView, View } from 'react-native';
import { TabViewAnimated } from 'react-native-tab-view';
import * as Animatable from 'react-native-animatable';
import Intercom from 'react-native-intercom';
import I18n from 'react-native-i18n';
import LinearGradient from 'react-native-linear-gradient';

import Company from '../models/Company';

//import ExNavigationBar from '../components/overrides/ExNavigation/ExNavigationBar';
import BackgroundView from '../components/BackgroundView/';
import NavigationSpacer from '../components/NavigationSpacer/';
import Tabs from '../components/Tabs/';
import DetailsIntro from '../components/DetailsIntro/';
import ToggleIcon from '../components/ToggleIcon/';
import BounceBackground from '../components/BounceBackground/';
import {
    CompanyDetail__Contact,
    CompanyDetail__Location,
    CompanyDetail__Nps,
    CompanyDetail__OpportunitiesTickets,
    CompanyDetail__Summary
} from '../components/CompanyDetail';
import { Modal, Modal__Title, Modal__Content, Modal__Footer } from '../components/Modal/';
import Button from '../components/Button/';
import ListItemButton from '../components/ListItemButton/';

import CompanyService from '../services/CompanyService';
import TicketService from '../services/TicketService';
import OpportunityService from '../services/OpportunityService';
import IndustryService from '../services/IndustryService';
import CustomerService from '../services/CustomerService';
import MiscService from '../services/MiscService';
import NpsService from '../services/NpsService';
import UserService from '../services/UserService';

import PersistenceHelper from '../helpers/PersistenceHelper';
import ResponseHelper from '../helpers/ResponseHelper';
import SessionHelper from '../helpers/SessionHelper';
import c from '../helpers/color';
import u from '../helpers/utils/utils';
import { CancelablePromise } from '../helpers/makeCancelable';
import { windowSize } from '../helpers/windowSize';

import COMPANY_ATTRIBUTES from '../constants/companyAttributes';

class CompanyDetail extends Component {
    state: {
        company: Object,
        index: number,
        upcomingIndex: number,
        routes: [{
            key: string,
            title: string
        }],
        headquartersLocation: ?Object,
        branchLocations: Array<Object>,
        tickets: Array<Object>,
        opportunities: Array<Object>,
        npses: Array<Object>,
        relatedCompanies: Array<Object>,
        modalFieldType: string,
        modalFieldValue: string,
        isModalVisible: boolean,
        alreadyEditedFields: Array<string>,
        isRefreshing: boolean
    };

    _detailsIntroBottomY: number;
    _scrollView: any;
    _scrollViewOffsetY: number;
    _insightsHeight: number;
    _shouldScrollToTopAfterTabChange: boolean;
    _getTicketsPromise: CancelablePromise;
    _getOpportunitiesPromise: CancelablePromise;
    _getNpsPromise: CancelablePromise;
    _getRelatedCompaniesPromise: CancelablePromise;
    _searchCustomersPromise: CancelablePromise;
    _getIndustryDescriptionPromise: CancelablePromise;
    _subscribeToToggleFavoriteEvent: Function;

    static route = {
        navigationBar: {
            renderTitle: ({ params }) => (
                <Animatable.View
                    duration={100}
                    easing="ease"
                    transition={['opacity', 'translateY']}
                    style={{
                        flex: 1,
                        marginHorizontal: Platform.OS === 'ios' ? 20 : 0,
                        opacity: params.titleIsVisible ? 1 : 0,
                        transform: [{
                            translateY: params.titleIsVisible ? 0 : 20
                        }]
                    }}
                >
                    {/*<ExNavigationBar.Title textStyle={{ color: '#fff' }}>*/}
                        {/*{props.title}*/}
                    {/*</ExNavigationBar.Title>*/}
                </Animatable.View>
            ),
            renderRight: (props: Object) => (
                <NavigationSpacer>
                    <ToggleIcon
                        {...props}
                        eventName="favorite"
                        name="Star"
                        offColor="#fff"
                        onColor={c('yellow star')}
                        height={21}
                        width={21}
                    />
                </NavigationSpacer>
            ),
            renderBackground: () => (
                <LinearGradient
                    colors={[c('green light-background'), c('green dark-background')]}
                    start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 0.0}}
                    style={[{ flex: 2, justifyContent: 'center'}]}
                >
                </LinearGradient>
            ),
            borderBottomWidth: 0
        }
    };

    constructor (props: Object) {
        super(props);

        this.state = {
            company: props.navigation.state.params.company,
            index: props.navigation.state.params.selectInsightsTabInitially ? 1 : 0,
            upcomingIndex: 0,
            routes: [
                {
                    key: 'overview',
                    title: I18n.t(['companyDetail', 'tab', 'overview'])
                },
                {
                    key: 'insights',
                    title: I18n.t(['companyDetail', 'tab', 'insights'])
                }
            ],
            headquartersLocation: null,
            branchLocations: [],
            tickets: [],
            opportunities: [],
            npses: [],
            relatedCompanies: [],
            modalFieldType: '',
            modalFieldValue: '',
            isModalVisible: false,
            alreadyEditedFields: [],
            isRefreshing: false
        };
    }

    _onRealmChange = () => {
        const company = Company.getWithId(this.state.company.mdmData.id);

        if (company) {
            this.setState({ company });
        }
    };

    _updateCompany = (success?: Function, failure?: Function) => {
        const id = this.state.company.mdmData.id;

        CompanyService.getWithId(
            id,
            (company) => {
                Company.update(id, company);

                success ? success() : null;
            },
            failure
        );
    };

    _getIndustryDescription = () => {
        this._getIndustryDescriptionPromise = IndustryService.getWithCnaebr(
            this.state.company.cnaebr,
            (industry) => {
                Company.update(this.state.company.mdmData.id, { industry });
            }
        );
    };

    _getRelatedCompanies = () => {
        this._getRelatedCompaniesPromise = CompanyService.getRelatedCompanies(
            this.state.company.taxId,
            (companies) => {
                this._searchCustomersPromise = CustomerService.getAllWithTaxIds(
                    companies.map((company) => company.taxId),
                    (customers) => {
                        companies = companies.map((company) => (
                            {
                                ...company,
                                customer: customers.find((customer) => { return customer.taxId === company.taxId; })
                            }
                        ));

                        this.setState({
                            relatedCompanies: companies
                        });
                    }
                );
            }
        );
    };

    _getNps = () => {
        this._getNpsPromise = NpsService.getTwoMostRecentWithCompanyCode(
            this.state.company.customer.companyCode,
            (npses) => this.setState({ npses })
        );
    };

    _getOpportunities = () => {
        this._getOpportunitiesPromise = OpportunityService.getAllOpenWithCompanyCode(
            this.state.company.customer.companyCode,
            (opportunities) => {
                this.setState({
                    opportunities: opportunities.reduce((data, opportunity) => {
                        data.push({
                            description: opportunity.description,
                            footer: I18n.t(['companyDetail', 'opportunities', 'row', 'footer'], { priority: opportunity.priority }),
                            date: new Date(opportunity.expectedCloseDate).toISOString()
                        });

                        return data;
                    }, [])
                });
            }
        );
    };

    _getTickets = () => {
        this._getTicketsPromise = TicketService.getAllOpenWithCompanyCode(
            this.state.company.customer.companyCode,
            (tickets) => {
                this.setState({
                    tickets: tickets.reduce((data, ticket) => {
                        data.push({
                            description: `#${ticket.code} ${ticket.description}`,
                            footer: I18n.t(
                                ['companyDetail', 'tickets', 'row', 'footer'],
                                {
                                    creationDate: ticket.creationDate,
                                    internalInteractionsCount: ticket.internalInteractionsCount,
                                    externalInteractionsCount: ticket.externalInteractionsCount
                                }),
                            date: new Date(ticket.lastUpdated).toISOString()
                        });

                        return data;
                    }, [])
                });
            }
        );
    };

    _getDetailsIntroBottomY = (e: Object) => {
        this._detailsIntroBottomY = e.nativeEvent.layout.height - e.nativeEvent.layout.y;
    };

    _getInsightsHeight = (e: Object) => {
        this._insightsHeight = e.nativeEvent.layout.height;
    };

    _handleScroll = (e: Object) => {
        const offsetY = e.nativeEvent.contentOffset.y;

        if (offsetY < 0) {
            return;
        }

        const direction = offsetY > this._scrollViewOffsetY ? 'down' : 'up';

        this._scrollViewOffsetY = offsetY;

        if (
            direction === 'down' && this.props.navigation.state.params.titleIsVisible ||
            direction === 'up' && !this.props.navigation.state.params.titleIsVisible
        ) {
            return;
        }

        if (direction === 'down' && this._scrollViewOffsetY >= this._detailsIntroBottomY) {
            this.props.navigation.setParams({
                title: this.state.company.name,
                titleIsVisible: true
            });
        }
        else if (direction === 'up' && this._scrollViewOffsetY <= this._detailsIntroBottomY) {
            this.props.navigation.setParams({
                titleIsVisible: false
            });
        }
    };

    _handleTabChange = (index: number) => {
        this.setState({ index });

        if (this._shouldScrollToTopAfterTabChange) {
            this._scrollView.scrollTo({
                x: 0,
                y: 0,
                animated: false
            });

            this._shouldScrollToTopAfterTabChange = false;
        }
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

    _toggleFavorite = () => {
        if (this.state.company.favorite) {
            this.props.route.getEventEmitter().emit('favoriteToggleOff');
            Company.update(this.state.company.mdmData.id, {
                favorite: false
            });

            if (this.state.company.customer) {
                MiscService.deleteSubscription(this.state.company.customer.mdmData.entityTemplateId, this.state.company.customer.mdmData.id, () => null);
            }
            else {
                MiscService.deleteSubscription(this.state.company.mdmData.entityTemplateId, this.state.company.mdmData.id, () => null);
            }

            Intercom.logEvent('company-unfavorited');
        }
        else {
            this.props.route.getEventEmitter().emit('favoriteToggleOn');
            Company.update(this.state.company.mdmData.id, {
                favorite: true
            });

            if (this.state.company.customer) {
                MiscService.addSubscription(this.state.company.customer.mdmData.entityTemplateId, this.state.company.customer.mdmData.id, () => null);
            }
            else {
                MiscService.addSubscription(this.state.company.mdmData.entityTemplateId, this.state.company.mdmData.id, () => null);
            }

            Intercom.logEvent('company-favorited');
        }

        UserService.saveFavoriteCompanyIds(
            Company.getAll().reduce((companyIds, company) => {
                if (company.favorite) {
                    return [...companyIds, company.mdmData.id];
                }

                return companyIds;
            }, [])
        );
    };

    _openModal = (fieldType: string, value: string) => {
        this.setState({
            modalFieldType: fieldType,
            modalFieldValue: value,
            isModalVisible: true
        });
    };

    _closeModal = () => {
        this.setState({
            modalFieldType: '',
            modalFieldValue: '',
            isModalVisible: false
        });
    };

    _submitModalFieldValue = () => {
        const value = this.state.modalFieldValue;
        const fieldType = this.state.modalFieldType;
        const loggedInUser = SessionHelper.currentSession();

        if (value) {
            switch (fieldType) {
                case 'numberOfEmployees':
                    MiscService.saveStagingData('mobilesuggestion', {
                        taxid: this.state.company.taxId,
                        email: loggedInUser.username,
                        datatype: 'employees',
                        value
                    }, (result) => {
                        if (ResponseHelper.wasSuccessful(result)) {
                            this.setState({
                                alreadyEditedFields: [...this.state.alreadyEditedFields, fieldType]
                            });

                            Company.update(this.state.company.mdmData.id, {
                                numberOfEmployees: value
                            });

                            this._closeModal();
                        }
                    });

                    break;
                case 'revenue':
                    MiscService.saveStagingData('mobilesuggestion', {
                        taxid: this.state.company.taxId,
                        email: loggedInUser.username,
                        datatype: 'revenue',
                        value
                    }, (result) => {
                        if (ResponseHelper.wasSuccessful(result)) {
                            this.setState({
                                alreadyEditedFields: [...this.state.alreadyEditedFields, fieldType]
                            });

                            Company.update(this.state.company.mdmData.id, {
                                revenue: value
                            });

                            this._closeModal();
                        }
                    });

                    break;
                default:
                    break;
            }
        }
    };

    _onRefresh = () => {
        this.setState({ isRefreshing: true });
        this._updateCompany(() => this.setState({ isRefreshing: false }), () => this.setState({ isRefreshing: false }));
    };

    _renderOverview = () => {
        const addresses = [this.state.company, ...this.state.relatedCompanies].map((company) => ({
            ...company.addresses[0],
            id: company.mdmData.id,
            isHQ: Company.isHQ(company),
            selected: company.mdmData.id === this.state.company.mdmData.id,
            onSelect: () => {
                this.props.navigation.navigate('companyDetail', { company });
            }
        }));
        
        return (
            <View style={this.state.upcomingIndex === 1 && { height: this._insightsHeight, overflow: 'hidden' }}>
                <CompanyDetail__Summary
                    taxId={Company.getFormattedTaxId(this.state.company)}
                    dba={this.state.company.dba}
                    mainActivity={this.state.company.mainActivity !== null ? this.state.company.mainActivity.description : ''}
                    numberOfEmployees={this.state.company.numberOfEmployees}
                    numberOfEmployeesHasBeenEdited={this.state.alreadyEditedFields.includes('numberOfEmployees')}
                    revenue={this.state.company.revenue}
                    revenueHasBeenEdited={this.state.alreadyEditedFields.includes('revenue')}
                    marketValue={this.state.company.marketValue}
                    registerDate={this.state.company.registerDate}
                    onEditValue={this._openModal}
                />
                <CompanyDetail__Contact
                    homePage={Company.getHomePage(this.state.company)}
                    emails={Array.from(this.state.company.emails).slice(0, this.state.company.emails.length)}
                    phones={Array.from(this.state.company.phones).slice(0, this.state.company.phones.length)}
                />
                <CompanyDetail__Location
                    addresses={addresses}
                    currentId={this.state.company.mdmData.id}
                    onMapPress={() => {
                        this.props.navigation.navigate('map', { addresses, title: I18n.t(['map', 'title']) });
                    }}
                />
            </View>
        );
    };

    _renderInsights = () => {
        return (
            <View onLayout={this._getInsightsHeight}>
                {this.state.npses.length > 1 &&
                    <CompanyDetail__Nps
                        currentScore={Number(this.state.npses[0].score)}
                        previousScore={Number(this.state.npses[1].score)}
                        date={new Date(this.state.npses[0].eventDate).toISOString()}
                    />
                }

                <CompanyDetail__OpportunitiesTickets
                    rows={this.state.opportunities}
                    emptyText={I18n.t(['companyDetail', 'opportunities', 'emptyState'])}
                    heading={I18n.t(['companyDetail', 'opportunities', 'heading'])}
                    subHeading={I18n.t(['companyDetail', 'opportunities', 'subHeading'])}
                />
                <CompanyDetail__OpportunitiesTickets
                    rows={this.state.tickets}
                    emptyText={I18n.t(['companyDetail', 'tickets', 'emptyState'])}
                    heading={I18n.t(['companyDetail', 'tickets', 'heading'])}
                    subHeading={I18n.t(['companyDetail', 'tickets', 'subHeading'])}
                />
            </View>
        );
    };

    _renderTabHeader = (props: Object) => {
        return (<Tabs {...props} upcomingIndex={this.state.upcomingIndex} />);
    };

    _renderTabScene = ({ route }) => {
        switch (route.key) {
            case 'overview':
                return this._renderOverview();

            case 'insights':
                return this._renderInsights();

            default:
                return null;
        }
    };

    _renderIntro = () => {
        return (
            <DetailsIntro
                primary={this.state.company.name}
                secondary={this.state.company.industry ? this.state.company.industry.description : null}
                tertiary={Company.isHQ(this.state.company) ? 'HQ' : null}
                quaternary={this.state.company.customer ? I18n.t(['companyDetail', 'customer']) : null}
                onLayout={this._getDetailsIntroBottomY}
            />
        );
    };

    _renderMain = () => {
        if (this.state.company.customer) {
            return (
                <TabViewAnimated
                    initialLayout={{ height: 0, width: windowSize.width }}
                    navigationState={this.state}
                    renderScene={this._renderTabScene}
                    renderHeader={this._renderTabHeader}
                    onRequestChangeTab={this._handleTabChange}
                    onChangePosition={this._handleUpcomingTabChange}
                    onIndexChange={this._handleUpcomingTabChange}
                />
            );
        }

        return this._renderOverview();
    };

    _renderModal = () => {
        if (!this.state.modalFieldType) {
            return null;
        }

        const modalOptions = {
            'numberOfEmployees': {
                title: I18n.t(['companyDetail', 'numberOfEmployeesModal', 'title'], {title: this.state.company.name}),
                options: [
                    ...COMPANY_ATTRIBUTES.numberOfEmployees,
                    I18n.t(['companyDetail', 'numberOfEmployeesModal', 'optionGreater'])
                ]
            },
            'revenue': {
                title: I18n.t(['companyDetail', 'revenueModal', 'title'], {title: this.state.company.name}),
                options: [
                    I18n.t(['companyDetail', 'revenueModal', 'optionLess']),
                    ...COMPANY_ATTRIBUTES.revenue,
                    I18n.t(['companyDetail', 'revenueModal', 'optionGreater'])
                ]
            }
        };

        const modalData = modalOptions[this.state.modalFieldType];

        return (
            <Modal
                visible={this.state.isModalVisible}
                onRequestClose={this._closeModal}
            >
                <Modal__Title title={modalData.title} />

                <Modal__Content>
                    {modalData.options.map((option, index) => {
                        return (
                            <ListItemButton
                                key={index}
                                label={option}
                                hideBorder={index === modalData.options.length - 1}
                                Malign="center"
                                Mcolor="text-darker"
                                Msize={14}
                                SisSelected={option === this.state.modalFieldValue}
                                onPress={() => this.setState({ modalFieldValue: option })}
                            />
                        );
                    })}
                </Modal__Content>

                <Modal__Footer style={u('spacing-pb-small')}>
                    <Button label={I18n.t(['companyDetail', 'submit']).toUpperCase()} onPress={this._submitModalFieldValue} Mcolor={this.state.modalFieldValue ? 'primary' : 'muted'} SisDisabled={this.state.modalFieldValue ? false : true} />
                    <Button label={I18n.t(['companyDetail', 'cancel'])} Mcolor="white" onPress={this._closeModal} />
                </Modal__Footer>
            </Modal>
        );
    };

    componentWillUnmount () {
        if (this._getNpsPromise) {
            this._getNpsPromise.cancel();
        }

        if (this._getOpportunitiesPromise) {
            this._getOpportunitiesPromise.cancel();
        }

        if (this._getTicketsPromise) {
            this._getTicketsPromise.cancel();
        }

        if (this._getRelatedCompaniesPromise) {
            this._getRelatedCompaniesPromise.cancel();
        }

        if (this._searchCustomersPromise) {
            this._searchCustomersPromise.cancel();
        }

        if (this._getIndustryDescriptionPromise) {
            this._getIndustryDescriptionPromise.cancel();
        }

        this._subscribeToToggleFavoriteEvent.remove();
        PersistenceHelper.removeChangeListener(this._onRealmChange);
    }

    componentDidMount () {
        Intercom.logEvent('view-company-detail');

        if (this.props.navigation.state.shouldUpdateCompany) {
            this._updateCompany();
        }

        if (this.state.company.customer) {
            this._getNps();
            this._getOpportunities();
            this._getTickets();
        }

        this._getRelatedCompanies();

        if (!this.state.company.industry) {
            this._getIndustryDescription();
        }

        this._subscribeToToggleFavoriteEvent = this.props.route.config.eventEmitter.addListener('favorite', this._toggleFavorite);
        PersistenceHelper.addChangeListener(this._onRealmChange);

        if (this.state.company.favorite) {
            this.props.route.getEventEmitter().emit('favoriteToggleOn');
        }

        Company.update(this.state.company.mdmData.id, {
            lastViewed: new Date()
        });
    }

    render () {
        return (
            <BackgroundView>
                <BounceBackground />

                <ScrollView
                    ref={(ref) => (this._scrollView = ref)}
                    scrollEventThrottle={16}
                    onScroll={this._handleScroll}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh}
                            tintColor="white"
                            colors={[c('core default')]}
                        />
                    }
                >
                    <View style={{ backgroundColor: '#fff', flex: 1, paddingBottom: 100 }}>
                        {this._renderIntro()}
                        {this._renderMain()}
                    </View>
                </ScrollView>

                {this._renderModal()}
            </BackgroundView>
        );
    }
}

CompanyDetail.propTypes = {
    navigation: PropTypes.any,
    route: PropTypes.shape({

        // company: PropTypes.object,
        // selectInsightsTabInitially: PropTypes.bool,
        // shouldUpdateCompany: PropTypes.bool,

        getEventEmitter: PropTypes.func,
        config: PropTypes.object
    })
};

export default CompanyDetail;
