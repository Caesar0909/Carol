import React from 'react';
import PropTypes from 'prop-types';
import {
    Dimensions,
    StyleSheet,
    ScrollView,
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import bem from 'react-native-bem';
import I18n from 'react-native-i18n';

import styles from './styles';
import T from '../T/';
import IconButton from '../IconButton/';
import Icon from '../Icon/';
import { ratio } from '../../helpers/windowSize';
import SessionHelper from '../../helpers/SessionHelper';
import c from '../../helpers/color';
import {
    PageHeader,
    BackButton
} from '../index';

const Menu = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('menu')}>
            <PageHeader MhasShadow={false} style={{ paddingLeft: 0 }}>
                <BackButton
                    color={c('black light')}
                    Mflex
                    onPress={() => props.onItemSelected('close')}
                />
                <T Mbold style={{ fontSize: 16 * ratio }}>
                    {I18n.t(['hamburgerMenu', 'title'])}
                </T>
            </PageHeader>
            <View style={{
                paddingVertical: 32,
                paddingHorizontal: 20,
                flex: 1
            }}>
                {props.menus.map((item) => {
                    if (item.key === props.active) {
                        return (<View key={"menu" + item.key} style={{
                            marginBottom: 25
                        }}>
                            <TouchableOpacity onPress={() => { props.onItemSelected(item.key); }}>
                                <View style={{flexDirection: 'row', height: 22}}>
                                    <Icon
                                        name="CircleFill"
                                        width={20 * ratio}
                                        height={20 * ratio}
                                        fill={c('purple border')}
                                        color={'#f00000'}
                                        stroke={'#979797'}
                                    />
                                    <T style={{color: '#485465', fontSize: 14 * ratio, marginLeft: 5}}>{item.text}</T>
                                </View>
                                <View style={{marginLeft: 25, marginTop: 0}}><T style={{color: c('black light'), fontSize: 10}}>{item.typeText}</T></View>
                                
                            </TouchableOpacity>
                        </View>);
                    }

                    return (<View key={"menu" + item.key} style={{
                        marginBottom: 25
                    }}>
                        <TouchableOpacity onPress={() => { props.onItemSelected(item.key); }}>
                            <View style={{flexDirection: 'row', height: 22}}>
                                <Icon
                                    name="CircleEmpty"
                                    width={20 * ratio}
                                    height={20 * ratio}
                                    fill={'#f00000'}
                                    color={'#f00000'}
                                    stroke={'#979797'}
                                />
                                <T style={{color: '#485465', fontSize: 14 * ratio, marginLeft: 5}}>{item.text}</T>
                            </View>
                            <View style={{marginLeft: 25, marginTop: 0}}><T style={{color: c('black light'), fontSize: 10 * ratio}}>{item.typeText}</T></View>
                        </TouchableOpacity>
                    </View>);
                })}
            </View>

            <View>
                <TouchableOpacity style={b('footerItem')} onPress={() => { props.onItemSelected('invite'); }}>
                    <Icon
                        name="ExclamationCircle"
                        width={26 * ratio}
                        height={26 * ratio}
                        fill={'white'}
                        color={c('black light')}
                        stroke={c('black light')}
                        strokeWidth={1.4}
                    />
                    <T style={{fontSize: 14 * ratio, marginLeft: 11, color: '#485465'}}>Invite</T>
                </TouchableOpacity>
                <TouchableOpacity style={b('footerItem')} onPress={() => { props.onItemSelected('logout'); }}>
                    <Icon
                        name="ExclamationCircle"
                        width={26 * ratio}
                        height={26 * ratio}
                        fill={'white'}
                        color={c('black light')}
                        stroke={c('black light')}
                        strokeWidth={1.4}
                    />
                    <T style={{fontSize: 14 * ratio, marginLeft: 11, color: '#485465'}}>Log Out</T>
                </TouchableOpacity>
                <TouchableOpacity style={b('footerItem')}>
                    <Icon
                        name="ExclamationCircle"
                        width={26 * ratio}
                        height={26 * ratio}
                        fill={'white'}
                        color={c('black light')}
                        stroke={c('black light')}
                        strokeWidth={1.4}
                    />
                    <T style={{fontSize: 14 * ratio, marginLeft: 11, color: '#485465'}}>Report an issue</T>
                </TouchableOpacity>
                <TouchableOpacity style={b('footerItem')}>
                    <Icon
                        name="Profile"
                        width={19 * ratio}
                        height={19 * ratio}
                        fill={c('black light')}
                        color={c('black light')}
                    />
                    <T style={{fontSize: 14 * ratio, marginLeft: 11, color: '#485465'}}>My profile</T>
                </TouchableOpacity>
            </View>
        </View>
    );
};

Menu.propTypes = {
    onItemSelected: PropTypes.func.isRequired,
    menus: PropTypes.array,
    active: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Menu;
