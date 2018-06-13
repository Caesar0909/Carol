// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListView, RefreshControl, TouchableHighlight, View } from 'react-native';
import I18n from 'react-native-i18n';

import SectionHeader from '../SectionHeader/';
import ListItem from '../ListItem/';
import ListItemDivider from '../ListItemDivider/';
import { SideBySide, SideBySide__Item } from '../SideBySide/';
import Icon from '../Icon/';
import EmptyState from '../EmptyState/';

import Company from '../../models/Company';
import Address from '../../models/Address';

import c from '../../helpers/color';

class CompaniesList extends Component {
    static defaultProps: { headingText: string };

    state: {
        isRefreshing: boolean
    };

    dataSource: ListView.DataSource;

    constructor () {
        super();

        this.state = {
            isRefreshing: false
        };

        this.dataSource = new ListView.DataSource({
            rowHasChanged: this._rowHasChanged
        });
    }

    _rowHasChanged = (oldRow, newRow) => {
        return oldRow.company.mdmData.id !== newRow.company.mdmData.id || oldRow.favorite !== newRow.favorite;
    }

    _onRefresh = () => {
        this.setState({ isRefreshing: true });
        this.props.onRefresh(() => this.setState({ isRefreshing: false }));
    }

    _renderEmptyState = () => {
        if (!this.props.showEmptyState || !this.props.emptyStateText) {
            return null;
        }

        return <EmptyState text={this.props.emptyStateText} />;
    }

    _renderHeading = () => {
        if (!this.props.showHeading) {
            return null;
        }

        return <SectionHeader heading={`${this.props.headingText}`} />;
    }

    _renderFavoriteToggle = (row) => {
        if (!this.props.showFavoriteToggle) {
            return null;
        }

        return (
            <SideBySide__Item MvAlign="center">
                <ListItemDivider Mflex={true}>
                    <Icon
                        fill={row.favorite ? c('yellow star') : 'transparent'}
                        stroke={row.favorite ? c('yellow star') : c('core muted')}
                        strokeWidth={5}
                        name="Star"
                        height={21}
                        width={21}
                    />
                </ListItemDivider>
            </SideBySide__Item>
        );
    }

    _renderRow = (row) => {
        return (
            <TouchableHighlight onPress={() => { this.props.onSelectRow(row); }}>
                <View>
                    <SideBySide>
                        <SideBySide__Item Mfluid={true}>
                            <ListItem
                                primary={row.company.name}
                                secondary={Address.getShortAddress(row.company.addresses[0])}
                                prefix1={Company.isHQ(row.company) ? 'HQ' : null}
                                prefix2={row.company.customer ? I18n.t(['companiesList', 'customer']) : null }
                                suffix={null}
                            />
                        </SideBySide__Item>

                        {this._renderFavoriteToggle(row)}
                    </SideBySide>
                </View>
            </TouchableHighlight>
        );
    }

    _renderRefreshControl = (canRefresh: boolean) => {
        if (canRefresh) {
            return (
                <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this._onRefresh}
                    tintColor={c('blue gumbo')}
                    colors={[c('blue boston')]}
                />
            );
        }

        return null;
    }

    render () {
        return (
            <View style={{ flex: 1 }}>
                {this._renderHeading()}
                {this._renderEmptyState()}
                <ListView
                    enableEmptySections={true}
                    dataSource={this.dataSource.cloneWithRows(this.props.rows)}
                    renderRow={this._renderRow}
                    renderFooter={this.props.renderFooter}
                    initialListSize={10}
                    pageSize={10}
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="on-drag"
                    refreshControl={this._renderRefreshControl(this.props.canRefresh)}
                    onEndReached={this.props.onEndReached}
                    onEndReachedThreshold={1500}
                />
            </View>
        );
    }
}

CompaniesList.defaultProps = {
    headingText: ''
};

CompaniesList.propTypes = {
    canRefresh: PropTypes.bool,
    emptyStateText: PropTypes.string,
    headingText: PropTypes.string.isRequired,
    rows: PropTypes.arrayOf(PropTypes.shape({
        company: PropTypes.object,
        favorite: PropTypes.bool
    })).isRequired,
    onRefresh: PropTypes.func,
    onSelectRow: PropTypes.func.isRequired,
    onEndReached: PropTypes.func,
    renderFooter: PropTypes.func,
    showEmptyState: PropTypes.bool,
    showFavoriteToggle: PropTypes.bool,
    showHeading: PropTypes.bool
};

export default CompaniesList;
