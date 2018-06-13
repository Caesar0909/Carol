// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import bem from 'react-native-bem';
import IconOverTextBox from '../IconOverTextBox/';
import TextBox from '../TextBox/';
import c from '../../helpers/color';
import styles from './styles';

class SearchBox extends Component {

    static propTypes = {
        Msearchbox: PropTypes.bool
    };

    state: {
        searchValue: string
    };

    constructor () {
        super();

        this.state = {
            searchValue: ''
        };
    }

    _onChangeValue = (searchValue: string) => {
        this.setState({ searchValue });
        this.props.getEventEmitter().emit('is-searching', searchValue);
    };

    b (selector: string) {
        return bem(selector, this.props, styles);
    }

    render () {
        return (
            <View
                style={this.b('search-box')}
                Mnavigation={this.props.Mnavigation}
            >
                <IconOverTextBox
                    name="Magnifier"
                    fill={this.props.Msearchbox || this.props.Mred ? c('red raddish') : c('gray hit')}
                    Mnavigation={this.props.Mnavigation}
                >
                    <TextBox
                        Msearchbox = {this.props.Msearchbox}
                        Msearchred = {this.props.Mred}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoFocus={this.props.autoFocus ? true : false}
                        placeholder={this.props.placeholder}
                        returnKeyType="search"
                        value={this.state.searchValue}
                        onChangeText={this._onChangeValue}
                        onClear={() => { this._onChangeValue(''); }}
                    />
                </IconOverTextBox>
            </View>
        );
    }
}

SearchBox.propTypes = {
    Mbordered: PropTypes.bool,
    Mdark: PropTypes.bool,
    Mred: PropTypes.bool,
    Mnavigation: PropTypes.bool,
    autoFocus: PropTypes.bool,
    placeholder: PropTypes.string.isRequired,
    getEventEmitter: PropTypes.func
};

export default SearchBox;
