// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import T from '../T/';
import { Table, Table__Row, Table__Cell } from '../Table/';
import { SideBySide, SideBySide__Item } from '../SideBySide/';
import GroupHeader from '../GroupHeader/';

import u from '../../helpers/utils/utils';
import { sortByDateDesc } from '../../helpers/utils/array';
import { toFormattedDate } from '../../helpers/utils/date';

const CompanyDetail__OpportunitiesTickets = (props: Object) => {
    return (
        <View>
            <SideBySide>
                <SideBySide__Item Mfluid={true} MvAlign="bottom">
                    <GroupHeader heading={props.heading} />
                </SideBySide__Item>
                {props.subHeading && props.rows.length > 0 && (
                    <SideBySide__Item Mfluid={true} MvAlign="bottom">
                        <GroupHeader heading={props.subHeading} Msub={true} Malign="right" />
                    </SideBySide__Item>
                )}
            </SideBySide>
            <Table>
                {!props.rows.length && (
                    <Table__Row noDivider={true}>
                        <Table__Cell>
                            <T>{props.emptyText}</T>
                        </Table__Cell>
                    </Table__Row>
                )}
                {props.rows
                    .sort((a, b) => sortByDateDesc(a, b))
                    .map((row, index) => (
                        <Table__Row key={index}>
                            <Table__Cell Mfluid={true}>
                                <T style={u('color-text--dark')}>{`${row.description}`}</T>
                                <T style={u('spacing-pt-small')}>{`${row.footer}`}</T>
                            </Table__Cell>
                            <Table__Cell>
                                <T style={[u('color-text--darker'), { textAlign: 'right' }]}>{toFormattedDate(row.date)}</T>
                            </Table__Cell>
                        </Table__Row>
                    )
                )}
            </Table>
        </View>
    );
};

CompanyDetail__OpportunitiesTickets.propTypes = {
    rows: PropTypes.arrayOf(PropTypes.shape({
        description: PropTypes.string.isRequired,
        footer: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired
    })).isRequired,
    emptyText: PropTypes.string,
    heading: PropTypes.string.isRequired,
    subHeading: PropTypes.string
};

export default CompanyDetail__OpportunitiesTickets;
