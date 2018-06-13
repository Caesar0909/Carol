// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import I18n from 'react-native-i18n';

import T from '../T/';
import { Table, Table__Row, Table__Cell } from '../Table/';
import Link from '../Link/';

import u from '../../helpers/utils/utils';
import { toFormattedDate } from '../../helpers/utils/date';

const CompanyDetail__Summary = (props: Object) => {
    const summaryData = [
        {
            name: I18n.t(['companyDetail', 'summary', 'taxId']),
            value: props.taxId ? props.taxId : ''
        },
        {
            name: I18n.t(['companyDetail', 'summary', 'dba']),
            value: props.dba ? props.dba : ''
        },
        {
            name: I18n.t(['companyDetail', 'summary', 'activity']),
            value: props.mainActivity ? props.mainActivity : ''
        }
    ];
    const companyInfoData = [
        {
            name: I18n.t(['companyDetail', 'summary', 'numberOfEmployees']),
            type: 'numberOfEmployees',
            value: props.numberOfEmployees,
            isEditable: true,
            hasBeenEdited: props.numberOfEmployeesHasBeenEdited
        },
        {
            name: I18n.t(['companyDetail', 'summary', 'revenue']),
            type: 'revenue',
            value: props.revenue,
            isEditable: true,
            hasBeenEdited: props.revenueHasBeenEdited
        },
        {
            name: I18n.t(['companyDetail', 'summary', 'marketValue']),
            type: 'marketValue',
            value: props.marketValue
        },
        {
            name: I18n.t(['companyDetail', 'summary', 'registerDate']),
            type: 'registerDate',
            value: toFormattedDate(props.registerDate)
        }
    ];

    return (
        <Table>
            {summaryData.map((row, index) => (
                <Table__Row key={index}>
                    <Table__Cell style={{ width: 118 }}>
                        <T>{row.name}</T>
                    </Table__Cell>
                    <Table__Cell Mfluid={true}>
                        <T style={u(`color-text--${row.value.length ? 'dark' : 'darker'}`)}>{row.value.length ? row.value : 'Unknown'}</T>
                    </Table__Cell>
                </Table__Row>
            ))}

            {companyInfoData.map((row, index) => {
                const valueRow = (
                    <Table__Row noDivider={row.hasBeenEdited || null}>
                        <Table__Cell style={{ width: 118 }}>
                            <T>{row.name}</T>
                        </Table__Cell>
                        <Table__Cell Mfluid={true}>
                            <T style={u(`color-text--${row.value ? 'dark' : 'darker'}`)}>
                                {row.value || I18n.t(['companyDetail', 'unknown'])}
                                {row.hasBeenEdited && <T>*</T>}
                            </T>
                            {row.isEditable && <Link Mmorelink={true} text={I18n.t(['companyDetail', 'summary', 'updateThis'])} onPress={() => props.onEditValue(row.type, row.value)} />}
                        </Table__Cell>
                    </Table__Row>
                );
                const messageRow = row.hasBeenEdited ? (
                    <Table__Row>
                        <Table__Cell style={u('spacing-pt-zero')}>
                            <View style={{ left: 8, position: 'absolute' }}><T>*</T></View>
                            <T style={u('font-size-12')}>{I18n.t(['companyDetail', 'summary', 'hasBeenEdited'])}</T>
                        </Table__Cell>
                    </Table__Row>
                ) : null;

                return (
                    <View key={index}>
                        {valueRow}
                        {messageRow}
                    </View>
                );
            })}
        </Table>
    );
};

CompanyDetail__Summary.propTypes = {
    taxId: PropTypes.string,
    dba: PropTypes.string,
    mainActivity: PropTypes.string,
    numberOfEmployees: PropTypes.string,
    numberOfEmployeesHasBeenEdited: PropTypes.bool,
    marketValue: PropTypes.string,
    registerDate: PropTypes.string,
    revenue: PropTypes.string,
    revenueHasBeenEdited: PropTypes.bool,
    onEditValue: PropTypes.func
};

export default CompanyDetail__Summary;
