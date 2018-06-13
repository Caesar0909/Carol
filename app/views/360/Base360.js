// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, ScrollView, StatusBar, Text } from 'react-native';
import MapView from 'react-native-maps';
import openMap from 'react-native-open-maps';
import geolib from 'geolib';

import {
    BackgroundView,
    T,
    Icon,
    BackButton,
    PageHeader
} from '../../components';

import { windowSize, ratio } from '../../helpers/windowSize';
import c from '../../helpers/color';

class Base360 extends Component {
    constructor (props) {
        super(props);

        this.state = {
            watching: false,
            title: ''
        };
    }

    static route = {
        navigationBar: null
    };

    _goBack = () => {
        this.props.navigation.goBack();
    };

    _toggleWatching = () => {
        this.setState({
            watching: !this.state.watching
        });
    }

    _renderHeader = () => {
        return (
            <PageHeader
                style={{
                    justifyContent: 'center'
                }}
            >
                <BackButton
                    color={c('black light')}
                    onPress={this._goBack}
                />
                <T
                    Mbold
                    style={{
                        fontSize: 18,
                        color: c('black main')
                    }}
                >{this.state.title}</T>
            </PageHeader>
        );
    };

    _renderWatchlist = () => {
        const { watching } = this.state;

        return (<TouchableOpacity
                style={{
                    width: 80 * ratio,
                    height: 80 * ratio,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8 * ratio,
                    borderWidth: 0,
                    borderColor: '#c6c6c6',
                    backgroundColor: 'white',
                    shadowRadius: 6 * ratio,
                    shadowOffset: { width: 6 * ratio, height: 6 * ratio },
                    shadowColor: '#c6c6c6',
                    top: 45 * ratio,
                    right: 20 * ratio,
                    position: 'absolute',
                    zIndex: 66,
                    shadowOpacity: 1.0
                }}
                onPress={this._toggleWatching}
            >
                <Icon
                    name={watching ? 'Star' : 'StarEmpty'}
                    color={c('purple main')}
                    fill={c('purple main')}
                    width={20 * ratio}
                    height={20 * ratio}
                />
                <T style={{
                    marginTop: 2 * ratio,
                    fontSize: 12 * ratio,
                    color: c('black main')
                }}>Watchlist</T>
            </TouchableOpacity>
        );
    };

    _renderMap = (address, currentLocation, latLng) => {
        if (!currentLocation || !latLng) {
            return null;
        }

        const radius = 900;
        const distanceInMeters = geolib.getDistance(currentLocation.coords, latLng);
        const distanceInMiles = geolib.convertUnit('mi', distanceInMeters);
        const { latitude, longitude } = latLng;

        return (
            <View>
                <MapView
                    initialRegion={{
                        latitude,
                        longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.02
                    }}
                    style={{
                        height: 200 * ratio,
                        width: '100%'
                    }}
                    cacheEnabled={true}
                >
                    <MapView.Marker
                        coordinate={latLng}
                        pinColor={c('newblue main')}
                    >
                        <View
                            style={{
                                borderRadius: 5 * ratio,
                                width: 10 * ratio,
                                height: 10 * ratio,
                                backgroundColor: c('green map-circle-stroke')
                            }}
                        />
                    </MapView.Marker>
                    <MapView.Circle
                        center={latLng}
                        radius={radius}
                        strokeWidth={2}
                        strokeColor={c('green map-circle-stroke')}
                        fillColor={c('green map-circle-fill')}
                        zIndex={10}
                    />
                </MapView>
                <TouchableOpacity
                    onPress={() => { openMap({ latitude, longitude }); }}
                >
                    <View
                        style={{
                            position: 'absolute',
                            left: 25 * ratio,
                            right: 25 * ratio,
                            bottom: 20 * ratio,
                            paddingHorizontal: 15,
                            paddingVertical: 15,
                            backgroundColor: 'white',
                            borderRadius: 5 * ratio
                        }}
                    >
                        <T style={{fontSize: 14, color: c('purple main'), fontWeight: 'bold'}}>
                            {distanceInMiles} mi
                            <T style={{fontWeight: 'normal', color: c('black main')}}>
                                {` | ${address.address1}`}
                            </T>
                        </T>
                        <T style={{fontSize: 14, color: c('black light')}}>
                            { `${address.city}, ${address.state}, ${address.zipcode}` }
                        </T>
                        <T style={{fontSize: 14, color: c('black light')}}>{address.country}</T>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    _renderContent = () => {
        throw new Error('Implement this in the subclass.');
    }

    render () {
        const {
            name,
            tag,
            description1,
            description2
        } = this.state;

        return (
            <BackgroundView style={{backgroundColor: 'white'}}>
                <StatusBar barStyle="default" />
                {this._renderHeader()}
                {/* {this._renderWatchlist()} */}
                <ScrollView
                    scrollEventThrottle={16}
                >
                    <View style={{
                        marginTop: 25 * ratio,
                        marginLeft: 20 * ratio,
                        flexDirection: 'row',
                        width: windowSize.width - 40 * ratio,
                        alignItems: 'flex-end'
                    }}>
                        <Text
                            style={{
                                color: c('black main'),
                                fontSize: 22 * ratio,
                                paddingRight: 20 * ratio,
                                flex: 1
                            }}
                        >
                            {name}
                        </Text>
                        <View style={{
                            backgroundColor: c('purple main'),
                            paddingHorizontal: 10 * ratio,
                            paddingVertical: 2 * ratio,
                            borderRadius: 3 * ratio,
                            marginBottom: 3 * ratio,
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: tag ? 1 : 0
                        }}>
                            <T style={{color: 'white', fontSize: 14 * ratio}}>{tag}</T>
                        </View>
                    </View>
                    <View style={{marginTop: 11 * ratio, marginLeft: 20 * ratio}}>
                        <T style={{color: c('purple main'), fontSize: 12 * ratio}}>{description1 + ' '}</T>
                        <T style={{fontSize: 12 * ratio, marginTop: 3 * ratio, color: c('black light')}}>{description2}</T>
                    </View>
                    { this._renderContent() }
                </ScrollView>
            </BackgroundView>
        );
    }
}

Base360.propTypes = {
    navigation: PropTypes.any,
    route: PropTypes.any
};

export default Base360;
