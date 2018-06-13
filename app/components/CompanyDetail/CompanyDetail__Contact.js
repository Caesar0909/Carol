// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActionSheetIOS, Alert, Clipboard, Linking, Platform, ToastAndroid, View } from 'react-native';
import I18n from 'react-native-i18n';

import Link from '../Link/';
import T from '../T/';
import { Table, Table__Row, Table__Cell } from '../Table/';
import GroupHeader from '../GroupHeader/';

import u from '../../helpers/utils/utils';

class CompanyDetail__Contact extends Component {
    data = [
        {
            name: I18n.t(['companyDetail', 'contact', 'website']),
            value: this.props.homePage,
            protocol: 'http://'
        },
        ...this.props.emails.map((email) => (
            {
                name: I18n.t(['companyDetail', 'contact', 'email']),
                value: email.emailAddress,
                protocol: 'mailto:'
            }
        )),
        ...this.props.phones.map((phone) => (
            {
                name: I18n.t(['companyDetail', 'contact', 'phone']),
                value: phone.phoneNumber,
                protocol: 'tel:'
            }
        ))
    ];

    _openUrl = (url: string, value: string) => {
        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                Linking.openURL(url);
            }
            else if (Platform.OS === 'ios') {
                Alert.alert(I18n.t(['companyDetail', 'contact', 'cannotOpen'], { value }));
            }
            else {
                ToastAndroid.show(I18n.t(['companyDetail', 'contact', 'cannotOpen'], { value }), ToastAndroid.SHORT, ToastAndroid.BOTTOM);
            }
        });
    }

    _copyValueToClipboard = (value: string) => {
        Clipboard.setString(value);

        if (Platform.OS === 'android') {
            ToastAndroid.show(I18n.t(['companyDetail', 'contact', 'cannotOpen'], { value }), ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        }
    }

    _showActionSheet = (url: string, value: string) => {
        ActionSheetIOS.showActionSheetWithOptions({
            options: [I18n.t(['companyDetail', 'contact', 'open']), I18n.t(['companyDetail', 'contact', 'copy']), I18n.t(['companyDetail', 'contact', 'cancel'])],
            cancelButtonIndex: 2,
            title: value
        }, (index) => {
            if (index === 0) {
                this._openUrl(url, value);
            }
            else if (index === 1) {
                this._copyValueToClipboard(value);
            }
        });
    }

    _onPress = (url: string, value: string) => {
        this._openUrl(url, value);
    }

    _onLongPress = (url: string, value: string) => {
        if (Platform.OS === 'ios') {
            this._showActionSheet(url, value);
        }
        else {
            this._copyValueToClipboard(value);
        }
    }

    _renderValue = (row: Object) => {
        if (!row.value) {
            return <T style={u('color-text--darker')}>Unknown</T>;
        }

        const url = row.value.indexOf('http') === 0 ? row.value : `${row.protocol}${row.value}`;

        return (
            <Link
                numberOfLines={1}
                text={row.value}
                onPress={() => { this._onPress(url, row.value); }}
                onLongPress={() => { this._onLongPress(url, row.value); }}
            />
        );
    };

    render () {
        return (
            <View>
                <GroupHeader heading={I18n.t(['companyDetail', 'contact', 'contact'])} uppercase={true} />
                <Table>
                    {this.data.map((row, index) => (
                        <Table__Row key={index}>
                            <Table__Cell style={{ width: 118 }}>
                                <T>{row.name}</T>
                            </Table__Cell>
                            <Table__Cell Mfluid={true}>
                                {this._renderValue(row)}
                            </Table__Cell>
                        </Table__Row>
                    ))}
                </Table>
            </View>
        );
    }
}

CompanyDetail__Contact.propTypes = {
    homePage: PropTypes.string,
    emails: PropTypes.arrayOf(PropTypes.shape({
        emailAddress: PropTypes.string.isRequired,
        emailType: PropTypes.string
    })).isRequired,
    phones: PropTypes.arrayOf(PropTypes.shape({
        phoneNumber: PropTypes.string.isRequired,
        phoneType: PropTypes.string
    })).isRequired
};

export default CompanyDetail__Contact;
