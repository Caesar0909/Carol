// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  View,
  Text,
  ScrollView,
  StatusBar
} from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';

import {
    Container,
    Divider,
    PageHeader,
    PageFooter,
    BackButton,
    RoundOption,
    RoundView,
    Range,
    DatePicker,
    IconButton,
    Button,
    T
} from '../../components';

import c from '../../helpers/color';
import { windowSize, ratio } from '../../helpers/windowSize';

import {
    showBottomBar,
    hideBottomBar
} from '../../reduxes/actions';

import styles from './styles';

const mapDispatchToProps = {
    showBottomBar,
    hideBottomBar
};

class SearchFilter extends Component {
    static propTypes = {
        navigation: PropTypes.shape({
            state: PropTypes.shape({
                params: PropTypes.shape({
                    category: ImmutablePropTypes.map,
                    onGoBack: PropTypes.func
                })
            }),
            navigate: PropTypes.func.isRequired,
            goBack: PropTypes.func.isRequired
        }).isRequired,
        showBottomBar: PropTypes.func.isRequired,
        hideBottomBar: PropTypes.func.isRequired
    };

    static route = {
        navigationBar: null
    };

    static initialState = {
        revenueValues: [null, null],
        // marketValues: [null, null],
        employeeNumbers: [null, null],
        activeStateCodes: ['SP'],
        visibleStates: [
            { code: 'SP', name: 'São Paulo' },
            { code: 'RJ', name: 'Rio de Janeiro' },
            { code: 'MG', name: 'Minas Gerais' },
            { code: 'RS', name: 'Rio Grande do Sul' },
            { code: 'PR', name: 'Paraná' },
            { code: 'SC', name: 'Santa Catarina' },
            { code: 'BA', name: 'Bahia' }
        ],
        situationDateFrom: new Date().toISOString(),
        situationDateTo: '',
        registeredDateFrom: '',
        registeredDateTo: ''
    }

    state = SearchFilter.initialState

    componentWillMount () {
        this.props.hideBottomBar();
    }

    _isStateActive = (state) => {
        return this.state.activeStateCodes.indexOf(state.code) >= 0;
    };

    _goBack = () => {
        this.props.navigation.goBack();
        this.props.showBottomBar();
    }

    _handleReset = () => {
        this.setState({
            ...SearchFilter.initialState
        });
    }

    _handleRevenueChange = (values) => {
        this.setState({ revenueValues: values });
    }

    // _handleMarketChange = (values) => {
    //     this.setState({ marketValues: values });
    // }

    _handleEmployeeNumberChange = (values) => {
        this.setState({ employeeNumbers: values });
    }

    _handleStateSelect = (state) => {
        const { activeStateCodes } = this.state;

        if (this._isStateActive(state)) {
            this.setState({
                activeStateCodes: activeStateCodes.filter(code => code !== state.code)
            });
        }
        else {
            this.setState({
                activeStateCodes: [...activeStateCodes, state.code]
            });
        }
    }

    _handleStateAdd = () => {
        this.props.navigation.navigate('addState', {
            visibleStates: this.state.visibleStates,
            updateVisibleStates: this._updateVisibleStates
        });
    }

    _handleSituationDateFromChange = (date) => {
        this.setState({ situationDateFrom: date });
    }

    _handleSituationDateToChange = (date) => {
        this.setState({ situationDateTo: date });
    }

    _handleRegisteredDateFromChange = (date) => {
        this.setState({ registeredDateFrom: date });
    }

    _handleRegisteredDateToChange = (date) => {
        this.setState({ registeredDateTo: date });
    }
    
    _updateVisibleStates = (newStates) => {
        this.setState({
            visibleStates: newStates
        });
    }

    _seeRecords = () => {
        const {
            goBack,
            state: {
                params
            }
        } = this.props.navigation;

        params.onGoBack(this.state);
        goBack();
        this.props.showBottomBar();
    }

    _renderHeader = () => {
        const { category } = this.props.navigation.state.params;

        return (
            <PageHeader MhasShadow={false} style={{ paddingLeft: 0 }}>
                <BackButton
                    color={c('black light')}
                    Mflex
                    onPress={this._goBack}
                />
                <Text style={styles.title}>
                    {I18n.t(['searchFilter', 'title'], { category: category.get('label') })}
                </Text>
                <RoundOption
                    label="Reset"
                    onPress={this._handleReset}
                />
            </PageHeader>
        );
    }

