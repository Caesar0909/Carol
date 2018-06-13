// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Image, TouchableHighlight } from 'react-native';
import { TabViewAnimated } from 'react-native-tab-view';
import Modal from 'react-native-simple-modal';
// import { Bar } from 'react-native-pathjs-charts';

import Images from '../assets/icons/images/';
import BackgroundView from '../components/BackgroundView/';
import IconButton from '../components/IconButton/';
import Tabs from '../components/Tabs/';
import T from '../components/T/';
import Icon from '../components/Icon/';

import u from '../helpers/utils/utils';
import c from '../helpers/color';


class View360 extends Component {

    state: {
        index: number,
        upcomingIndex: number,
        open: boolean,
        routes: [{
            key: string,
            title: string
        }]
    };

    _shouldScrollToTopAfterTabChange: boolean;

    constructor () {
        super();

        this._shouldScrollToTopAfterTabChange = true;

        this.state = {
            index: 0,
            open: false,
            upcomingIndex: 0,
            routes: [
                {
                    key: 'test1',
                    title: 'Test1'
                }, {
                    key: 'test2',
                    title: 'Test2'
                }, {
                    key: 'test3',
                    title: 'Test3'
                }, {
                    key: 'test4',
                    title: 'Test4'
                }, {
                    key: 'test5',
                    title: 'Test5'
                }
            ]
        };
    }

    static route = {
        navigationBar: null,
        styles: {
            gestures: null
        }
    };

    _back = () => {
        this.props.navigation.back();
    };

    _renderTabScene = ({ route }) => {
        switch (route.key) {
            case 'test1':
                let bar_data = [
                    [{
                        'v': 49,
                        'name': 'apple'
                    }], [{
                        'v': 42,
                        'name': 'Mango'
                    }],
                    [{
                        'v': 69,
                        'name': 'banana'
                    }], [{
                        'v': 62,
                        'name': 'peach'
                    }],
                    [{
                        'v': 29,
                        'name': 'grape'
                    }], [{
                        'v': 15,
                        'name': 'Melon'
                    }]
                ];

                let bar_options = {
                    width: 300,
                    height: 300,
                    margin: {
                        top: 20,
                        left: 25,
                        bottom: 50,
                        right: 20
                    },
                    color: ['#2980B9', '#5980B9', '#f9f009', '#298029', '#29f0B9', '#a980B9'],
                    gutter: 20,
                    animate: {
                        type: 'oneByOne',
                        duration: 2000,
                        fillTransition: 3
                    },
                    axisX: {
                        showAxis: true,
                        showLines: true,
                        showLabels: true,
                        showTicks: true,
                        zeroAxis: false,
                        orient: 'bottom',
                        label: {
                            fontFamily: 'Arial',
                            fontSize: 8,
                            fontWeight: true,
                            fill: '#34495E',
                            rotate: 45
                        }
                    },
                    axisY: {
                        showAxis: true,
                        showLines: true,
                        showLabels: true,
                        showTicks: true,
                        zeroAxis: false,
                        orient: 'left',
                        label: {
                            fontFamily: 'Arial',
                            fontSize: 8,
                            fontWeight: true,
                            fill: '#34495E'
                        }
                    }
                };

                
                return (
                    <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
                        <T>Sample Graph</T>
                        {/* <Bar data={bar_data} options={bar_options} accessorKey='v'/> */}
                    </View>
                );

            case 'week':
                return (
                    <View style={{flex: 1}}>
                    </View>
                );
            case 'month':
                return (
                    <View style={{flex: 1}}>
                    </View>
                );
            default:
                return (
                    <View style={{flex: 1, backgroundColor: 'white'}}>
                    </View>
                );
        }
    }

    // componentDidMount(){
    //      this.addEventListener('hardwareBackPress', this.backHandler);
    // }
    // componentWillUnmount(){
    //      this.removeEventListener('hardwareBackPress', this.backHandler);
    // }
    // backHandler = () => {
    //     this._back();
    // }

    _renderTabHeader = (props: Object) => {
        return (<Tabs {...props} upcomingIndex={this.state.upcomingIndex} mHome={true} mScroll={true}/>);
    };

    _handleTabChange = (index: number) => {
        this.setState({ index });
    };

