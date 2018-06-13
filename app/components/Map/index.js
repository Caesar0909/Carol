// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapView from 'react-native-maps';

import MapMarker from '../MapMarker/';

import { arrayToString } from '../../helpers/utils/array';
import { windowSize } from '../../helpers/windowSize';

class Map extends Component {
    static defaultProps: {
        height: number,
        width: number
    };

    _map: MapView;
    _addresses: Array<any>;
    _headquartersAddress: Object;
    _otherAddresses: Array<any>;

    constructor (props: Object) {
        super(props);

        this._addresses = this.props.addresses.filter((address) => address.latitude && address.longitude);
        this._headquartersAddress = this._addresses.find((address) => address.isHQ);
        this._otherAddresses = this._addresses.filter((address) => !address.isHQ);
    }

    _getFullAddress = (address: Object) => (
        arrayToString([
            address.address1,
            address.address2,
            address.address3,
            address.city,
            address.state,
            address.zipcode,
            address.country
        ])
    )

    componentDidMount () {
        this._addresses.length && setTimeout(() => {
            this._map.fitToCoordinates(
                this._addresses,
                {
                    edgePadding: {
                        bottom: 30,
                        left: 30,
                        right: 30,
                        top: 30
                    },
                    animated: true
                }
            );
        }, 500);
    }

    render () {
        if (!this._addresses.length) {
            return null;
        }

        return (
            <MapView
                ref={(ref) => (this._map = ref)}
                style={{
                    height: this.props.height,
                    width: this.props.width
                }}
                initialRegion={{
                    latitude: 37.387999,
                    longitude: -122.082985,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                }}
                cacheEnabled={this.props.static}
            >
                {this._otherAddresses.map((otherAddress, index) => (
                    <MapMarker
                        key={index}
                        coordinate={{
                            latitude: otherAddress.latitude,
                            longitude: otherAddress.longitude
                        }}
                        title={`Branch ${index + 1}`}
                        description={this._getFullAddress(otherAddress)}
                        isHQ={false}
                        number={index + 1}
                        showPin={otherAddress.selected}
                    />
                ))}

                {this._headquartersAddress && (
                    <MapMarker
                        coordinate={{
                            latitude: this._headquartersAddress.latitude,
                            longitude: this._headquartersAddress.longitude
                        }}
                        title="HQ"
                        description={this._getFullAddress(this._headquartersAddress)}
                        isHQ={true}
                        showPin={this._headquartersAddress.selected}
                    />
                )}
            </MapView>
        );
    }
}

Map.defaultProps = {
    height: 200,
    width: windowSize.width
};

Map.propTypes = {
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
    height: PropTypes.number,
    static: PropTypes.bool,
    width: PropTypes.number
};

export default Map;
