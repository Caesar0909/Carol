// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View } from 'react-native';
//import { NavigationStyles } from '@expo/ex-navigation';
import I18n from 'react-native-i18n';

import NavigationAction from '../components/NavigationAction/';
import Button from '../components/Button/';
import T from '../components/T/';
import Container from '../components/Container/';
import SearchBox from '../components/SearchBox/';
import Divider from '../components/Divider/';
import { CheckboxList, CheckboxList__Item } from '../components/CheckboxList/';
import Checkbox from '../components/Checkbox/';

import u from '../helpers/utils/utils';
import c from '../helpers/color';

class SearchFilterValues extends Component {
    static route = {
        navigationBar: {
            backgroundColor: c('gray silver-chalice--darker'),
            title: (params) => params.title,
            renderRight: (props) => (
                <NavigationAction {...props} eventName="clearValues" canBeDisabled={true}>
                    {
                        <T style={[u('font-size-16'), { color: '#fff' }]}>{props.params.clearAll}</T>
                    }
                </NavigationAction>
            )
        },
        styles: {
            //...NavigationStyles.SlideHorizontal,
            gestures: null
        }
    };

    state: {
        options: Array<Object>
    };

    _values: Array<string>;

    _subscribeToSearchEvent: Function;
    _subscribeToClearValuesEvent: Function;

    constructor (props: Object) {
        super(props);

        this.state = {
            options: props.route.params.values.map((value) => (
                {
                    label: value,
                    selected: props.route.params.selectedValues.some((selectedValue) => selectedValue === value),
                    hidden: false
                }
            ))
        };

        this._values = props.route.params.values;
    }

    _onSearch = (searchValue: string) => {
        this.setState({ options: this.state.options.map((option) => (
            {
                ...option,
                hidden: searchValue === '' ? false : !option.label.toLowerCase().includes(searchValue)
            }
        )) });
    }

    _clearValues = () => {
        this.setState({
            options: this.state.options.map((option) => (
                {
                    ...option,
                    selected: false
                }
            ))
        });
    }

    _toggleValue = (value: string) => {
        let options = this.state.options;

        options.forEach((option) => {
            if (option.label === value) {
                option.selected = !option.selected;
            }
        });

        this.setState({ options });
    };

    _goToSearchFilter = () => {
        this.props.route.params.getSelectedValues(this.state.options.reduce((values, option) => {
            if (option.selected) {
                values = [...values, option.label];
            }

            return values;
        }, []));
        this.props.navigation.back();
    };

    componentDidMount () {
        this._subscribeToSearchEvent = this.props.route.config.eventEmitter.addListener('is-searching', this._onSearch);
        this._subscribeToClearValuesEvent = this.props.route.config.eventEmitter.addListener('clearValues', this._clearValues);
        this.props.route.getEventEmitter().emit(`clearValues${this.state.options.filter((option) => option.selected ).length ? 'Enable' : 'Disable'}`);
    }

    componentWillUnmount () {
        this._subscribeToSearchEvent.remove();
        this._subscribeToClearValuesEvent.remove();
    }

    render () {
        return (
            <View style={{ flex: 1 }}>
                <Container>
                    <T style={{color: c('core default')}}>Select the { this.props.route.params.values.length > 1 ? this.props.route.params.filterNamePlural : this.props.route.params.filterNameSingular }</T>
                    <SearchBox
                        style={u('spacing-mt-default')}
                        Mred={true}
                        placeholder={I18n.t(['searchFilterValues', 'clearAll'], { filterName: this.props.route.params.filterNameSingular })}
                        getEventEmitter={this.props.route.getEventEmitter}
                    />
                </Container>

                <ScrollView
                    style={u(['spacing-ph-large', 'spacing-pv-large'])}
                    keyboardShouldPersistTaps="always"
                >
                    <CheckboxList>
                        {this.state.options
                            .filter((option) => !option.hidden)
                            .map((option, index) => (
                                <CheckboxList__Item key={index}>
                                    <Checkbox
                                        label={option.label}
                                        SisSelected={option.selected}
                                        onPress={() => { this._toggleValue(option.label); }}
                                    />
                                </CheckboxList__Item>
                            ))
                        }
                    </CheckboxList>
                </ScrollView>

                <Divider Mbottom={false} Mtop={true} style={u(['spacing-ph-xx-large', 'spacing-pv-x-large'])}>
                    <Button
                        Mcolor={this.state.options.filter((option) => option.selected ).length === 0 ? 'muted' : 'primary'}
                        SisDisabled={this.state.options.filter((option) => option.selected ).length === 0}
                        label={I18n.t(['searchFilterValues', 'confirm.counting'], {
                            count: this.state.options.filter((option) => option.selected ).length,
                            filterNameSingular: this.props.route.params.filterNameSingular,
                            filterNamePlural: this.props.route.params.filterNamePlural
                        })}
                        onPress={this._goToSearchFilter}
                    />
                </Divider>
            </View>
        );
    }
}

SearchFilterValues.propTypes = {
    navigation: PropTypes.any,
    route: PropTypes.shape({
        config: PropTypes.any,
        getEventEmitter: PropTypes.func,
        params: PropTypes.shape({
            filterNameSingular: PropTypes.string.isRequired,
            filterNamePlural: PropTypes.string.isRequired,
            selectedValues: PropTypes.array.isRequired,
            values: PropTypes.array.isRequired,
            getSelectedValues: PropTypes.func
        })
    })
};

export default SearchFilterValues;
