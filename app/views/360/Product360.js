// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import Base360 from './Base360';

import {
    T,
    Icon,
    Divider,
    TitleDescription
} from '../../components';

import { ratio } from '../../helpers/windowSize';
import c from '../../helpers/color';

class Product360 extends Base360 {
    constructor (props) {
        super(props);

        this.state = {
            watching: false,
            title: 'Product',
            name: 'Totvs ERP System',
            description1: 'Services'
        };
    }

    _renderAdditionalInfo = () => {
        return (
            <View>
                <View style={{
                    marginTop: 20 * ratio,
                    marginBottom: 15 * ratio,
                    paddingLeft: 20 * ratio,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Icon
                        name={'NewBuildings'}
                        color={c('purple main')}
                        fill={c('purple main')}
                        width={22}
                        height={22}
                    />
                    <T style={{fontSize: 18, color: c('purple main'), marginLeft: 17}}>Additional Info</T>
                </View>
                <Divider />
                <TitleDescription
                    title="Serra Malte 600 MI"
                    description="Description"
                />
                <TitleDescription
                    title="Serra Malte 600 MI"
                    description="Description"
                />
                <TitleDescription
                    title="Serra Malte 600 MI"
                    description="Description"
                />
            </View>
        );
    }

    _renderContent = () => {
        return (
            <View>
                { this._renderAdditionalInfo() }
            </View>
        );
    }
}

export default Product360;
