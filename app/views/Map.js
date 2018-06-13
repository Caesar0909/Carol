// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BackgroundView from '../components/BackgroundView/';
import { default as MapComponent } from '../components/Map/';

import { windowSize } from '../helpers/windowSize';

class Map extends Component {
    static route = {
        navigationBar: {
            title: (params) => params.title
        }
    }

    render () {
        return (
            <BackgroundView>
                <MapComponent
                    addresses={this.props.route.params.addresses}
                    height={windowSize.height}
                />
            </BackgroundView>
        );
    }
}

Map.propTypes = {
    navigation: PropTypes.any,
    route: PropTypes.any
};

export default Map;
