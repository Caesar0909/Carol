// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, TouchableHighlight, View } from 'react-native';
import I18n from 'react-native-i18n';
import LinearGradient from 'react-native-linear-gradient';

import BackgroundView from '../components/BackgroundView/';
import EmptyState from '../components/EmptyState/';
import { SideBySide, SideBySide__Item } from '../components/SideBySide/';
import SectionHeader from '../components/SectionHeader/';
import Divider from '../components/Divider/';
import UpdatesRow from '../components/UpdatesRow/';
import Collapsible from '../components/overrides/react-native-collapsible/Collapsible';
import Link from '../components/Link/';

import { sortByDateDesc } from '../helpers/utils/array';
import { fromNowUnlessEarlierThan } from '../helpers/utils/date';
import c from '../helpers/color';
import u from '../helpers/utils/utils';
import PersistenceHelper from '../helpers/PersistenceHelper';

import Update, { updateTypeKeys } from '../models/Update';
import Company from '../models/Company';
import Customer from '../models/Customer';

const collapsibleDuration = 300;

class Updates extends Component {
    state: {
        generalIsCollapsed: boolean,
        npsIsCollapsed: boolean,
        opportunitiesIsCollapsed: boolean,
        ticketsIsCollapsed: boolean,
        generalUpdates: Array<Object>,
        npsUpdates: Array<Object>,
        opportunitiesUpdates: Array<Object>,
        ticketsUpdates: Array<Object>
    };

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

    constructor () {
        super();

        this.state = {
            generalIsCollapsed: false,
            npsIsCollapsed: false,
            opportunitiesIsCollapsed: false,
            ticketsIsCollapsed: false,
            generalUpdates: [...Update.getAllForType(updateTypeKeys.company), ...Update.getAllForType(updateTypeKeys.customer)],
            npsUpdates: Update.getAllForType(updateTypeKeys.nps),
            opportunitiesUpdates: Update.getAllForType(updateTypeKeys.opportunity),
            ticketsUpdates: Update.getAllForType(updateTypeKeys.ticket)
        };
    }

    _onRealmChange = () => {
        this.setState({
            generalUpdates: [...Update.getAllForType(updateTypeKeys.company), ...Update.getAllForType(updateTypeKeys.customer)],
            npsUpdates: Update.getAllForType(updateTypeKeys.nps),
            opportunitiesUpdates: Update.getAllForType(updateTypeKeys.opportunity),
            ticketsUpdates: Update.getAllForType(updateTypeKeys.ticket)
        });
    };

    _clearNotifications = (type: string) => {
        const updatesKey = `${type}Updates`;
        const collapsedKey = `${type}IsCollapsed`;

        Update.deleteAllForType(this.state[updatesKey][0].type);

        const isCollapsed = this.state[collapsedKey];

        this.setState({ [collapsedKey]: true }, () => {
            setTimeout(() => {
                this.setState({ [updatesKey]: [] }, () => {
                    !isCollapsed && setTimeout(() => {
                        this.setState({ [collapsedKey]: false });
                    }, collapsibleDuration);
                });
            }, isCollapsed ? 0 : collapsibleDuration);
        });
    };

    _onSelectRow = (update: Object) => {
        Update.update(update, {
            unread: false
        });

        let selectInsightsTabInitially = false;
        let company = Company.getWithId(update.recordId);

        switch (update.type) {
            case updateTypeKeys.customer:
                const customer = Customer.getWithId(update.recordId);

                company = Company.getWithCustomerId(customer.mdmData.id);
                break;

            case updateTypeKeys.opportunity:
            case updateTypeKeys.ticket:
            case updateTypeKeys.nps:
                selectInsightsTabInitially = true;
                break;

            default:
                break;
        }

        this.props.navigation.navigate('companyDetail', { company, selectInsightsTabInitially, shouldUpdateCompany: true });
    };

    _renderUpdates = (updates: Array<Object>) => {
        if (!updates.length) {
            return (
                <View style={{ backgroundColor: '#fff'}}>
                    <EmptyState text={I18n.t(['updates', 'emptyState'])} />
                </View>
            );
        }

        return updates
            .sort((a, b) => sortByDateDesc(a, b, 'createdAt'))
            .map((update) => (
                <TouchableHighlight
                    key={update.id}
                    onPress={() => this._onSelectRow(update)}
                >
                    <View>
                        <UpdatesRow
                            title={update.title}
                            description={update.description}
                            date={fromNowUnlessEarlierThan(update.createdAt, false)}
                            Mhighlighted={update.unread}
                        />
                    </View>
                </TouchableHighlight>
            ));
    };

    _renderCollapsibleSection = (type: string) => {
        const updatesKey = `${type}Updates`;
        const collapsedKey = `${type}IsCollapsed`;

        return (
            <View>
                <SideBySide>
                    <SideBySide__Item Mfluid={true}>
                        <TouchableHighlight underlayColor="#fff" onPress={() => { this.setState({ [collapsedKey]: !this.state[collapsedKey] }); }}>
                            <View >
                                <SectionHeader Mwhite={true} heading={`${I18n.t(['updates', type])}${this.state[updatesKey].length ? ` (${this.state[updatesKey].length})` : ''}`} />
                            </View>
                        </TouchableHighlight>
                    </SideBySide__Item>
                    <SideBySide__Item>
                        <SectionHeader Mwhite={true} style={{ opacity: this.state[updatesKey].length ? 1 : 0 }}>
                            
                            <Link
                                style={{color: c('core clear-link')}}
                                text={I18n.t(['updates', 'clear'])}
                                onPress={() => this._clearNotifications(type)} />
                        </SectionHeader>
                    </SideBySide__Item>
                </SideBySide>

                <Collapsible duration={collapsibleDuration} collapsed={this.state[collapsedKey]}>
                    <Divider style={u('spacing-pb-large')}>
                        {this._renderUpdates(this.state[updatesKey])}
                    </Divider>
                </Collapsible>
            </View>
        );
    };

    componentDidMount () {
        PersistenceHelper.addChangeListener(this._onRealmChange);
    }

    componentWillUnmount () {
        PersistenceHelper.removeChangeListener(this._onRealmChange);
    }

    render () {
        return (
            <BackgroundView
                Mwhite={true}>
                <ScrollView>
                    {this._renderCollapsibleSection('general')}
                    {this._renderCollapsibleSection('nps')}
                    {this._renderCollapsibleSection('opportunities')}
                    {this._renderCollapsibleSection('tickets')}
                </ScrollView>
            </BackgroundView>
        );
    }
}

Updates.propTypes = {
    navigation: PropTypes.any,
    route: PropTypes.any
};

export default Updates;
