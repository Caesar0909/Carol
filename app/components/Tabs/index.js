// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, View } from 'react-native';
import { TabBar } from 'react-native-tab-view';
import bem from 'react-native-bem';

import T from '../T/';
import Icon from '../Icon/';

import c from '../../helpers/color';
import styles from './styles';

class Tabs extends Component {
    b (selector: string) {
        return bem(selector, this.props, styles);
    }

    _renderIndicator = (props: Object) => { // props are actually passed in from react-native-tab-view/TabBar.js
        const { position, width } = props;
        const translateX = Animated.multiply(position, new Animated.Value(width));

        if (this.props.mHome) {
            return (
                <Animated.View style={[this.b('tab-indicator'), { width, transform: [{ translateX }] }]}>
                    <View style={[this.b('tab-indicator__inner'), { height: 3, backgroundColor: '#b79dd1', marginTop: 12}]}>
                    </View>
                </Animated.View>
            );
        }
        
        return (
            <Animated.View style={[this.b('tab-indicator'), { width, transform: [{ translateX }] }]}>
                <View style={this.b('tab-indicator__inner')}>
                    <Icon name="ArrowDown" fill={c('red raddish')} width="13" height="13" />
                </View>
            </Animated.View>
        );
    }

    _renderLabel = () => {
        if (this.props.mHome === true) {
            return (props: Object) => ( // props are actually passed in from react-native-tab-view/TabBar.js
                <T style={[this.b('tab-label'), {color: '#fff'}]}>
                    {props.route.title}
                </T>
            );
        }
        
        return (props: Object) => ( // props are actually passed in from react-native-tab-view/TabBar.js
            <T style={[this.b('tab-label'), this.props.upcomingIndex === props.index ? { color: c('red raddish')} : null]}>
                {props.route.title}
            </T>
        );
    }

    _renderHeader = () => {
        // console.log(this.props.upcomingIndex);
        if (this.props.mHome ) {
            if (this.props.mScroll) {
                return (
                    <TabBar
                        {...this.props}
                        style={this.b('tabs--home')}
                        renderIndicator={this._renderIndicator}
                        renderLabel={this._renderLabel()}
                        scrollEnabled={true}
                    />
                );
            }
            
            return (
                    <TabBar
                        {...this.props}
                        style={this.b('tabs--home')}
                        renderIndicator={this._renderIndicator}
                        renderLabel={this._renderLabel()}
                    />
            );
        }
        
        return (
            <TabBar
                {...this.props}
                style={this.b('tabs')}
                renderIndicator={this._renderIndicator}
                renderLabel={this._renderLabel()}
            />
        );
    }

    render () {
        return this._renderHeader();
    }
}

Tabs.propTypes = {
    position: PropTypes.object,
    upcomingIndex: PropTypes.number.isRequired,
    width: PropTypes.number,
    mHome: PropTypes.bool,
    mScroll: PropTypes.bool
};

export default Tabs;
