// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View } from 'react-native';
//import { NavigationStyles } from '@expo/ex-navigation';
import { isEqual } from 'lodash';
import I18n from 'react-native-i18n';

import NavigationAction from '../components/NavigationAction/';
import Button from '../components/Button/';
import T from '../components/T/';
import Fieldset from '../components/Fieldset/';
import { CheckboxList, CheckboxList__Item } from '../components/CheckboxList/';
import Checkbox from '../components/Checkbox/';
import { PillList, PillList__Item } from '../components/PillList/';
import Pill from '../components/Pill/';
import Link from '../components/Link/';
import Divider from '../components/Divider/';

import { filterName } from '../helpers/FilterHelper';
import { Filter } from '../helpers/FilterHelper';

import u from '../helpers/utils/utils';
import c from '../helpers/color';

class SearchFilter extends Component {
    static route = {
        navigationBar: {
            backgroundColor: c('gray silver-chalice--darker'),
            title: (params) => params.title,
            renderRight: (props) => (
                <NavigationAction {...props} eventName="clearFilters" canBeDisabled={true}>
                    {
                        <T style={[u('font-size-16'), { color: '#fff' }]}>{props.params.clearAll}</T>
                    }
                </NavigationAction>
            )
        },
        styles: {
            //...NavigationStyles.SlideVertical,
            gestures: null
        }
    };

    state: {
        activeFilters: Array<Filter>
    };

    _companies: Array<Object>;

    _subscribeToClearFiltersEvent: Function;

    constructor (props: Object) {
        super(props);

        this.state = {
            activeFilters: props.route.params.previousFilters
        };
        this._companies = props.route.params.companies;
    }

    _toggleFilter = (name: string, value: any) => {
        let existingFilter = this.state.activeFilters.find((filter) => filter.name === name && isEqual(filter.value, value));
        let activeFilters = this.state.activeFilters;

        if (existingFilter) {
            activeFilters.splice(activeFilters.indexOf(existingFilter), 1);
        }
        else {
            activeFilters = [...activeFilters, { name, value }];
        }

        this.setState({ activeFilters }, () => {
            this.props.route.getEventEmitter().emit(`clearFilters${activeFilters.length ? 'Enable' : 'Disable'}`);
        });
    };

    _replaceFilters = (name: string, values: Array<string>) => {
        let activeFilters = this.state.activeFilters;

        activeFilters = activeFilters.filter((filter) => filter.name !== name);

        values.forEach((value) => {
            activeFilters = [...activeFilters, { name, value }];
        });

        this.setState({ activeFilters }, () => {
            this.props.route.getEventEmitter().emit(`clearFilters${activeFilters.length ? 'Enable' : 'Disable'}`);
        });
    };

    _clearFilters = () => {
        this.setState({ activeFilters: [] });
    };

    _goToSearchResults = (activeFilters: Filter[]) => {
        this.props.route.params.getFilters(activeFilters);
        this.props.navigation.back();
    };

    _goToSearchSegments = () => {
        this.props.navigation.navigate('searchFilterValues',
            {
                title: I18n.t(['searchFilterValues', 'title']),
                clearAll: I18n.t(['searchFilterValues', 'clearAll']),
                filterNameSingular: I18n.t(['searchFilter', 'segment']),
                filterNamePlural: I18n.t(['searchFilter', 'segments']),
                values: this._getSegmentsOptions().map((option) => option.label),
                selectedValues: this.state.activeFilters.filter((filter) => filter.name === filterName.mainActivity).map((filter) => filter.value),
                getSelectedValues: (values) => this._replaceFilters(filterName.mainActivity, values)
            }
        );
    };

    _goToSearchCities = () => {
        const citiesOptions = this._getCitiesOptions();

        this.props.navigation.navigate('searchFilterValues',
            {
                title: I18n.t(['searchFilterValues', 'title']),
                clearAll: I18n.t(['searchFilterValues', 'clearAll']),
                filterNameSingular: I18n.t(['searchFilter', 'city']),
                filterNamePlural: I18n.t(['searchFilter', 'cities']),
                values: citiesOptions.map((option) => option.label),
                selectedValues: (
                    this.state.activeFilters
                        .filter((filter) => filter.name === filterName.address)
                        .map((filter) => (
                            (citiesOptions.find((option) => isEqual(option.value, filter.value)): any).label
                        ))
                ),
                getSelectedValues: (values) => (
                    this._replaceFilters(
                        filterName.address,
                        values.map((value) => (
                            (citiesOptions.find((option) => isEqual(option.label, value)): any).value
                        ))
                    )
                )
            }
        );
    };

    _getSegmentsOptions = () => {
        return this._companies.reduce((options, company) => {
            if (company.mainActivity &&
                company.mainActivity.description !== '********' &&
                company.mainActivity.description !== '') {
                const option = {
                    label: company.mainActivity.description,
                    value: company.mainActivity.description
                };
                const containsOption = options.some((previousOption) => previousOption.label === option.label);

                if (!containsOption) {
                    return [...options, option];
                }
            }

            return options;
        }, []);
    }

