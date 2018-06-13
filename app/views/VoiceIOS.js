// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, View, Image, NativeAppEventEmitter, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import SpeechToText from 'react-native-speech-to-text-ios';
import I18n from 'react-native-i18n';
import Tts from 'react-native-tts';
import Video from 'react-native-video';
import HTML from 'react-native-render-html';
import Sound from 'react-native-sound';
import * as Animatable from 'react-native-animatable';
import YouTube from 'react-native-youtube';
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import InteractionProvider from 'react-native-interaction-provider';

import BackgroundView from '../components/BackgroundView/';
import Spinner from '../components/Spinner/';
import StatBox from '../components/StatBox/';
import T from '../components/T/';
import IconButton from '../components/IconButton/';
import Icon from '../components/Icon/';
import Bubble from '../components/Bubble/';
import Images from '../assets/icons/images/';
import ShadowView from '../components/ShadowView';

import { windowSize, ratio } from '../helpers/windowSize';


import { Bar, Pie, SmoothLine, StockLine } from 'react-native-pathjs-charts';

import u from '../helpers/utils/utils';
import c from '../helpers/color';

import AIService from '../services/AIService';

import { connect } from 'react-redux';
import {hideBottomBar, showBottomBar} from '../reduxes/actions';


const mapDispatchToProps = dispatch => ({
    hideBottomBar: () => dispatch(hideBottomBar()),
    showBottomBar: () => dispatch(showBottomBar())
});


class VoiceIOS extends Component {

    static propTypes = {
        hideBottomBar: PropTypes.func,
        showBottomBar: PropTypes.func
    };

    state: {
        stateText: string,
        responseText: string,
        // showSpinner: boolean,
        showresponse: boolean,
        showspeech: boolean,
        showthanks: boolean,
        micState: boolean,
        // msgId: string,
        showrichresponse: boolean,
        attScore: string,
        allAttend: string,
        recState: number,
        peak: number,
        message: string,
        keyHeight: number,
        textQuestion: string,
        richContent: Array<Object>,
        paused: boolean,
        videoData: Array<Object>,
        audioData: Array<Object>,
        stBoxData: Array<Object>,
        fURL: string,
        fType: string,
        btmCompact: boolean,
        questions: Array<Object>,
        relatedTopics: Array<Object>,
        suggestedQuestions: Array<String>,
        welcomeData: Array<Object>,
        welcomeState: boolean,
        isActive: boolean,
        changeScreen: number,
        status: string,  //Video playing status
        ttsStatus: string
    };

    player: Object;
    xTickValues: Array<Object>;
    line_options: Object;
    bar_options: Object;
    pie_options: Object;
    bottomBarHeight: number;
    bottomView: Object;
    contentView: Object;
    

