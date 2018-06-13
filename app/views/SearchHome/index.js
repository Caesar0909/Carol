// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  StatusBar
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';

import {
    IconButton,
    PageHeader,
    CardView,
    SearchCard,
    Container,
    Icon,
    Spinner
} from '../../components';

import c from '../../helpers/color';
import { ratio, vRatio } from '../../helpers/windowSize';

import {
    showBottomBar,
    fetchDataModels,
    globalSearch,
    searchRecords,
    setGoldenDataModels
} from '../../reduxes/actions';
import {
    dataModelsSelector,
    dataModelsRequestingSelector,
    dataModelsErrorSelector,
    goldenDataModelsRequestingSelector,
    goldenDataModelsErrorSelector,
    recordsTotalSelector,
    recordsRequestingSelector,
    recordsErrorSelector
} from '../../reduxes/selectors';

import styles from './styles';

const recentSearches = [
    {
        count: 30,
        name: 'Mario Lesus Dalpiaz',
        category: 'Company',
        lastUpdatedFrom: '09-01-2017',
        lastUpdatedTo: '08-08-2017'
    },
    {
        count: 20,
        name: 'Mario Lesus',
        category: 'Company',
        lastUpdatedFrom: '09-01-2017',
        lastUpdatedTo: '08-08-2017'
    },
    {
        count: 10,
        name: 'Mario Les',
        category: 'Company',
        lastUpdatedFrom: '09-01-2017',
        lastUpdatedTo: '08-08-2017'
    }
];

const mapStateToProps = state => ({
    dataModels: dataModelsSelector(state),
    dataModelsRequesting: dataModelsRequestingSelector(state),
    dataModelsError: dataModelsErrorSelector(state),
    goldenDataModelsRequesting: goldenDataModelsRequestingSelector(state),
    goldenDataModelsError: goldenDataModelsErrorSelector(state),
    recordsTotal: recordsTotalSelector(state),
    recordsRequesting: recordsRequestingSelector(state),
    recordsError: recordsErrorSelector(state)
});

const mapDispatchToProps = {
    showBottomBar,
    fetchDataModels,
    globalSearch,
    searchRecords,
    setGoldenDataModels
};

