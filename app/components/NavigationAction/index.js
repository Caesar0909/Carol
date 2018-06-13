// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight, View } from 'react-native';
import bem from 'react-native-bem';
import NavigationSpacer from '../NavigationSpacer/';
import styles from './styles';

class NavigationAction extends Component {
    static defaultProps: { disabledOpacity: number };

    state: {
        isDisabled: boolean,
        isHidden: boolean
    };

    _subscribeToDisableEvent: Function;
    _subscribeToEnableEvent: Function;
    _subscribeToHideEvent: Function;

    constructor (props: Object) {
        super(props);

        this.state = {
            isDisabled: this.props.canBeDisabled ? true : false,
            isHidden: false
        };
    }

    b (selector: string) {
        return bem(selector, this.props, styles);
    }

    _onDisable = () => {
        this.setState({ isDisabled: true });
    };

    _onEnable = () => {
        this.setState({ isDisabled: false });
    };

    _onHide = () => {
        this.setState({ isHidden: true });
    };

    _onPress = () => {
        !this.state.isDisabled && this.props.getEventEmitter().emit(this.props.eventName);
    };

    componentWillMount () {
        if (this.props.canBeDisabled) {
            this._subscribeToDisableEvent = this.props.config.eventEmitter.addListener(`${this.props.eventName}Disable`, this._onDisable);
            this._subscribeToEnableEvent = this.props.config.eventEmitter.addListener(`${this.props.eventName}Enable`, this._onEnable);
            this._subscribeToHideEvent = this.props.config.eventEmitter.addListener(`${this.props.eventName}Hide`, this._onHide);
        }
    }

    componentWillUnmount () {
        if (this.props.canBeDisabled) {
            this._subscribeToDisableEvent.remove();
            this._subscribeToEnableEvent.remove();
            this._subscribeToHideEvent.remove();
        }
    }

    render () {
        const TouchElem = this.state.isDisabled ? View : TouchableHighlight;
        let opacity;

        if (this.state.isHidden) {
            opacity = 0;
        }
        else {
            opacity = this.state.isDisabled ? this.props.disabledOpacity : 1;
        }

        return (
            <NavigationSpacer style={{ opacity }}>
                <TouchElem onPress={this._onPress}>
                    <View>
                        {this.props.children}
                    </View>
                </TouchElem>
            </NavigationSpacer>
        );
    }
}

NavigationAction.defaultProps = {
    disabledOpacity: 0.5
};

NavigationAction.propTypes = {
    children: PropTypes.node,
    canBeDisabled: PropTypes.bool,
    disabledOpacity: PropTypes.number,
    eventName: PropTypes.string.isRequired,
    config: PropTypes.any,
    getEventEmitter: PropTypes.func.isRequired
};

export default NavigationAction;
