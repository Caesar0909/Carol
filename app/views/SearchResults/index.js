// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map } from 'immutable';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  StatusBar
} from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';

import {
    IconButton,
    PageHeader,
    CardView,
    T,
    RoundOption,
    FilterOption,
    Spinner
} from '../../components';

import QueryFactory from '../../helpers/QueryFactory';
import c from '../../helpers/color';
import { ratio } from '../../helpers/windowSize';
import { parseLocation } from '../../helpers/LocationHelper';

import {
    showBottomBar,
    searchRecords
} from '../../reduxes/actions';
import {
    goldenDataModelsSelector,
    goldenDataModelsRequestingSelector,
    goldenDataModelsErrorSelector,
    recordsSelector,
    recordsTotalSelector,
    recordsRequestingSelector,
    recordsErrorSelector
} from '../../reduxes/selectors';

import styles from './styles';

const allCategory = Map({
    id: 'All',
    name: 'All',
    label: 'All'
});
const filterCategory = Map({
    id: 'Filter',
    name: 'Filter',
    label: 'Filter'
});

const getDataModelId = (dataModel) => dataModel.get('id');
const getTotalCount = (goldenDataModels) => {
    return goldenDataModels.reduce((prev, cur) => {
        return prev + cur.get('docCount');
    }, 0);
};

const mapStateToProps = state => ({
    goldenDataModels: goldenDataModelsSelector(state),
    goldenDataModelsRequesting: goldenDataModelsRequestingSelector(state),
    goldenDataModelsError: goldenDataModelsErrorSelector(state),
    records: recordsSelector(state),
    recordsTotal: recordsTotalSelector(state),
    recordsRequesting: recordsRequestingSelector(state),
    recordsError: recordsErrorSelector(state)
});

const mapDispatchToProps = {
    showBottomBar,
    searchRecords
};

