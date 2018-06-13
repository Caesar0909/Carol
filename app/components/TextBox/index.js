// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextInput, View } from 'react-native';
import bem from 'react-native-bem';
import IconButton from '../IconButton/';
import c from '../../helpers/color';
import styles from './styles';

class TextBox extends Component {
    state: {
        SisFocused: boolean
    };

    textInput: any;

    constructor () {
        super();

        this.state = {
            SisFocused: false
        };
    }

    _onBlur = () => {
        this.setState({
            SisFocused: false
        });
    }

    _onFocus = () => {
        this.setState({
            SisFocused: true
        });
    }

    b (selector: string) {
        return bem(selector, Object.assign({}, this.props, this.state), styles);
    }

    _renderTextInput () {
        return (
            <TextInput
                {...this.props}
                ref={(ref) => (this.textInput = ref)}
                style={this.b('text-box')}
                placeholderTextColor={this.props.Mred || this.props.Msearchbox || this.props.Msearchred ? c('red raddish') : 'white'}
                underlineColorAndroid="transparent"
                onBlur={this._onBlur}
                onFocus={this._onFocus}
            />
        );
    }

    _renderClearIcon () {
        if (this.state.SisFocused && this.props.onClear && this.props.value.length) {
            return (
                <View style={this.b('text-box-clear-icon')}>
                    <IconButton
                        name="Cross"
                        circular={true}
                        size={22}
                        color={this.props.Mdark ? c('blue spectra') : 'transparent' }
                        fill={this.props.Mdark ? c('gray aztec') : c('red raddish') }
                        onPress={this.props.onClear}
                    />
                </View>
            );
        }

        return null;
    }

    render () {
        return (
            <View>
                {this._renderTextInput()}
                {/*{this._renderClearIcon()}*/}
            </View>
        );
    }

    componentDidUpdate () {
        this.props.setFocus && this.textInput.focus();
    }
}

TextBox.propTypes = {
    MalignCenter: PropTypes.bool,
    Mbordered: PropTypes.bool,
    Mtransparent: PropTypes.bool,
    Mred: PropTypes.bool,
    Msearchbox: PropTypes.bool,
    Msearchred: PropTypes.bool,
    Mdark: PropTypes.bool,
    onClear: PropTypes.func,
    setFocus: PropTypes.bool,
    value: PropTypes.string
};

export default TextBox;