    _handleUpcomingTabChange = (value: number) => {
        const upcomingIndex = value > 0.5 ? 1 : 0;

        if (this.state.upcomingIndex !== upcomingIndex) {
            this.setState({ upcomingIndex });

            if (upcomingIndex === 1 && this._scrollViewOffsetY > this._insightsHeight) {
                this._shouldScrollToTopAfterTabChange = true;
            }
        }
    };

    render () {
        return (
            <BackgroundView style={[u('spacing-pt-large')]}>
                <Image source={Images.HOMETOP} style={[{position: 'absolute', width: '100%'}]}/>
                <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, u('spacing-mb-small'), u('spacing-mt-default'), u('spacing-ph-default'), {backgroundColor: 'transparent'}]}>
                    <View style={[]}>
                        <IconButton
                            circular={true}
                            color={c('transparent')}
                            fill={c('buttons white primary')}
                            name="ChevronLeft"
                            size= {30}
                            onPress={this._back}
                        />
                        
                    </View>

                    <View style={[{ alignItems: 'center' }]}>
                        <Image source={Images.LOGO} style={[{width: 153, height: 11}]}/>
                    </View>

                    <IconButton
                        circular={true}
                        color={c('transparent')}
                        fill={c('buttons white primary')}
                        name="Hamburger"
                        size={30}
                        onPress={() => this.setState({open: true})}
                    />
                </View>

                <View style={[{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }, u('spacing-mb-small'), u('spacing-mt-default'), u('spacing-ph-default'), {backgroundColor: 'transparent'}]}>

                    <View style={[{ alignItems: 'center'}, u('spacing-pr-default')]}>
                        <Image source={Images.LOGO} style={[{width: 30, height: 30}]}/>
                    </View>
                    <T>Heading Here</T>
                </View>

                <Modal
                    open={this.state.open}
                    modalDidOpen={() => console.log('modal did open')}
                    modalDidClose={() => this.setState({open: false})}
                    overlayBackground={'transparent'}
                    containerStyle={{
                        position: 'absolute',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        flex: 1,
                        zIndex: 555
                    }}
                    modalStyle={{
                        alignItems: 'center',
                        height: 100,
                        width: 120,
                        top: 45,
                        margin: 10
                    }}>
                    <View>
                    
                        <TouchableOpacity
                            style={{margin: 5}}
                            onPress={() => this.setState({open: false})}>
                            <T>Menu1</T>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{margin: 5}}
                            onPress={() => this.setState({open: false})}>
                            <T>Menu2</T>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{margin: 5}}
                            onPress={() => this.setState({open: false})}>
                            <T>Menu3</T>
                        </TouchableOpacity>
                    </View>
                </Modal>
                

                <TabViewAnimated
                    style={{flex: 1}}
                    navigationState={this.state}
                    renderScene={this._renderTabScene}
                    renderHeader={this._renderTabHeader}
                    onRequestChangeTab={this._handleTabChange}
                    onChangePosition={this._handleUpcomingTabChange}
                    onIndexChange={this._handleUpcomingTabChange}
                />
                <View style= {[{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: c('purple dark')}, u('spacing-pv-default')]}>
                    <TouchableHighlight
                        onPress = {this._back}>
                        <View
                            style={{alignItems: 'center'}}>
                            <Icon
                                name="Hamburger"
                                fill={'white'}
                                size={20}/>
                            <T>Test</T>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress = {this._back}
                    >
                        <View
                            style={{alignItems: 'center'}}>
                            <Icon
                                name="Star"
                                fill={'white'}
                                size={20}/>
                            <T>Test</T>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress = {this._back}
                    >
                        <View
                            style={{alignItems: 'center'}}>
                            <Icon
                                name="LogoFacebook"
                                fill={'white'}
                                size={20}/>
                            <T>Test</T>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress = {this._back}
                    >
                        <View
                            style={{alignItems: 'center'}}>
                            <Icon
                                name="Bell"
                                fill={'white'}
                                size={20}/>
                            <T>Test</T>
                        </View>
                    </TouchableHighlight>
                </View>
            </BackgroundView>
        );
    }
}

View360.propTypes = {
    navigation: PropTypes.any
};

export default View360;
