// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import Icon from '../Icon/';
import c from '../../helpers/color';

class ToggleIcon extends Component {
    static defaultProps: {
        isOff: boolean,
        offColor: string,
        onColor: string,
        strokeWidth: number
    };

    state: {
        offColor: string,
        onColor: string,
        isOff: boolean
    };

    _subscribeToToggleOffEvent: Function;
    _subscribeToToggleOnEvent: Function;

    constructor (props: Object) {
        super(props);

        this.state = {
            isOff: this.props.isOff,
            offColor: this.props.offColor,
            onColor: this.props.onColor
        };
    }

    _onToggleOff = () => {
        this.setState({ isOff: true });
    };

    _onToggleOn = () => {
        this.setState({ isOff: false });
    };

    _onPress = () => {
        this.props.eventName && this.props.getEventEmitter().emit(this.props.eventName);
        this.props.onPress && this.props.onPress();
    };

    componentWillMount () {
        if (this.props.eventName) {
            this._subscribeToToggleOffEvent = this.props.config.eventEmitter.addListener(`${this.props.eventName}ToggleOff`, this._onToggleOff);
            this._subscribeToToggleOnEvent = this.props.config.eventEmitter.addListener(`${this.props.eventName}ToggleOn`, this._onToggleOn);
        }
    }

    componentWillUnmount () {
        if (this.props.eventName) {
            this._subscribeToToggleOffEvent.remove();
            this._subscribeToToggleOnEvent.remove();
        }
    }

    render () {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={this._onPress}>
                <View>
                    <Icon
                        name={this.props.name}
                        height={this.props.height}
                        width={this.props.width}
                        fill={this.state.isOff ? 'transparent' : this.state.onColor}
                        stroke={this.state.offColor}
                        strokeWidth={this.state.isOff ? this.props.strokeWidth : 0}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

ToggleIcon.defaultProps = {
    isOff: true,
    offColor: c('core primary'),
    onColor: c('core primary'),
    strokeWidth: 5
};

ToggleIcon.propTypes = {
    config: PropTypes.any,
    eventName: PropTypes.string,
    getEventEmitter: PropTypes.func,
    isOff: PropTypes.bool,
    name: PropTypes.string.isRequired,
    offColor: PropTypes.string,
    onColor: PropTypes.string,
    onPress: PropTypes.func,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    strokeWidth: PropTypes.number,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default ToggleIcon;
