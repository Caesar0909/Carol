// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  ScrollView,
  StatusBar
} from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';

import {
    PageHeader,
    PageFooter,
    BackButton,
    Button,
    Option
} from '../../components';

import c from '../../helpers/color';
import { ratio } from '../../helpers/windowSize';
import { getStates } from '../../helpers/LocationHelper';

import {hideBottomBar} from '../../reduxes/actions';

import styles from './styles';

const mapDispatchToProps = dispatch => ({
    hideBottomBar: () => dispatch(hideBottomBar())
});

const states = getStates();

const isStateSelected = (stateList, state) => {
    return !!stateList.find(s => s.code === state.code);
};

class AddState extends Component {
    static propTypes = {
        navigation: PropTypes.shape({
            state: PropTypes.shape({
                params: PropTypes.shape()
            }),
            goBack: PropTypes.func.isRequired
        }).isRequired,
        hideBottomBar: PropTypes.func.isRequired
    };

    static route = {
        navigationBar: null
    };

    state = {
        visibleStates: this.props.navigation.state.params.visibleStates
    }

    componentWillMount () {
        this.props.hideBottomBar();
    }

    _goBack = () => {
        this.props.navigation.goBack();
    }

    _saveAndGoBack = () => {
        /**
         * TODO: update redux state
         */
        this.props.navigation.state.params.updateVisibleStates(this.state.visibleStates);
        this.props.navigation.goBack();
    }

    _handleStatePress = (state) => {
        const { visibleStates } = this.state;

        if (isStateSelected(visibleStates, state)) {
            const newvisibleStates = visibleStates.filter(s => s.code !== state.code);
    
            this.setState({
                visibleStates: newvisibleStates
            });
        }
        else {
            this.setState({
                visibleStates: [...visibleStates, state]
            });
        }
    }

    _renderHeader = () => {
        return (
            <PageHeader MhasShadow={false} style={{ paddingLeft: 0 }}>
                <BackButton
                    color={c('black light')}
                    Mflex
                    onPress={this._goBack}
                />
                <Text style={styles.title}>
                    {I18n.t(['addState', 'title'])}
                </Text>
            </PageHeader>
        );
    }

    _renderContent = () => {
        const { visibleStates } = this.state;

        return (
            <ScrollView
                style={styles.contentWrapper}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.scrollContent}>
                {
                    states.map(state => (
                        <Option
                            key={state.code}
                            label={state.name}
                            value={state.code}
                            Mselected={isStateSelected(visibleStates, state)}
                            style={styles.optionMargin}
                            onPress={() => this._handleStatePress(state)}
                        />
                    ))
                }
                </View>
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
                    label={I18n.t(['addState', 'ok'])}
                    onPress={this._saveAndGoBack}
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

export default connect(null, mapDispatchToProps)(AddState);