class SearchResults extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        goldenDataModels: ImmutablePropTypes.list.isRequired,
        records: ImmutablePropTypes.list.isRequired,
        recordsTotal: PropTypes.number.isRequired,
        recordsRequesting: PropTypes.bool.isRequired,
        recordsError: PropTypes.any,
        showBottomBar: PropTypes.func.isRequired,
        searchRecords: PropTypes.func.isRequired
    };

    static route = {
        navigationBar: null
    };

    constructor (props) {
        super(props);

        const { exploredCategory } = this.props.navigation.state.params;

        this.state = {
            categoryFilter: exploredCategory ? exploredCategory : allCategory,
            specificFilter: null
        };
    }

    componentWillMount () {
        this.props.showBottomBar();
    }

    _handlePressFilter = (categoryFilter, wasActive) => {
        switch (getDataModelId(categoryFilter)) {
            case 'All':
                this.setState({
                    categoryFilter: allCategory,
                    specificFilter: null
                });
                break;
            case 'Filter':
                if (this.state.specificFilter) {
                    this.setState({
                        specificFilter: null
                    });
                }
                else {
                    this.props.navigation.navigate('searchFilter', {
                        category: this.state.categoryFilter,
                        onGoBack: this._saveFilterAndResult
                    });
                }
                break;
            default:
                if (getDataModelId(this.state.categoryFilter) === getDataModelId(categoryFilter)) {
                    this.setState({
                        categoryFilter: allCategory,
                        specificFilter: null
                    });
                }
                else {
                    this.props.searchRecords({
                        id: getDataModelId(categoryFilter) !== 'All' && getDataModelId(categoryFilter),
                        query: this.props.navigation.state.params.searchValue
                    });
                    this.setState({
                        categoryFilter,
                        specificFilter: null
                    });
                }
        }
    }

    _goTo360 = (record) => {
        let pageName;

        if (this.state.categoryFilter.get('label') === 'Company') {
            pageName = 'company360';
        }

        this.props.navigation.navigate(pageName, {
            record,
            category: this.state.categoryFilter
        });
    }

    _saveFilterAndResult = (filter, result) => {
        const { categoryFilter } = this.state;
        const params = [
            {
                fieldName: 'created',
                source: 'meta',
                value: [filter.registeredDateFrom, filter.registeredDateTo]
            }
        ];
        console.log('/////', params);

        this.props.searchRecords({
            id: getDataModelId(categoryFilter) !== 'All' && getDataModelId(categoryFilter),
            query: this.props.navigation.state.params.searchValue,
            body: QueryFactory.buildFilter(params)
        });
        this.setState({
            specificFilter: filter
        });
    }

    _renderHeader = () => {
        const { searchValue } = this.props.navigation.state.params;

        return (
            <PageHeader Msmall>
                <StatusBar barStyle="default" />
                <IconButton
                    circular={true}
                    color={c('transparent')}
                    fill={c('purple main')}
                    name="Search"
                    size={28 * ratio}
                />
                <View
                    style={styles.headerRight}
                >
                    <T Mbold>
                        { searchValue }
                    </T>
                </View>
            </PageHeader>
        );
    }

    _renderContent = () => {
        const {
            goldenDataModels,
            records,
            recordsRequesting,
            recordsError
        } = this.props;
        const count = getTotalCount(goldenDataModels);

        return (
            <ScrollView
                style={styles.contentWrapper}
                showsVerticalScrollIndicator={false}
            >
                <T Mcolor="purple" style={styles.sectionTitle}>
                    { count }{' '}
                    { I18n.t(['searchResults', count === 1 ? 'result' : 'results'])}{' '}
                    { I18n.t(['searchResults', 'found']) }
                    :
                </T>
                { this._renderFilters() }
                { getDataModelId(this.state.categoryFilter) !== 'All' && !recordsRequesting && !recordsError &&
                    <View style={styles.searchList}>
                        { records.toJS().map((record) => (
                            <TouchableOpacity
                                key={record.mdmData.id}
                                style={{ marginBottom: 16 * ratio }}
                                onPress={() => this._goTo360(record)}
                            >
                                <CardView
                                    MalignCenter={false}
                                    Mcontent={this._renderSearchCard(record)}
                                    hasMarginRight={false}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                }
            </ScrollView>
        );
    }

    _renderFilters = () => {
        const {
            goldenDataModels,
            recordsTotal
        } = this.props;
        const {
            categoryFilter,
            specificFilter
        } = this.state;

        if (getDataModelId(categoryFilter) === 'All') {  // All category
            const categories = [
                Map({
                    id: 'All',
                    label: 'All',
                    docCount: getTotalCount(goldenDataModels)
                }),
                ...goldenDataModels
            ];

            return (
                <View style={styles.filterOptions}>
                    { categories.map(dataModel => (
                        <RoundOption
                            key={getDataModelId(dataModel)}
                            value={dataModel}
                            label={dataModel.get('label')}
                            number={dataModel.get('docCount')}
                            isActive={getDataModelId(dataModel) === getDataModelId(categoryFilter)}
                            style={{ marginRight: 9 * ratio }}
                            onPress={this._handlePressFilter}
                        />
                    ))}
                </View>
            );
        }

        const activeFilter = goldenDataModels.find(filter => getDataModelId(filter) === getDataModelId(categoryFilter));

        return activeFilter && (
            <View style={styles.filterOptions}>
                <RoundOption
                    label={activeFilter.get('label')}
                    value={activeFilter}
                    number={activeFilter.get('docCount')}
                    isActive
                    style={{ marginRight: 9 * ratio }}
                    onPress={this._handlePressFilter}
                />
                { categoryFilter.get('label') === 'Customer' &&
                    <FilterOption
                        value={filterCategory}
                        number={specificFilter && recordsTotal}
                        isActive={!!specificFilter}
                        onPress={this._handlePressFilter}
                    />
                }
            </View>
        );
    }

    _renderSearchCard = (record) => {
        return (
            <View>
                <View style={styles.nameRow}>
                    <Text style={styles.name}>
                        {record.name}
                    </Text>
                    { record.watching &&
                        <View style={styles.watchListTag}>
                            <Text style={styles.watchListText}>
                                { I18n.t(['searchResults', 'watchList']) }
                            </Text>
                        </View>
                    }
                </View>
                <View style={styles.divider} />
                <View>
                    <Text style={styles.type}>
                        {record.industryCode}
                    </Text>
                    <Text style={styles.location}>
                        {parseLocation(record.addresses)}
                    </Text>
                </View>
            </View>
        );
    }

    render () {
        const { recordsRequesting } = this.props;

        return (
            <View style={styles.pageWrapper}>
                { this._renderHeader() }
                { recordsRequesting ? <Spinner withDimBackground /> : this._renderContent() }
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