    _getRevenueOptions = () => {
        return this._companies.reduce((options, company) => {
            if (company.revenue &&
                company.revenue !== '') {
                const option = {
                    label: company.revenue,
                    value: company.revenue
                };
                const containsOption = options.some((previousOption) => previousOption.label === option.label);

                if (!containsOption) {
                    return [...options, option];
                }
            }

            return options;
        }, []);
    };

    _getNumberOfEmployeesOptions = () => {
        return this._companies.reduce((options, company) => {
            if (company.numberOfEmployees &&
                company.numberOfEmployees !== '') {
                const option = {
                    label: company.numberOfEmployees,
                    value: company.numberOfEmployees
                };
                const containsOption = options.some((previousOption) => previousOption.label === option.label);

                if (!containsOption) {
                    return [...options, option];
                }
            }

            return options;
        }, []);
    }

    _getCitiesOptions = () => {
        return this._companies.reduce((options, company) => {
            const address = company.addresses[0];

            if (address && address.city && address.state) {
                const option = {
                    label: `${address.city}, ${address.state}`,
                    value: { city: address.city, state: address.state }
                };
                const containsOption = options.some((previousOption) => previousOption.label === option.label);

                if (!containsOption) {
                    return [...options, option];
                }
            }

            return options;
        }, []);
    }

    _renderComponentList = (ToggleComponent: any, name: string, options: Array<Object>) => {
        if (options.length === 0) {
            return <T>Nothing to filter</T>;
        }

        const ComponentList = ToggleComponent === Pill ? PillList : CheckboxList;
        const ComponentList__Item = ToggleComponent === Pill ? PillList__Item : CheckboxList__Item;
        const renderComponent = (option, index) => (
            <ComponentList__Item key={index}>
                <ToggleComponent
                    label={option.label}
                    SisSelected={this.state.activeFilters.some((filter) => filter.name === name && isEqual(filter.value, option.value))}
                    onPress={() => { this._toggleFilter(name, option.value); }}
                />
            </ComponentList__Item>
        );

        return (
            <ComponentList>
                {
                    [
                        ...options.filter((option, index) => ToggleComponent === Checkbox ? index < 3 : true),
                        ...options.filter((option, index) => this.state.activeFilters.some((filter) => index >= 3 && filter.name === name && isEqual(filter.value, option.value)))
                    ]
                        .map((option, index) => renderComponent(option, index))
                }
            </ComponentList>
        );
    }

    componentDidMount () {
        this._subscribeToClearFiltersEvent = this.props.route.config.eventEmitter.addListener('clearFilters', this._clearFilters);
        this.props.route.getEventEmitter().emit(`clearFilters${this.state.activeFilters.length ? 'Enable' : 'Disable'}`);
    }

    componentWillUnmount () {
        this._subscribeToClearFiltersEvent.remove();
    }

    render () {
        const typesOptions = [
            {
                label: I18n.t(['searchFilter', 'customer']),
                value: 'customer'
            },
            {
                label: 'HQ',
                value: 'hq'
            }
        ];

        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <Fieldset legend={I18n.t(['searchFilter', 'type'])}>
                        {this._renderComponentList(Checkbox, filterName.companyFlag, typesOptions)}
                    </Fieldset>

                    <Fieldset legend={I18n.t(['searchFilter', 'segments'])}>
                        {this._renderComponentList(Checkbox, filterName.mainActivity, this._getSegmentsOptions())}
                        <Link
                            Mmorelink={true}
                            text={I18n.t(['searchFilter', 'selectMore'], {keyName: I18n.t(['searchFilter', 'moresegments'])})}
                            onPress={this._goToSearchSegments} />
                    </Fieldset>

                    <Fieldset legend={I18n.t(['searchFilter', 'revenue'])}>
                        {this._renderComponentList(Pill, filterName.revenue, this._getRevenueOptions())}
                    </Fieldset>

                    <Fieldset legend={I18n.t(['searchFilter', 'numberOfEmployees'])}>
                        {this._renderComponentList(Pill, filterName.numberOfEmployees, this._getNumberOfEmployeesOptions())}
                    </Fieldset>

                    <Fieldset legend={I18n.t(['searchFilter', 'cities'])} Mbottom={false}>
                        {this._renderComponentList(Checkbox, filterName.address, this._getCitiesOptions())}
                        <Link
                            Mmorelink={true}
                            text={I18n.t(['searchFilter', 'selectMore'], {keyName: I18n.t(['searchFilter', 'morecities'])})}
                            onPress={this._goToSearchCities} />
                    </Fieldset>
                </ScrollView>

                <Divider Mbottom={false} Mtop={true} style={u(['spacing-ph-xx-large', 'spacing-pv-x-large'])}>
                    <Button
                        label={I18n.t(['searchFilter', 'applyFilters']).toUpperCase()}
                        onPress={() => { this._goToSearchResults(this.state.activeFilters); }}
                    />
                </Divider>
            </View>
        );
    }

}

SearchFilter.propTypes = {
    navigation: PropTypes.any,
    route: PropTypes.shape({
        config: PropTypes.any,
        getEventEmitter: PropTypes.func,
        params: PropTypes.shape({
            companies: PropTypes.array.isRequired,
            previousFilters: PropTypes.array.isRequired,
            getFilters: PropTypes.func
        })
    })
};

export default SearchFilter;
