// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, View } from 'react-native';
//import { NavigationStyles } from '@expo/ex-navigation';
import { debounce } from 'lodash';
import Intercom from 'react-native-intercom';
import I18n from 'react-native-i18n';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import LinearGradient from 'react-native-linear-gradient';

import BackgroundView from '../components/BackgroundView/';
import SearchBox from '../components/SearchBox/';
import Spinner from '../components/Spinner/';
import CompaniesList from '../components/CompaniesList/';
import FloatingButton from '../components/FloatingButton';

import PersistenceHelper from '../helpers/PersistenceHelper';
import type { CancelablePromise } from '../helpers/makeCancelable';
import { toFormattedNumber } from '../helpers/utils/number';
import FilterHelper from '../helpers/FilterHelper';
import type { Filter } from '../helpers/FilterHelper';

import CompanyService from '../services/CompanyService';
import CustomerService from '../services/CustomerService';

import Company from '../models/Company';
import FluigData from '../models/FluigData';

import u from '../helpers/utils/utils';
import c from '../helpers/color';

const initialSearchState = {
    searchValue: '',
    activeFilters: [],
    searchResultCompanies: [],
    totalHits: 0,
    hasSearched: false,
    isSearching: false,
    searchTime: 0
};

const defaultPageSize = 100;

