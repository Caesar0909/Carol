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

class Person360 extends Base360 {
    constructor (props) {
        super(props);

        this.state = {
            watching: false,
            title: 'Person',
            name: 'Mario Lesus Dalpiaz',
            description1: 'Address',
            description2: 'Rio Verde, Go, Brazil'
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
                        name={'Person'}
                        color={c('purple main')}
                        fill={c('purple main')}
                        width={22}
                        height={22}
                    />
                    <T style={{fontSize: 18, color: c('purple main'), marginLeft: 17}}>Additional Info</T>
                </View>
                <Divider />
                <TitleDescription
                    title="050916"
                    description="Person ID"
                />
                <TitleDescription
                    title="06/27/2017"
                    description="Birthday"
                />
                <TitleDescription
                    title="Serra Malte 600 MI"
                    description="Mother name"
                />
                <View
                    style={{
                        flexDirection: 'row'
                    }}
                >
                    <Divider Mright style={{ flex: 1 }}>
                        <TitleDescription
                            title="3942351233"
                            description="RG"
                        />
                    </Divider>
                    <View style={{ flex: 1 }}>
                        <TitleDescription
                            title="SSP/SC"
                            description="RG Orgao Exp"
                        />
                    </View>
                </View>
            </View>
        );
    }

    _renderInfoItem = ({ icon, title, description }) => {
        return (
            <View
                style={{
                    paddingHorizontal: 13 * ratio,
                    paddingVertical: 24 * ratio,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <Icon
                    name={icon}
                    color={c('black light')}
                    fill={c('black light')}
                    width={30}
                    height={30}
                    style={{ marginRight: 12 * ratio }}
                />
                <View>
                    <T style={{ fontSize: 16 * ratio }}>{title}</T>
                    <T
                        style={{
                            marginTop: 5 * ratio,
                            fontSize: 12 * ratio,
                            color: c('black light')
                        }}
                    >
                        {description}
                    </T>
                </View>
            </View>
        );
    }

    _renderContent = () => {
        return (
            <View>
                <View
                    style={{
                        marginVertical: 15 * ratio,
                        marginHorizontal: 5 * ratio,
                        paddingBottom: 20 * ratio,
                        borderWidth: 1 * ratio,
                        borderRadius: 6 * ratio,
                        borderColor: c('newgray border')
                    }}
                >
                    { this._renderInfoItem({
                        icon: 'Phone',
                        title: '+55.48.988109825',
                        description: 'Phone'
                    })}
                    <Divider />
                    { this._renderInfoItem({
                        icon: 'Mail',
                        title: 'mario.lesus@gmail.com',
                        description: 'Email'
                    })}
                    { this._renderMap() }
                </View>
                { this._renderAdditionalInfo() }
            </View>
        );
    }

}

export default Person360;