    constructor (props) {
        super(props);
        
        this.state = {
            stateText: '',
            richContent: [],
            responseText: 'You have 200 customers.',
            // showSpinner: false,
            micState: true,
            showrichresponse: false,
            showspeech: false,
            recState: 1,
            peak: 36,
            keyHeight: 0,
            message: '',
            paused: true,
            stBoxData: [],
            videoData: [],
            audioData: [],
            questions: [],
            fURL: '',
            fType: '',
            btmCompact: true,
            relatedTopics: [],
            suggestedQuestions: [],
            welcomeData: [],
            welcomeState: false,
            isActive: true,
            changeScreen: 0,
            status: 'start',
            ttsStatus: 'stop'
        };

        this.line_options = {
            width: windowSize.width - 50 * ratio - 60,
            height: windowSize.width - 50 * ratio - 60,
            color: '#2980B9',
            margin: {
                top: 30,
                left: 15,
                bottom: 35,
                right: 30
            },
            animate: {
                type: 'delayed',
                duration: 200
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
                    fontSize: 14,
                    fontWeight: true,
                    fill: '#34495E'
                },
                tickValues: []
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
                    fontSize: 10,
                    fontWeight: true,
                    fill: '#34495E'
                }
            }
        };

        this.bar_options = {
            width: windowSize.width - 114,
            height: windowSize.width - 114,
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

        this.pie_options = {
            margin: {
                top: 20,
                left: 20,
                right: 20,
                bottom: 20
            },
            width: windowSize.width - 50 * ratio - 60,
            height: windowSize.width - 50 * ratio - 60,
            color: '#2980B9',
            r: 50,
            R: 150,
            legendPosition: 'topLeft',
            animate: {
                type: 'oneByOne',
                duration: 200,
                fillTransition: 3
            },
            label: {
                fontFamily: 'Arial',
                fontSize: 8,
                fontWeight: true,
                color: '#ECF0F1'
            }
        };
        this.xTickValues = [];

        Tts.setDefaultLanguage('pt-BR');

        Tts.addEventListener('tts-start', (event) => { this._clearTimeout(); this.setState({ttsStatus: 'speak'}); });
        Tts.addEventListener('tts-finish', (event) => { this._onInActive(); this.setState({ttsStatus: 'stop'}); });
        Tts.addEventListener('tts-cancel', (event) => { this._onInActive(); this.setState({ttsStatus: 'stop'}); });

        setInterval(() => {
            if (this.state.peak < 36) {
                this.setState({peak: this.state.peak + 2});
            }
        }, 30);
        this.bottomBarHeight = 86 * ratio;

        AIService.sendQuestion('initial', (successResult) => {

            
            if (successResult.data !== undefined) {
                this.setState({suggestedQuestions: successResult.relatedSkills, welcomeData: successResult.data, welcomeState: true});
            }
            else {
                this.setState({suggestedQuestions: successResult.relatedSkills, welcomeState: true});
            }
        }, (failResult) => {
        });
    }

    static route = {
        navigationBar: null
    };

    _actionMic = () => {
        Tts.stop();
        if (this.state.micState === true && this.state.recState === 1) {
            
            this.setState({ stateText: '', micState: false, recState: 2, showspeech: true, showresponse: false, showrichresponse: false });

            // setTimeout(() => {
            //     if ( this.state.stateText === '' ) {
            //         this.setState({micState: true, recState: 1});
            //         setTimeout(() => this._actionMic(), 50);
            //     }
            // }, 1500);
            
            this._startListen();
        }
    };

    _goFullScreen = () => {
        this.props.navigation.navigate('fullScreen', { url: this.state.fURL, type: this.state.fType });
    };

    _generateRichResponse = (type, content, wd, ht, url, dt, opt, tcolor) => {
        switch (type) {
            case 'text':
                if (!tcolor) {
                    return (<T style={{color: '#333'}}>{content}</T>);
                }

                return (<T style={{color: tcolor}}>{content}</T>);
            case 'html':
                return (<HTML html={content} baseFontStyle={{color: '#333', fontSize: 14 * ratio, fontFamily: 'SF UI Text'}}/>);
            case 'image':
                return (
                    <View>
                        
                        <TouchableOpacity onPress={() => {
                            //this.setState({paused: !this.state.paused});
                            this.setState({fURL: url, fType: 'image'});
                            setTimeout(() => { this._goFullScreen(); }, 200);
                        }}>
                            <Image
                                style={{width: wd, height: ht, alignSelf: 'center'}}
                                source={{uri: url}}
                            />
                        </TouchableOpacity>
                        <T style={{
                            color: c('black main'),
                            fontSize: 18
                        }}>{content}</T>
                    </View>
                );
            case 'audio':
                return (
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => {
                            this._playTrack(url);
                        }}>
                            <T>Play</T>
                        </TouchableOpacity>
                    </View>
                );
            case 'video':
                let reg = /v=(.*)&/i;
                let reg1 = /v=(.*)/i;
                let match = url.match(reg);
                let match1 = url.match(reg1);

                if (match) {
                    return (<View><YouTube
                        videoId={match[1]} // The YouTube video ID
                        play={false} // control playback of video with true/false
                        fullscreen={true} // control whether the video should play in fullscreen or inline
                        loop={false} // control whether the video should loop when ended
    
                        onReady={e => this.setState({ isReady: true })}
                        onChangeState={(e) => { this._changeStatus(e); }}
                        onChangeQuality={e => this.setState({ quality: e.quality })}
                        onError={e => this.setState({ error: e.error })}
                        onChangeFullscreen={e => this._changeScreen(e)}
    
                        style={{ alignSelf: 'stretch', height: windowSize.width * 9 / 16 }}
                    /></View>);
                }

                if (match1) {
                    return (<View><YouTube
                        videoId={match1[1]} // The YouTube video ID
                        play={false} // control playback of video with true/false
                        fullscreen={true} // control whether the video should play in fullscreen or inline
                        loop={false} // control whether the video should loop when ended
    
                        onReady={e => this.setState({ isReady: true })}
                        onChangeState={(e) => { this._changeStatus(e); }}
                        onChangeQuality={e => this.setState({ quality: e.quality })}
                        onError={e => this.setState({ error: e.error })}
                        onChangeFullscreen={e => this._changeScreen(e)}
    
                        style={{ alignSelf: 'stretch', height: windowSize.width * 9 / 16 }}
                    /></View>);
                }

                return (<View><YouTube
                    videoId="1r-cbWaioJY" // The YouTube video ID
                    play={false} // control playback of video with true/false
                    fullscreen={true} // control whether the video should play in fullscreen or inline
                    loop={false} // control whether the video should loop when ended

                    onReady={e => this.setState({ isReady: true })}
                    onChangeState={(e) => { this._changeStatus(e); }}
                    onChangeQuality={e => this.setState({ quality: e.quality })}
                    onChangeFullscreen={e => this._changeScreen(e)}
                    onError={e => this.setState({ error: e.error })}

                    style={{ alignSelf: 'stretch', height: windowSize.width * 9 / 16 }}
                /></View>);
            case 'chart-bar':
                return (<View>
                    <T>{content}</T>
                    <Bar data={dt} options={opt} accessorKey='value'/>
                </View>);
            case 'chart-pie':
                return (<View>
                    <T>{content}</T>
                    <Pie data={dt}
                        options={opt}
                        accessorKey="pop"
                        margin={{top: 0, left: 0, right: 20, bottom: 20}}
                        color="#2980B9"
                        pallete={
                            [
                                {'r': 25, 'g': 99, 'b': 201},
                                {'r': 24, 'g': 175, 'b': 35},
                                {'r': 190, 'g': 31, 'b': 69},
                                {'r': 100, 'g': 36, 'b': 199},
                                {'r': 214, 'g': 207, 'b': 32},
                                {'r': 198, 'g': 84, 'b': 45}
                            ]
                        }
                        r={50}
                        R={(windowSize.width - 50 * ratio - 60) / 2}
                        legendPosition="topLeft"
                        label={{
                            fontFamily: 'Arial',
                            fontSize: 8,
                            fontWeight: true,
                            color: '#ECF0F1'
                        }}
                    />
                </View>);
            case 'chart-line':
                return (<View>
                    <SmoothLine data={dt} options={opt} pallete={
                        [
                            {'r': 25, 'g': 99, 'b': 201},
                            {'r': 24, 'g': 175, 'b': 35}
                        ]
                    } xKey='x' yKey='y' />
                </View>);
            case 'chart-line-b':
                return (<View>
                    <StockLine data={dt} options={opt} pallete={
                        [
                            {'r': 25, 'g': 99, 'b': 201},
                            {'r': 24, 'g': 175, 'b': 35}
                        ]} xKey='x' yKey='y' />
                </View>);
            default:
                break;
        }
    };

    _changeStatus = (e) => {
        if (e.state === 'buffering' || e.state === 'playing') {
            Tts.stop();
        }
        this.setState({ status: e.state });
    }

    _changeScreen = (e) => {
        if (this.state.changeScreen % 2 === 1) {
            this._onInActive();
        } else {
            this._clearTimeout();
        }
        this.setState({ changeScreen: this.state.changeScreen + 1 });
    }

    _generateLineData = (data) => {
        let tempData = {
            series: [
                { label: 'Serie 1', values: [10, 5, 11, 7] },
                { label: 'Serie 2', values: [null, null, 9, 1] }
            ],
            xAxis: ['10/2017', '11/2017', '12/2017', '01/2018'],
            showLegend: false
        };
        let vdata = [];

        for (let i = 0; i < tempData.series.length; i++) {
            let series = tempData.series[i];
            let sPoints = [];

            for (let j = 0; j < series.values.length; j++) {
                if (series.values[j] !== null && series.values[j] !== 'null') { sPoints.push({'x': j, 'y': series.values[j]}); }
            }
            vdata.push(sPoints);
        }

        let ticks = [];

        for (let i = 0; i < tempData.xAxis.length; i++) {
            ticks.push({value: tempData.xAxis[i]});
        }
        this.xTickValues = [];
        this.xTickValues = ticks;
        
        return vdata;
    };

    splitter = (str, l) => {
        let strs = [];

        while (str.length > l) {
            let pos = str.substring(0, l).lastIndexOf(' ');

            pos = pos <= 0 ? l : pos;
            strs.push(str.substring(0, pos));
            let i = str.indexOf(' ', pos) + 1;

            if (i < pos || i > pos + l) {
                i = pos;
            }
            str = str.substring(i);
        }
        strs.push(str);
        
        return strs;
    }

    _stopMic = () => {

        SpeechToText.stopRecognition();
        // SpeechToText.finishRecognition();
        let that = this;
        let tempQ = this.state.questions;
        let qText = that.state.stateText;

        qText = qText.replace('tortes', 'TOTVS');
        qText = qText.replace('toes', 'TOTVS');
        qText = qText.replace('to tes', 'TOTVS');
        qText = qText.replace('todus', 'TOTVS');
        qText = qText.replace('totus', 'TOTVS');
        qText = qText.replace('totos', 'TOTVS');
        qText = qText.replace('tortos', 'TOTVS');
        qText = qText.replace('todos', 'TOTVS');

        tempQ.push({text: qText, id: tempQ.length});
        this.setState({ micState: true, recState: 3, stBoxData: [], questions: tempQ });
        that._clearTimeout();
        setTimeout(() => {
            AIService.sendQuestion(qText, (successResult) => {
                // console.log(successResult);
                if (successResult.understand === undefined) {
                    successResult.understand = successResult.recognized;
                    successResult.response = successResult.message;
                }
                let rich = [];
                let data = successResult.data;
                let vData = {};
                let auData = {};

                data.forEach((item) => {
                    item.content = item.content ? item.content : '';

                    if (item.content.length > 700) {

                        let contentArr = this.splitter(item.content, 700);

                        let length = item.content.length;

                        for (let i = contentArr.length - 1; i >= 1; i--) {

                            rich.push(that._generateRichResponse('text', contentArr[i]));
                        }

                        item.content = contentArr[0];
                    }
                    if (item.type.indexOf('chart') === -1 && item.type !== 'number-box' && item.type !== 'video' && item.type !== 'audio' && that.state.stateText !== 'demo-audio') {
                        rich.push(that._generateRichResponse(item.type, item.content ? item.content : '', item.width, item.height, item.url ? item.url : '', {}, {}));
                    }
                    
                    if (item.type === 'video') {
                        rich.push(item);
                    }
                    if (that.state.stateText === 'demo-audio') {
                        auData = item;
                        auData = {'url': 'http://www.sample-videos.com/audio/mp3/crowd-cheering.mp3', 'type': 'audio'};
                        rich.push(auData);
                    }
                    if (that.state.stateText === 'demo-chart-line-b') {
                        let temp = [[{x: '1', y: -5},
                            {x: '2', y: 4.3},
                            {x: '3', y: 3.2},
                            {x: '4', y: 9.99}],
                        [{x: '1', y: 1},
                            {x: '2', y: 2},
                            {x: '3', y: 2.3},
                            {x: '4', y: 2.1}]];
                        let line_data = that._generateLineData(temp);
                        
                        that.line_options.axisX.tickValues = that.xTickValues;
                        rich.push(that._generateRichResponse('chart-line-b', item.content ? item.content : '', item.width, item.height, '', line_data, that.line_options));
                    }
                    if (item.type === 'chart-line') {
                        // console.log(item);
                        // let line_data = that._generateLineData(item.data);
                        
                        // that.line_options.axisX.tickValues = that.xTickValues;
                        rich.push(that._generateRichResponse(item.type, item.content ? item.content : '', item.width, item.height, '', item.data, that.line_options));
                    }
                    if (item.type === 'chart-pie') {
                        rich.push(that._generateRichResponse(item.type, item.content ? item.content : '', item.width, item.height, '', item.data, that.pie_options));
                    }
                    if (item.type === 'chart-bar') {
                        rich.push(that._generateRichResponse(item.type, item.content ? item.content : '', item.width, item.height, '', [item.data], that.bar_options));
                    }

                    if (item.type === 'number-box') {
                        that.setState({
                            stBoxData: item.data
                        });
                    }
                    
                });

                if (successResult.recognized !== true) {
                    rich.push(that._generateRichResponse('text', I18n.t(['voice', 'misUnderstand'])));
                }

                rich.reverse();

                let tempRich = this.state.richContent;

                tempRich.push(rich);
                
                let tempRelated = [];

                if (successResult.relatedSkills !== undefined) {
                    tempRelated = successResult.relatedSkills.map((item) => {
                        return {status: 0, text: item};
                    });
                }

                if (successResult.understand === 'true' || successResult.understand === true) {
                    that.setState({
                        // showSpinner: false,
                        responseText: successResult.voiceMessage,
                        // msgId: successResult.id,
                        richContent: tempRich,
                        // videoData: vData,
                        showresponse: true,
                        showrichresponse: false,
                        relatedTopics: tempRelated
                        // audioData: auData
                    });

                    let speak_str = that.state.responseText;

                    speak_str = speak_str.replace(/(\d+),(\d+)/g, '$1$2');
                    speak_str = speak_str.replace(/(\d+),(\d+)/g, '$1$2');
                    speak_str = speak_str.replace(/(\d+),(\d+)/g, '$1$2');
                    speak_str = speak_str.replace('TOTVS', 'totvs');
                    if (this.state.status === 'start' || this.state.status === 'ended') {
                        Tts.speak(speak_str);
                    }
                    
                }
                else {
                    that.setState({
                        // showSpinner: false,
                        responseText: successResult.voiceMessage,
                        // msgId: 0,
                        showrichresponse: false,
                        showresponse: true,
                        richContent: tempRich
                        // videoData: vData,
                        // audioData: auData
                    });

                    let speak_str = that.state.responseText;
                    
                    speak_str = speak_str.replace(/(\d+),(\d+)/g, '$1$2');
                    speak_str = speak_str.replace(/(\d+),(\d+)/g, '$1$2');
                    speak_str = speak_str.replace(/(\d+),(\d+)/g, '$1$2');
                    speak_str = speak_str.replace('TOTVS', 'totvs');
                    if (this.state.status === 'start' || this.state.status === 'ended') {
                        Tts.speak(speak_str);
                    }
                    
                }
                setTimeout(() => {
                    that.setState({recState: 1});
                    that._onInActive();
                }, 2500);
            }, (failResult) => {
                
                // let rich = [];
                
                // rich.push(that._generateRichResponse('text', 'Sorry, I don\'t know the answer for that question'));
                // let tempRich = this.state.richContent;
                
                // tempRich.push(rich);
                // that.setState({
                //     showSpinner: false,
                //     responseText: 'Desculpe, eu não compreendi',
                //     // msgId: 0,
                //     showrichresponse: false,
                //     showresponse: true,
                //     // richContent: tempRich
                // });
                // setTimeout(() => {
                //     that.setState({recState: 1});
                // }, 2500);
                // Tts.speak('Desculpe, eu não compreendi');
            });
        }, 100);
    };

    _checkfinish = (res) => {
        console.log(res);
        if (res === this.state.stateText && this.state.micState === false) {
            this._stopMic();
        }
    };

    _startListen = () => {
        
        if (this.subscription !== null && this.subscription !== undefined) {
            this.subscription.remove();
            this.subscription = null;
        }
        if (this.subscription1 !== null && this.subscription !== undefined) {
            this.subscription1.remove();
            this.subscription1 = null;
        }
        this.subscription = NativeAppEventEmitter.addListener(
            'SpeechToText',
            (result) => {
                
                if (result.error) {
                    console.log(JSON.stringify(result.error));
                }
                else if (this.state.micState === false) {
                    let that = this;

                    this.setState({ stateText: result.bestTranscription.formattedString });
                    setTimeout( () => { that._checkfinish(result.bestTranscription.formattedString); }, 2000 );
                }
            });
        
        this.subscription1 = NativeAppEventEmitter.addListener(
            'getPeak',
            (result) => {
                this.setState({ peak: 0 });
            });

        SpeechToText.startRecognition('pt-BR');
        
    };

    componentWillMount () {
        this.props.hideBottomBar();
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardDidHide);
        
    }

    componentWillUnmount () {
        this.props.showBottomBar();
        if (this.subscription !== null && this.subscription !== undefined) {
            this.subscription.remove();
            this.subscription = null;
        }
        if (this.subscription1 !== null && this.subscription1 !== undefined) {
            this.subscription1.remove();
            this.subscription1 = null;
        }
        if (this.state.micState === false) {
            SpeechToText.stopRecognition();
            SpeechToText.finishRecognition();
        }
        
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = (e) => {
        if (this.state.btmCompact) {
            this.setState({ keyHeight: e.endCoordinates.height });
            setTimeout(() => this.scrollView.scrollToEnd({animated: false}), 100);
        }
        else {
            Keyboard.dismiss();
        }
            
    };

    _keyboardDidHide = () => {
        if (this.state.btmCompact) {
            this.setState({ keyHeight: 0 });
        }
    };

    _renderSpeech = (strText) => {
        // if (this.state.showspeech && this.state.stateText.length > 0) {
        if (strText.length > 0) {
            return (
                <Bubble
                    width = {windowSize.width - 50 * ratio}
                    flow = {'right'}
                    Bcolor = {c('purple border')}
                >
                    <T style={{color: c('purple border')}}>{strText}</T>
                    
                </Bubble>
            );
        }
        
        return null;
    };

    _renderResponse = () => {
        // if (this.state.showresponse) {
        let count = -1;
        let clonQuestions = _.clone(this.state.questions);

        clonQuestions.reverse();
        
        return clonQuestions.map((question) => {
            count++;
            
            return (
                <View key={question.id}>
                    {this._renderSpeech(question.text)}
                    {this.state.richContent[clonQuestions.length - count - 1] && this._renderStatBox(this.state.richContent[clonQuestions.length - count - 1], (question.id + 1) * 100)}
                </View>
            );
        });
    };

    _exit = () => {
        this.props.navigation.goBack();
    };

    _renderStatBox = (Data, index) => {
        let count = 0;

        return Data.map((item) => {
            count++;
            if (item.type === 'video') {
                return (
                    <View key={index + count}>
                        <Bubble width = {windowSize.width - 50 * ratio} MType = "rich">
                            {this._generateRichResponse(item.type, '', item.width, item.height, item.url, {}, {})}
                        </Bubble>
                    </View>);
            }
            if (item.type === 'audio') {
                return (
                    <View key={index + count}>
                        <Bubble width = {windowSize.width - 50 * ratio} MType = "rich">
                            {this._generateRichResponse(item.type, '', 0, 0, item.url, {}, {})}
                        </Bubble>
                    </View>);
            }
            
            return (
                <View key={index + count}>
                    <Bubble width = {windowSize.width - 50 * ratio} MType = "rich">
                        {item}
                    </Bubble>
                </View>);
        });
    };

    _sendTextQuestion = (question) => {
        Tts.stop();
        
        if (question.dispatchConfig) {
            this.setState({stateText: this.state.message, micState: false, recState: 2, showspeech: true, showresponse: false, showrichresponse: false, keyHeight: 0, btmCompact: true});
        }
        else {
            this.setState({stateText: question, micState: false, recState: 2, showspeech: true, showresponse: false, showrichresponse: false, keyHeight: 0, btmCompact: true});
        }
        let that = this;

        setTimeout(() => { that._stopMic(); }, 100);
        if (question.dispatchConfig) {
            this.setState({message: ''});
        }
    };

    _renderMic = () => {
                
        return (<LinearGradient
            colors={[c('purple active'), c('purple main')]}
            style={[{
                borderRadius: 28 * ratio,
                marginTop: -29 * ratio,
                width: 56 * ratio,
                height: 56 * ratio,
                alignItems: 'center',
                justifyContent: 'center',
                paddingRight: 2
            }]}
        >
            {
                this.state.recState === 2 && <View style={{opacity: (100 - this.state.peak * 3) / 100, position: 'absolute', width: 38 + this.state.peak, height: 38 + this.state.peak, left: (28 * ratio - this.state.peak) / 2, top: (28 * ratio - this.state.peak) / 2, borderColor: 'white', borderWidth: 3, backgroundColor: 'transparent', borderRadius: 38}}>
                </View>
            }
            {
                this.state.recState === 3 && <Spinner style={{position: 'absolute', left: 3 * ratio, top: 3 * ratio}} size={50 * ratio} fill={'white'} />
            }
            <TouchableOpacity onPress={this._actionMic}>
                <Icon
                    color={'transparent'}
                    hollow = {false}
                    fill={'white'}
                    name="Microphone"
                    width={20 * ratio}
                    height={26 * ratio} />
            </TouchableOpacity>
        </LinearGradient>
        );
        
    };

    _playTrack = (url) => {
        const track = new Sound(url, null, (e) => {
            if (e) {
                console.log('error loading track:', e);
            }
            else {
                track.play();
            }
        });
    };

    _renderRelatedTopics = () => {

        let wd = windowSize.width;
        
        wd = (wd - 36 * ratio) / 7 * 3;
        if (this.state.questions.length === this.state.richContent.length && this.state.questions.length > 0) {
            return this.state.relatedTopics.map((item) => {
                return (
                    
                    <ShadowView key={'rtopics' + item.text} style = {{
                        width: wd,
                        height: 148 * ratio,
                        paddingHorizontal: 14 * ratio,
                        paddingVertical: 10 * ratio,
                        justifyContent: 'space-between',
                        backgroundColor: 'white',
                        borderWidth: 0.3,
                        borderColor: '#D5DBFE',
                        marginRight: 15 * ratio,
                        borderRadius: 7,
                        shadowColor: '#000000',
                        shadowOpacity: 0.15
                    }}>
                        <T style={{
                            color: c('newgray text')
                        }}>{item.text}</T>
                        <TouchableOpacity style = {{
                            height: 29 * ratio,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: item.status === 0 ? c('purple border') : '#9B9B9B',
                            borderRadius: 3
                        }} onPress = {() => {
                            item.status = 1;
                            this._sendTextQuestion(item.text);
                        }}>
                            <T style={{
                                color: 'white'
                            }}>
                                {item.status === 1 && 'Asked'}
                                {item.status === 0 && 'Ask'}
                            </T>
                        </TouchableOpacity>
                    </ShadowView>
                );
            });
        }

        return null;
    }

    _renderWelcome = () => {
        if (!this.state.welcomeState) {
            return null;
        }
        if (this.state.welcomeData.length > 0) {
            return (<Bubble
                width = {windowSize.width - 50 * ratio}
            >
                {this._generateRichResponse(this.state.welcomeData[0].type, this.state.welcomeData[0].content)}
            </Bubble>);
        }
        
        return (<Bubble
            width = {windowSize.width - 50 * ratio}
        >
            <T Mbubble={true} style={{fontWeight: 'bold'}}>{I18n.t(['voice', 'welcomeHeading'])}</T>
            <T Mbubble={true}>{I18n.t(['voice', 'welcomeBody'])}</T>
        </Bubble>);
    }

    _onActive = () => {
        this.setState({isActive: true});
        this._clearTimeout();
    }

    _clearTimeout = () => {
        // this.timeout = null;
        clearTimeout(this.timeout);
    }

    _onInActive = () => {
        this.setState({isActive: false});
        this._clearTimeout();
        this.timeout = setTimeout(() => {
            if (this.state.recState === 1 && this.state.changeScreen % 2 === 0 && this.state.ttsStatus === 'stop' && (this.state.status === 'start' || this.state.status === 'ended')) {
                if (this.state.btmCompact) {
                    this.setState({keyHeight: this.state.btmCompact ? 256 : 0, btmCompact: !this.state.btmCompact});
                }
                setTimeout(() => { Keyboard.dismiss(); this.scrollView.scrollToEnd({animated: false}); }, 50);
            }
            this._clearTimeout();
        }, 9000);
    }

    render () {
        // this.props.hideBottomBar();
        
        return (
            <InteractionProvider
                timeout={1 * 1000} // idle after 5s
                onActive={() => this._onActive()}
                onInactive={() => this._onInActive()}
            >
                <BackgroundView
                    Mwhite={true}>
                    <View
                        style={{paddingLeft: 7, marginTop: -10, height: 30}}>
                    </View>
                    
                    <View
                        style={{paddingLeft: 19, marginTop: 18}}
                    >
                        <IconButton
                            color={c('transparent')}
                            fill={c('black light')}
                            name="BackArrow"
                            size= {24 * ratio}
                            onPress={this._exit}/>
                    </View>
                    
                    <Animatable.View
                        duration={400}
                        style={[{
                            height: '100%',
                            marginBottom: -65 - this.bottomBarHeight - this.state.keyHeight,
                            paddingBottom: 65 + this.bottomBarHeight + this.state.keyHeight}, u(['spacing-ph-zero', 'spacing-pv-default'])]}
                        ref={(ref) => {
                            this.contentView = ref;
                        }}>
                        <ScrollView style={{paddingBottom: 30}}
                            ref={(ref) => { this.scrollView = ref; }}
                            onContentSizeChange={(contentWidth, contentHeight) => {
                                this.scrollView.scrollToEnd({animated: true});
                            }}>
                            <View style={[u('spacing-mb-small'), {flexDirection: 'column-reverse', flex: 1, minHeight: windowSize.height - 85 * ratio - this.bottomBarHeight}]}>
                                { (this.state.questions.length === this.state.richContent.length && this.state.questions.length > 0 && this.state.relatedTopics.length > 0) && <View>
                                    <T style={{color: c('purple border'), marginLeft: 19}}>Some related topics:</T>
                                    <ScrollView
                                        horizontal= {true}
                                        style={{paddingVertical: 12}}
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        <View style={{height: 10, width: 6}}></View>
                                        {this._renderRelatedTopics()}
                                    </ScrollView>
                                </View> }
                                {this._renderResponse()}
                                {this._renderWelcome()}
                                
                                
                            </View>
                            <View style={{height: 30}}></View>
                        </ScrollView>
                    </Animatable.View>
                    
                    <Animatable.View style={{
                        alignItems: 'center',
                        backgroundColor: c('purple dark'),
                        marginBottom: 0,
                        height: !this.state.btmCompact ? this.bottomBarHeight + this.state.keyHeight : this.bottomBarHeight
                    }}
                    ref={(ref) => {
                        this.bottomView = ref;
                    }}>
                        <View style={{alignItems: 'center'}}>
                            {this._renderMic()}
                            <View style={[{
                                alignItems: 'center',
                                backgroundColor: 'transparent',
                                width: '100%',
                                marginTop: 10 * ratio,
                                height: 31 * ratio,
                                flexDirection: 'row',
                                borderWidth: 1,
                                borderRightWidth: 0,
                                borderColor: c('purple border'),
                                borderRadius: 6 }]}>
                                <TextInput
                                    // Mtransparent={true}
                                    // MalignCenter={false}
                                    autoCapitalize="none"
                                    placeholder={I18n.t(['voice', 'enterMessage'])}
                                    returnKeyType="send"
                                    autoFocus={false}
                                    value={this.state.message}
                                    onChangeText={(message) => { this.setState({ message }); this._onInActive(); }}
                                    placeholderTextColor="white"
                                    style={{
                                        fontSize: 12 * ratio,
                                        width: windowSize.width - 12 * ratio,
                                        paddingLeft: 14 * ratio,
                                        paddingRight: 28 * ratio,
                                        borderRadius: 4,
                                        height: 31 * ratio - 3,
                                        
                                        color: this.state.keyHeight === 0 ? 'white' : c('color main'),
                                        backgroundColor: this.state.keyHeight === 0 ? 'transparent' : 'white'}}
                                    onSubmitEditing={this._sendTextQuestion}
                                />
                                <TouchableOpacity
                                    style={{borderRadius: 6, backgroundColor: 'transparent'}}
                                    onPress = {() => { this.setState({keyHeight: this.state.btmCompact ? 256 : 0, btmCompact: !this.state.btmCompact}); setTimeout(() => { Keyboard.dismiss(); this.scrollView.scrollToEnd({animated: false}); }, 50); }}
                                >
                                    <LinearGradient
                                        colors={[this.state.btmCompact ? c('purple dark') : c('purple active'), this.state.btmCompact ? c('purple dark') : c('purple main')]}
                                        style={[{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginLeft: -31 * ratio,
                                            overflow: 'hidden',
                                            width: 31 * ratio,
                                            height: 31 * ratio,
                                            borderWidth: 1,
                                            borderColor: c('purple border'),
                                            borderRadius: 6
                                        }]}
                                    >
                                        <T style={{borderRadius: 6, fontSize: 18 * ratio, color: 'white'}}>{this.state.btmCompact ? '+' : '-'}</T>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                        { !this.state.btmCompact && <View style={{width: '100%', height: 256, marginTop: 16 * ratio, paddingVertical: 13 * ratio, backgroundColor: 'white'}}>
                            <T style={{fontSize: 12, color: c('purple border'), paddingHorizontal: 6 * ratio}}>Try to ask:</T>
                            <ScrollView style={{height: 216}}>
                                <View style={{marginTop: 13 * ratio, flexDirection: 'row', paddingHorizontal: 6 * ratio, flexWrap: 'wrap'}}>
                                    {this.state.suggestedQuestions && this.state.suggestedQuestions.map((item) => {
                                        return (
                                            <TouchableOpacity key={`${item}`} onPress={() => { this._sendTextQuestion(item); }}>
                                                <ShadowView Mcolor={'black'} style={{marginBottom: 10 * ratio, borderRadius: 6, paddingHorizontal: 16 * ratio, paddingVertical: 8 * ratio, marginRight: 10 * ratio}}>
                                                    <T style={{fontSize: 12 * ratio}}>{item}</T>
                                                </ShadowView>
                                            </TouchableOpacity>
                                            
                                        );
                                    })}
                                </View>
                            </ScrollView>
                        </View>
                        }
                        
                    </Animatable.View>
                </BackgroundView>
            </InteractionProvider>
        );
    }
}

VoiceIOS.propTypes = {
    navigation: PropTypes.any
};

export default connect(null, mapDispatchToProps)(VoiceIOS);
