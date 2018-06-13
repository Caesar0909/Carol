// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import I18n from 'react-native-i18n';

import T from '../T/';
import { Table, Table__Row, Table__Cell } from '../Table/';
import { SideBySide, SideBySide__Item } from '../SideBySide/';
import GroupHeader from '../GroupHeader/';
import Icon from '../Icon/';

import c from '../../helpers/color';
import u from '../../helpers/utils/utils';
import { toFormattedDate } from '../../helpers/utils/date';

const CompanyDetail__Nps = (props: Object) => {
    let iconName: string;

    if (props.currentScore > props.previousScore) {
        iconName = 'Up';
    }
    else if (props.currentScore < props.previousScore) {
        iconName = 'Down';
    }
    else {
        iconName = 'Equal';
    }

    return (
        <View>
            <SideBySide>
                <SideBySide__Item Mfluid={true}>
                    <GroupHeader heading="Net Promoter Score (NPS)" />
                </SideBySide__Item>
                <SideBySide__Item MvAlign="bottom">
                    <GroupHeader heading={I18n.t(['companyDetail', 'nps', 'trend'])} Msub={true} />
                </SideBySide__Item>
            </SideBySide>
            <Table>
                <Table__Row>
                    <Table__Cell Mfluid={true}>
                        <T style={u('color-text--dark')}>{I18n.t(['companyDetail', 'nps', 'score'], { currentScore: props.currentScore })}</T>
                        <T style={u('spacing-pt-small')}>{I18n.t(['companyDetail', 'nps', 'lastUpdated'], { date: toFormattedDate(props.date) })}</T>
                    </Table__Cell>
                    <Table__Cell style={{
                        justifyContent: 'center'
                    }}>
                        <Icon name={`Change${iconName}`} fill={c('core text')} height={21} width={13} />
                    </Table__Cell>
                </Table__Row>
            </Table>
        </View>
    );
};

CompanyDetail__Nps.propTypes = {
    currentScore: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    previousScore: PropTypes.number.isRequired
};

export default CompanyDetail__Nps;
