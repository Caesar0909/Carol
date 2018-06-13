// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListView, RefreshControl, TouchableHighlight, View, Image } from 'react-native';

import ListItemDivider from '../ListItemDivider/';
import { SideBySide, SideBySide__Item } from '../SideBySide/';
import Icon from '../Icon/';
import T from '../T/';
import EmptyState from '../EmptyState/';

import Images from '../../assets/icons/images/';

import c from '../../helpers/color';
import u from '../../helpers/utils/utils';

class StatList extends Component {
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

    _onRefresh = () => {
        this.setState({ isRefreshing: true });
        this.props.onRefresh(() => this.setState({ isRefreshing: false }));
    }

    _rowHasChanged = (oldRow, newRow) => {
        return oldRow.company.mdmData.id !== newRow.company.mdmData.id || oldRow.favorite !== newRow.favorite;
    }


    _renderEmptyState = () => {
        if (!this.props.showEmptyState || !this.props.emptyStateText) {
            return null;
        }

        return <EmptyState text={this.props.emptyStateText} />;
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

    _renderRow = (row) => {
        return (
            <TouchableHighlight onPress={() => { this.props.onSelectRow(row); }}>
                <View>
                    <SideBySide>
                        <SideBySide__Item Mfluid={true}>
                            <ListItemDivider>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <View style={u('spacing-mr-default')}><Icon name={row.trend === 'UP' ? 'UpArrow' : 'DownArrow'} fill={row.trend === 'UP' ? c('green arrow') : c('red red--back')} height={25} width={25} /></View>
                                        <View>
                                            <T style={{fontSize: 17, fontWeight: 'bold'}}>{row.label}</T>
                                            <View style={{flexDirection: 'row'}}>
                                                <T>Total</T>
                                                <T style={[{color: c('red red--back')}, u('spacing-ml-small')]}>{row.totalNumberOfRecords ? row.totalNumberOfRecords.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').replace('.00', '') : '0'}</T>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <View style={[u('spacing-mr-default')]}><Image source={row.trend === 'UP' ? Images.GRAPHGREEN : Images.GRAPHGRED} style={{width: 60, height: 20}}/></View>
                                        <View style={[u('spacing-ml-default')]}><T style={{color: row.trend === 'UP' ? c('green arrow') : c('red red--back'), fontSize: 20, fontWeight: 'bold'}}>{row.rightVal ? row.rightVal.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').replace('.00', '') : '0'}</T></View>
                                    </View>
                                </View>
                            </ListItemDivider>
                        </SideBySide__Item>

                    </SideBySide>
                </View>
            </TouchableHighlight>
        );
    }

    render () {
        return (
            <View style={{ flex: 1, backgroundColor: '#ededed' }}>
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

StatList.defaultProps = {
    headingText: ''
};

StatList.propTypes = {
    canRefresh: PropTypes.bool,
    emptyStateText: PropTypes.string,
    headingText: PropTypes.string.isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    onRefresh: PropTypes.func,
    onSelectRow: PropTypes.func.isRequired,
    onEndReached: PropTypes.func,
    renderFooter: PropTypes.func,
    showEmptyState: PropTypes.bool,
    showFavoriteToggle: PropTypes.bool,
    showHeading: PropTypes.bool
};

export default StatList;