class SearchResults extends Component {
    static route = {
        navigationBar: {
            renderTitle: (props) => (
                <SearchBox
                    {...props}
                    Msearchbox={true}
                    Mnavigation={true}
                    autoFocus={true}
                    placeholder={I18n.t(['searchResults', 'searchBoxPlaceholder'])}
                />
            ),
            renderBackground: () => (
                <LinearGradient
                    colors={[c('green light-background'), c('green dark-background')]}
                    start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 1.0}}
                    style={[{ flex: 2, justifyContent: 'center'}]}
                >
                </LinearGradient>
            )
        },
        styles: {
            //...NavigationStyles.SlideVertical,
            gestures: null
        }
    };

    state: {
        searchValue: string,
        activeFilters: Array<Filter>,
        searchResultCompanies: Array<Object>,
        recentlyViewedCompanies: Array<Object>,
        favoriteCompanies: Array<Object>,
        totalHits: number,
        hasSearched: boolean,
        isSearching: boolean,
        numberOfCompanies: number
    };

    _subscribeToSearchEvent: Function;
    _searchCompaniesPromise: CancelablePromise;
    _searchCustomersPromise: CancelablePromise;

    constructor () {
        super();

        this.state = {
            ...initialSearchState,
            recentlyViewedCompanies: this._getSortedRecentlyViewedCompanies(),
            favoriteCompanies: this._getFavoriteCompanies(),
            numberOfCompanies: FluigData.getNumberOfCompanies()
        };

        (this: any)._onSearch = debounce(this._onSearch.bind(this), 400);
    }

    _getSortedRecentlyViewedCompanies = () => {
        return Company.getAll()
            .filter((company) => company.lastViewed)
            .sort((leftCompany, rightCompany) => rightCompany.lastViewed - leftCompany.lastViewed);
    };

    _getFavoriteCompanies = () => {
        return Company.getAll().filter((company) => company.favorite);
    };

    _onRealmChange = () => {
        this.setState({
            recentlyViewedCompanies: this._getSortedRecentlyViewedCompanies(),
            favoriteCompanies: this._getFavoriteCompanies(),
            numberOfCompanies: FluigData.getNumberOfCompanies()
        });
    };

    _goToFilter = () => {
        this.props.navigation.navigate('searchFilter',
            {
                title: I18n.t(['searchFilter', 'title']),
                clearAll: I18n.t(['searchFilter', 'clearAll']),
                companies: this.state.searchResultCompanies,
                previousFilters: this.state.activeFilters,
                getFilters: (activeFilters) => this.setState({ activeFilters })
            }
        );
    };

    _onSelectRow = (row) => {
        Keyboard.dismiss();

        const company = Company.getWithId(row.company.mdmData.id);

        if (!company) {
            row.company.favorite = false;
            Company.create(row.company);
        }
        else {
            Company.update(row.company.mdmData.id, Company.createObjectFromRealmObject(row.company));
        }

        this.props.navigation.navigate('companyDetail', { company: Company.getWithId(row.company.mdmData.id), shouldUpdateCompany: !this.state.hasSearched });
    };

    _doSearch = (text: string, pageSize: number, offset: number, finished: Function) => {
        this._searchCompaniesPromise = CompanyService.search(
            text,
            pageSize,
            offset,
            (companies, totalHits) => {
                this._searchCustomersPromise = CustomerService.getAllWithTaxIds(
                    companies.map((company) => company.taxId),
                    (customers) => {
                        companies = companies.map((company) => (
                            {
                                ...company,
                                customer: customers.find((customer) => { return customer.taxId === company.taxId; })
                            }
                        ));
                        let st = new Date().getTime() - this.state.searchTime;

                        this.setState({
                            searchTime: st
                        });
                        let favoriteCompanies = this.state.favoriteCompanies;

                        companies = companies.map((company) => {
                            const localCompany = favoriteCompanies.find((favoriteCompany) => favoriteCompany.taxId === company.taxId);
                            
                            company.favorite = localCompany && localCompany.favorite ? true : false;
                            
                            return company;
                        });
                        finished(companies, totalHits);
                    }
                );
            }
        );
    };

    _doInitialSearch = (text: string) => {
        this.setState({ isSearching: true });
        let time = new Date().getTime();

        this.setState({
            searchTime: time
        });
        this._doSearch(text, defaultPageSize, 0, (companies, totalHits) => (
            this.setState({
                searchResultCompanies: companies,
                totalHits,
                isSearching: false,
                hasSearched: true
            })
        ));
    };

    _doIncrementalSearch = () => {
        const totalHits = this.state.totalHits;
        const currentHits = this.state.searchResultCompanies.length;

        if (currentHits >= totalHits) {
            return;
        }

        if (this.state.activeFilters.length === 0) {
            this._doSearch(this.state.searchValue, defaultPageSize, currentHits, (companies) => (
                this.setState({ searchResultCompanies: [...this.state.searchResultCompanies, ...companies] })
            ));
        }
        else {
            this._doSearch(this.state.searchValue, totalHits - currentHits, currentHits, (companies) => (
                this.setState({ searchResultCompanies: [...this.state.searchResultCompanies, ...companies] })
            ));
        }
    }

    _onSearch = (searchValue: string) => {
        if (this._searchCompaniesPromise) {
            this._searchCompaniesPromise.cancel();
        }

        if (this._searchCustomersPromise) {
            this._searchCustomersPromise.cancel();
        }

        if (searchValue.length === 0) {
            this.setState(initialSearchState);

            return;
        }

        this.setState({
            searchValue,
            activeFilters: []
        });

        this._doInitialSearch(searchValue);
    }

    _renderSpinner = () => {
        return (
            <View style={{ alignItems: 'center' }}>
                <Spinner style={u('spacing-mt-x-large')} />
            </View>
        );
    }

    _getHeadingText = () => {
        if (this.state.hasSearched) {
            return I18n.t(
                ['searchResults', 'results.counting'],
                {
                    count: toFormattedNumber(this.state.activeFilters.length > 0 ? FilterHelper.applyFiltersToCompanies(this.state.activeFilters, this.state.searchResultCompanies).length : this.state.totalHits),
                    time: toFormattedNumber(this.state.searchTime / 1000, 3)
                }
            );
        }

        return I18n.t(['searchResults', 'recentlyViewedCompanies']);
    }

    _getRows = (companies: Array<Object>, favoriteCompanies: Array<Object>) => {
        return companies.map((company) => {
            const localCompany = favoriteCompanies.find((favoriteCompany) => favoriteCompany.taxId === company.taxId);

            return {
                company,
                favorite: localCompany && localCompany.favorite ? true : false
            };
        });
    }

    _renderCompaniesList = () => {
        return (
            <CompaniesList
                emptyStateText={I18n.t(['searchResults', 'emptyState'], { numberOfCompanies: toFormattedNumber(this.state.numberOfCompanies) })}
                headingText={this._getHeadingText()}
                rows={
                    [{ company: 'company', favorite: 'favorite 1'},
                    { company: 'company2', favorite: 'favorite 2'},
                    { company: 'company3', favorite: 'favorite 3'}]
                }
                onSelectRow={this._onSelectRow}
                showFavoriteToggle={true}
                canRefresh={false}
                onEndReached={this._doIncrementalSearch}
                showEmptyState={!this.state.hasSearched && this.state.recentlyViewedCompanies.length === 0}
                showHeading={this.state.hasSearched || this.state.recentlyViewedCompanies.length > 0}
                renderFooter={this.state.searchResultCompanies.length < this.state.totalHits ? this._renderSpinner : null}
            />
        );
    }

    componentDidMount () {
        this._subscribeToSearchEvent = this.props.route.config.eventEmitter.addListener('is-searching', this._onSearch);
        PersistenceHelper.addChangeListener(this._onRealmChange);
    }

    componentWillUnmount () {
        Intercom.logEvent('search-results-will-disappear');

        if (this._searchCompaniesPromise) {
            this._searchCompaniesPromise.cancel();
        }

        this._subscribeToSearchEvent.remove();
        PersistenceHelper.removeChangeListener(this._onRealmChange);
    }

    render () {
        return (
            <BackgroundView>
                {this.state.isSearching ? this._renderSpinner() : this._renderCompaniesList()}
                <View>
                    <View>
                        {this.state.hasSearched && !this.state.isSearching && (
                            <FloatingButton
                                icon="Sliders"
                                label={I18n.t(['searchResults', 'filter']).toUpperCase()}
                                onPress={this._goToFilter}
                            />
                        )}
                    </View>

                    <KeyboardSpacer />
                </View>
            </BackgroundView>
        );
    }
}

SearchResults.propTypes = {
    navigation: PropTypes.any,
    route: PropTypes.any
};

export default SearchResults;