class SearchHome extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        dataModels: ImmutablePropTypes.list.isRequired,
        dataModelsRequesting: PropTypes.bool.isRequired,
        dataModelsError: PropTypes.any,
        goldenDataModelsRequesting: PropTypes.bool.isRequired,
        goldenDataModelsError: PropTypes.any,
        recordsTotal: PropTypes.number.isRequired,
        recordsRequesting: PropTypes.bool.isRequired,
        recordsError: PropTypes.any,
        showBottomBar: PropTypes.func.isRequired,
        fetchDataModels: PropTypes.func.isRequired,
        globalSearch: PropTypes.func.isRequired,
        searchRecords: PropTypes.func.isRequired,
        setGoldenDataModels: PropTypes.func.isRequired
    };

    static route = {
        navigationBar: null
    };

    state = {
        searchValue: ''
    };

    componentWillMount () {
        this.props.showBottomBar();
        this.isActive = true;
    }

    componentWillReceiveProps ({
        goldenDataModelsRequesting,
        goldenDataModelsError,
        recordsTotal,
        recordsRequesting,
        recordsError
    }) {
        if (!this.isActive) {
            return;
        }

        if (this.props.goldenDataModelsRequesting && !goldenDataModelsRequesting && !goldenDataModelsError) {
            this.isActive = false;
            this.props.navigation.navigate('searchResults', {
                searchValue: this.state.searchValue
            });
        }

        if (this.props.recordsRequesting && !recordsRequesting && !recordsError) {  // When exploring category
            this.props.setGoldenDataModels([
                {
                    id: this.exploredCategory.get('id'),
                    label: this.exploredCategory.get('label'),
                    docCount: recordsTotal
                }
            ]);
            this.isActive = false;
            this.props.navigation.navigate('searchResults', {
                searchValue: '',
                exploredCategory: this.exploredCategory
            });
        }
    }

    componentDidMount () {
        this.props.fetchDataModels();
    }

    //componentWillUnmount () {
        //this.serverRequest.abort();
    //}
    _handleExploreCategory = (category) => {
        this.exploredCategory = category;
        this.props.searchRecords({
            id: category.get('id'),
            query: ''
        });
    };

    _search = () => {
        this.props.globalSearch({
            query: this.state.searchValue,
            queryParams: { pageSize: 0 }
        });
    };

    _renderHeader = () => {
        return (
            <PageHeader>
                <StatusBar barStyle="default" />
                <IconButton
                    circular={true}
                    color={c('transparent')}
                    fill={c('purple main')}
                    name="Search"
                    size={40 * ratio}
                />
                <View
                    style={styles.headerRight}
                >
                    <TextField
                        label={I18n.t(['searchHome', 'search'])}
                        labelTextStyle={{ fontWeight: 'normal' }}
                        labelPadding={4 * vRatio}
                        value={this.state.searchValue}
                        autoCorrect={false}
                        labelFontSize={10 * vRatio}
                        titleFontSize={16 * vRatio}
                        baseColor={c('newgray text')}
                        tintColor={c('purple border')}
                        textColor={c('newgray text')}
                        fontWeight="bold"
                        autoCapitalize="none"
                        inputContainerStyle={{ borderBottomWidth: 1 * vRatio, paddingBottom: 8 * vRatio }}
                        onChangeText={(searchValue) => this.setState({ searchValue })}
                        onClear={() => this.setState({ searchValue: '' })}
                        returnKeyType="search"
                        onSubmitEditing={this._search}
                    />
                </View>
            </PageHeader>
        );
    };

    _renderContent = () => {
        return (
            <ScrollView
                style={styles.contentWrapper}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.sectionTitle, styles.text, styles.purple]}>
                    {I18n.t(['searchHome', 'exploreCategories'])}
                </Text>
                <View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        { this.props.dataModels.map((category) => (
                            <TouchableOpacity
                                key={category.get('label')}
                                onPress={() => this._handleExploreCategory(category)}
                            >
                                <CardView
                                    Mwidth={80 * ratio}
                                    Mheight={101 * ratio}
                                    Mcontent={this._renderCategoryCard(category)}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                
                {/* <Text style={[styles.sectionTitle, styles.recentSearchLabel, styles.text, styles.newgray]}>
                    {I18n.t(['searchHome', 'recentSearch'])}(8)
                </Text>
                <View style={styles.recentSearchBox}>
                    { recentSearches.map((recentSearch) => (
                        <TouchableOpacity key={`${recentSearch.name}-${recentSearch.category}`}>
                            <CardView
                                Mwidth={windowSize.width - 8 * 2 * ratio}
                                Mcontent={this._renderSearchCard(recentSearch)}
                                MalignCenter={false}
                                style={styles.recentSearchCard}
                            />
                        </TouchableOpacity>
                    ))}
                </View> */}
                
            </ScrollView>
        );
    };

    _renderCategoryCard = (category) => {
        return (
            <Container MalignCenter Msize="default">
                <Icon
                    name={category.get('icon') || 'Person'}
                    width={20 * ratio}
                    height={20 * ratio}
                    fill={c('purple border')}
                />
                <Text style={{
                    marginTop: 8 * ratio,
                    color: c('newgray text'),
                    fontSize: 11 * ratio
                }}>
                    { category.get('label') }
                </Text>
            </Container>
        );
    };

    _renderSearchCard = (recentSearch) => {
        const resultLabel = recentSearch.count === 1 ? I18n.t(['searchHome', 'result'])
            : I18n.t(['searchHome', 'results']);

        return (
            <SearchCard
                tagLabel={`${recentSearch.count} ${resultLabel}`}
                title1={recentSearch.name}
                title2={recentSearch.category}
                description1={I18n.t(['searchHome', 'filters'])}
                description2={I18n.t(['searchHome', 'lastUpdatedDate'])}
                description3={`${recentSearch.lastUpdatedFrom}' '${I18n.t(['searchHome', 'to'])} ${recentSearch.lastUpdatedTo}`}
            />
        );
    };

    render () {
        const {
            dataModelsRequesting,
            goldenDataModelsRequesting,
            recordsRequesting
        } = this.props;

        return (
            <KeyboardAvoidingView
                style={styles.pageWrapper}
                behavior="padding"
            >
                { this._renderHeader() }
                { this._renderContent() }
                { (dataModelsRequesting || goldenDataModelsRequesting || recordsRequesting) &&
                    <Spinner withDimBackground />
                }
            </KeyboardAvoidingView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchHome);
