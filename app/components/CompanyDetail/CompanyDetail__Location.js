// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActionSheetIOS, Clipboard, Platform, ToastAndroid, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import I18n from 'react-native-i18n';

import GroupHeader from '../GroupHeader/';
import Container from '../Container/';
import Divider from '../Divider/';
import Map from '../Map/';
import T from '../T/';

import u from '../../helpers/utils/utils';
import c from '../../helpers/color';
import { arrayToString } from '../../helpers/utils/array';

class CompanyDetail__Location extends Component {
    _showActionSheet = (addressText: string, isThisRecord: boolean, goToAction: Function) => {
        let options = [I18n.t(['companyDetail', 'location', 'goToRecord']), I18n.t(['companyDetail', 'location', 'copyAddress']), I18n.t(['companyDetail', 'location', 'cancel'])];

        if (isThisRecord) {
            options.splice(0, 1);
        }

        ActionSheetIOS.showActionSheetWithOptions({
            options,
            cancelButtonIndex: options.length - 1,
            title: addressText,
            tintColor: c('red raddish')
        }, (index) => {
            if (index === 0) {
                if (!isThisRecord) {
                    goToAction();
                }
                else {
                    this._copyAddressToClipboard(addressText);
                }
            }
            else if (index === 1) {
                isThisRecord && this._copyAddressToClipboard(addressText);
            }
        });
    }

    _copyAddressToClipboard = (addressText: string) => {
        Clipboard.setString(addressText);

        if (Platform.OS === 'android') {
            ToastAndroid.show(I18n.t(['companyDetail', 'location', 'addressCopied']), ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        }
    }

    _onPress = (addressText: string, isThisRecord: boolean, goToAction: Function) => {
        if (Platform.OS === 'ios') {
            this._showActionSheet(addressText, isThisRecord, goToAction);
        }
        else if (!isThisRecord) {
            goToAction();
        }
    }

    _onLongPress = (addressText: string, isThisRecord: boolean, goToAction: Function) => {
        if (Platform.OS === 'ios') {
            this._showActionSheet(addressText, isThisRecord, goToAction);
        }
        else {
            this._copyAddressToClipboard(addressText);
        }
    }

    _renderAddressLine1 = (address: Object) => {
        return (
            <T style={u('color-text--dark')}>
                {arrayToString([
                    address.address1,
                    address.address2,
                    address.address3
                ])}
            </T>
        );
    }

    _renderAddressLine2 = (address: Object) => {
        return (
            <T style={u('color-text--dark')}>
                {arrayToString([
                    address.city,
                    address.state,
                    address.zipcode
                ])}
            </T>
        );
    }

    _renderAddressLine3 = (address: Object) => {
        return address.country && <T style={u('color-text--dark')}>{address.country}</T>;
    }

    _renderFullAddress = (address: Object) => {
        const addressText = arrayToString([
            address.address1,
            address.address2,
            address.address3,
            address.city,
            address.state,
            address.zipcode,
            address.country
        ]);
        const isThisRecord = this.props.currentId === address.id;

        return (
            <TouchableHighlight
                underlayColor="transparent"
                onPress={() => this._onPress(addressText, isThisRecord, address.onSelect)}
                onLongPress={() => this._onLongPress(addressText, isThisRecord, address.onSelect)}
            >
                <View>
                    <Container style={u('u-spacing-pv-large')}>
                        {address.isHQ && <T style={u('color-highlight')}>HQ</T>}
                        {this._renderAddressLine1(address)}
                        {this._renderAddressLine2(address)}
                        {this._renderAddressLine3(address)}
                    </Container>
                </View>
            </TouchableHighlight>
        );
    }

    _renderCurrentLocation = (address: Object) => {
        if (!address) {
            return null;
        }

        return (
            <View>
                {this._renderFullAddress(address)}
            </View>
        );
    }

    _renderOtherLocations = (addresses: Array<Object>) => {
        if (addresses.length === 0) {
            return null;
        }

        return (
            <View>
                <GroupHeader heading={I18n.t(['companyDetail', 'location', 'otherLocations'])} Msub={true} />
                {addresses.map((address, index) => (
                    <Divider key={index}>
                        {this._renderFullAddress(address)}
                    </Divider>
                ))}
            </View>
        );
    }

    _renderMap = () => {
        const currentAddress = this.props.addresses.find((address) => address.id === this.props.currentId);

        if (!currentAddress.latitude || !currentAddress.longitude) {
            return null;
        }

        return (
            <View style={u('spacing-mb-large')}>
                <TouchableOpacity activeOpacity={0.5} onPress={this.props.onMapPress}>
                    <Map
                        addresses={this.props.addresses}
                        static={true}
                        height={200}
                        width={this.props.width}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    render () {
        const currentAddress = this.props.addresses.find((address) => address.id === this.props.currentId);
        const notCurrentAddresses = this.props.addresses.filter((address) => address.id !== this.props.currentId);

        return (
            <View>
                <GroupHeader heading={I18n.t(['companyDetail', 'location', 'location'])} uppercase={true} />
                {this._renderCurrentLocation(currentAddress)}
                {this._renderMap()}
                {this._renderOtherLocations(notCurrentAddresses)}
            </View>
        );
    }
}

CompanyDetail__Location.propTypes = {
    currentId: PropTypes.string.isRequired,
    addresses: PropTypes.arrayOf(PropTypes.shape({
        address1: PropTypes.string.isRequired,
        address2: PropTypes.string,
        address3: PropTypes.string,
        city: PropTypes.string,
        country: PropTypes.string,
        state: PropTypes.string,
        zipcode: PropTypes.string,
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        isHQ: PropTypes.bool,
        selected: PropTypes.bool,
        onSelect: PropTypes.func
    })),
    onMapPress: PropTypes.func,
    width: PropTypes.number
};

export default CompanyDetail__Location;
