// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Platform, Image } from 'react-native';
import Video from 'react-native-video';

import IconButton from '../components/IconButton/';
import { windowSize } from '../helpers/windowSize';

class FullScreen extends Component {
    state: {
        url: string,
        type: string
    };

    constructor (props: Object) {
        super(props);
        this.state = {
            url: props.route.params.url,
            type: props.route.params.type
        };

    }

    static route = {
        navigationBar: null,
        styles: {
            gestures: null
        }
    };

    componentDidMount () {
    }

    componentWillUnmount () {
    }

    _exit = () => {
        this.props.navigation.back();
    };

    _renderContent = () => {
        if (this.state.type === 'video') {
            return (
                <View >
                    <Video source={{uri: this.state.url}}
                        ref={(ref) => {
                            this.player = ref;
                        }}
                        paused = {false}
                        style={{width: windowSize.width - 50, height: 200}}
                        resizeMode="cover"
                        repeat={false}
                        onLoadStart={() => {
                            this.player.presentFullscreenPlayer();
                        }}
                        onFullscreenPlayerWillDismiss={() => {
                            setTimeout(() => { this._exit(); }, 200);
                        }}
                        key="video2" />
                </View>
            );
        }
        
        return (
            <Image
                style={{resizeMode: 'contain', width: '100%', height: '100%'}}
                source={{uri: this.state.url}}/>
        );
    };

    _renderTop = () => {
        if (Platform.OS !== 'android') {
            return (
                <View
                    style={{paddingLeft: 7, marginTop: -10, height: 30}}>
                    
                </View>
            );
        }
        
        return null;
    };

    render () {
        return (
            <View style={{flex: 1, backgroundColor: 'black'}}>
                {this._renderTop()}
                <View
                    style={{paddingTop: 5, paddingLeft: 5, opacity: this.state.type === 'video' && Platform.OS !== 'android' ? 0 : 1}}
                >
                    <IconButton
                        circular = {true}
                        color={'transparent'}
                        hollow = {false}
                        fill={'#999'}
                        name="ChevronLeft"
                        size={30}
                        onPress={this._exit}
                    />
                </View>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    {this._renderContent()}
                </View>
            </View>
        );
    }
}

FullScreen.propTypes = {
    navigation: PropTypes.any,
    route: PropTypes.any
};

export default FullScreen;