    _renderContent = () => {
        const {
            revenueValues,
            // marketValues,
            employeeNumbers,
            visibleStates,
            situationDateFrom,
            situationDateTo,
            registeredDateFrom,
            registeredDateTo
        } = this.state;
        /*
            20: horizontal padding
            15: slider tracker radius
        */
        const sliderLength = windowSize.width - (20 + 15) * ratio * 2;

        return (
            <ScrollView
                style={styles.contentWrapper}
                showsVerticalScrollIndicator={false}
            >
                <Divider Mbottom>
                    <View style={styles.row}>
                        <Range
                            label={I18n.t(['searchFilter', 'revenue'])}
                            minValue={0}
                            maxValue={1000 * 1000}
                            step={100 * 1000}
                            sliderLength={sliderLength}
                            values={revenueValues}
                            prefix="R$"
                            onValuesChange={this._handleRevenueChange}
                        />
                    </View>
                    {/* <View style={[
                        styles.row,
                        { paddingTop: 0 }
                    ]}>
                        <Range
                            label={I18n.t(['searchFilter', 'marketValue'])}
                            minValue={0}
                            maxValue={1000 * 1000}
                            step={100 * 1000}
                            sliderLength={sliderLength}
                            values={marketValues}
                            prefix="R$"
                            onValuesChange={this._handleMarketChange}
                        />
                    </View> */}
                </Divider>
                <Divider
                    Mbottom
                    style={styles.row}
                >
                    <Range
                        label={I18n.t(['searchFilter', 'numberOfEmployees'])}
                        minValue={0}
                        maxValue={100 * 50}
                        step={50}
                        sliderLength={sliderLength}
                        values={employeeNumbers}
                        onValuesChange={this._handleEmployeeNumberChange}
                    />
                </Divider>
                <Divider
                    Mbottom
                    style={styles.row}
                >
                    <T style={styles.marginBottom}>
                        { I18n.t(['searchFilter', 'state']) }
                    </T>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {
                            visibleStates.map((state) => (
                                <RoundOption
                                    key={state.code}
                                    label={state.name}
                                    value={state}
                                    isActive={this._isStateActive(state)}
                                    style={{ marginRight: 10 * ratio, marginBottom: 7 * ratio }}
                                    onPress={this._handleStateSelect}
                                />
                            ))
                        }
                        <RoundView
                            Mstate="dotted"
                            onPress={this._handleStateAdd}
                        >
                            <T>
                                { I18n.t(['searchFilter', 'addAState']) }
                            </T>
                        </RoundView>
                    </View>
                </Divider>
                <Divider
                    Mbottom
                    style={styles.row}
                >
                    <T style={styles.marginBottom}>
                        { I18n.t(['searchFilter', 'situationDate']) }
                    </T>
                    <View style={[styles.horizontal, { marginBottom: 9 * ratio }]}>
                        <View style={styles.dateColLeft}>
                            <T>
                                { I18n.t(['searchFilter', 'from']) }
                            </T>
                        </View>
                        <View style={styles.dateColMiddle} />
                        <View style={styles.dateColRight}>
                            <T>
                                { I18n.t(['searchFilter', 'to']) }
                            </T>
                        </View>
                    </View>
                    <View style={styles.horizontal}>
                        <View style={styles.dateColLeft}>
                            <DatePicker
                                date={situationDateFrom}
                                onDateChange={this._handleSituationDateFromChange}
                            />
                        </View>
                        <Container
                            MalignCenter
                            style={styles.dateColMiddle}
                        >
                            <IconButton
                                color={c('transparent')}
                                fill={c('purple border')}
                                name="ArrowRight"
                                size={14 * ratio}
                            />
                        </Container>
                        <View style={styles.dateColRight}>
                            <DatePicker
                                date={situationDateTo}
                                onDateChange={this._handleSituationDateToChange}
                            />
                        </View>
                    </View>
                </Divider>
                <Divider
                    Mbottom
                    style={styles.row}
                >
                    <T style={styles.marginBottom}>
                        { I18n.t(['searchFilter', 'registeredDate']) }
                    </T>
                    <View style={[styles.horizontal, { marginBottom: 9 * ratio }]}>
                        <View style={styles.dateColLeft}>
                            <T>
                                { I18n.t(['searchFilter', 'from']) }
                            </T>
                        </View>
                        <View style={styles.dateColMiddle} />
                        <View style={styles.dateColRight}>
                            <T>
                                { I18n.t(['searchFilter', 'to']) }
                            </T>
                        </View>
                    </View>
                    <View style={styles.horizontal}>
                        <View style={styles.dateColLeft}>
                            <DatePicker
                                date={registeredDateFrom}
                                onDateChange={this._handleRegisteredDateFromChange}
                            />
                        </View>
                        <Container
                            MalignCenter
                            style={styles.dateColMiddle}
                        >
                            <IconButton
                                color={c('transparent')}
                                fill={c('purple border')}
                                name="ArrowRight"
                                size={14 * ratio}
                            />
                        </Container>
                        <View style={styles.dateColRight}>
                            <DatePicker
                                date={registeredDateTo}
                                onDateChange={this._handleRegisteredDateToChange}
                            />
                        </View>
                    </View>
                </Divider>
            </ScrollView>
        );
    }

    _renderFooter = () => {
        return (
            <PageFooter>
                <Button
                    Mwidth={280 * ratio}
                    Mheight={40 * ratio}
                    Mcolor="primary"
                    MSolid
                    label={I18n.t(['searchFilter', 'seeRecords'], { count: 500 })}
                    onPress={this._seeRecords}
                />
            </PageFooter>
        );
    }

    render () {
        return (
            <View style={styles.pageWrapper}>
                <StatusBar barStyle="default" />
                { this._renderHeader() }
                { this._renderContent() }
                { this._renderFooter() }
            </View>
        );
    }
}

export default connect(null, mapDispatchToProps)(SearchFilter);
