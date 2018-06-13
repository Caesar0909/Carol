// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, View } from 'react-native';
import MapView from 'react-native-maps';
import bem from 'react-native-bem';

import Icon from '../Icon/';
import LocationIndex from '../LocationIndex/';
import { locationSize } from '../LocationIndex/styles';
import Images from '../../assets/icons/images/';

import c from '../../helpers/color';
import styles, { markerSize } from './styles';

class MapMarker extends Component {
    state: {
        ShasPin: boolean
    }

    static defaultProps: {
        isHQ: boolean,
        number: number
    }

    marker: any

    constructor (props: Object) {
        super(props);

        this.state = {
            ShasPin: this.props.showPin
        };
    }

    b = (selector: string) => bem(selector, Object.assign({}, this.props, this.state), styles)

    _renderMarker = () => {
        if (this.props.isHQ) {
            return <Image source={Images.HQ} style={this.b('map-marker__image')} />;
        }

        return (
            <LocationIndex
                number={this.props.number}
                style={{ marginBottom: this.props.showPin ? 0 : (markerSize - locationSize) / 2 }}
            />
        );
    }

    _renderPin = () => {
        if (this.props.showPin) {
            return (
                <View style={this.b('map-marker__pin')}>
                    <Icon name="MapPin" fill={c('red red')} stroke="#fff" strokeWidth="4" height="30" width="22" />
                </View>
            );
        }

        return null;
    }

    render () {
        return (
            <MapView.Marker
                ref={(ref) => (this.marker = ref)}
                coordinate={{
                    latitude: this.props.coordinate.latitude,
                    longitude: this.props.coordinate.longitude
                }}
                title={this.props.title}
                description={this.props.description}
                calloutOffset={this.props.showPin ? { x: 0, y: markerSize * -1 } : { x: 0, y: 0 }}
            >
                <View style={this.b('map-marker')}>
                    {this._renderMarker()}
                    {this._renderPin()}
                </View>
            </MapView.Marker>
        );
    }
}

MapMarker.defaultProps = {
    isHQ: false,
    number: 1
};

MapMarker.propTypes = {
    coordinate: PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired
    }),
    description: PropTypes.string,
    isHQ: PropTypes.bool,
    number: PropTypes.number,
    showPin: PropTypes.bool,
    title: PropTypes.string.isRequired
};

export default MapMarker;
