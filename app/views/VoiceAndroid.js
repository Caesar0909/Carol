
// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, View, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';

import SpeechAndroid from 'react-native-android-voice';
import I18n from 'react-native-i18n';
import Tts from 'react-native-tts';
import Video from 'react-native-video';
import HTML from 'react-native-render-html';
import Sound from 'react-native-sound';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import InteractionProvider from 'react-native-interaction-provider';
import _ from 'lodash';

import BackgroundView from '../components/BackgroundView/';
import Spinner from '../components/Spinner/';
import T from '../components/T/';
import IconButton from '../components/IconButton/';
import Icon from '../components/Icon/';
import Images from '../assets/icons/images/';
import Bubble from '../components/Bubble/';
import StatBox from '../components/StatBox/';
import TextBox from '../components/TextBox/';
import ShadowView from '../components/ShadowView';

import u from '../helpers/utils/utils';
import c from '../helpers/color';

import AIService from '../services/AIService';
import { windowSize, ratio } from '../helpers/windowSize';

import { Bar, Pie, SmoothLine, StockLine } from 'react-native-pathjs-charts';

import { connect } from 'react-redux';
import {hideBottomBar, showBottomBar} from '../reduxes/actions';

const mapDispatchToProps = dispatch => ({
    hideBottomBar: () => dispatch(hideBottomBar()),
    showBottomBar: () => dispatch(showBottomBar())
});

class VoiceAndroid extends Component {

    static propTypes = {
        hideBottomBar: PropTypes.func,
        showBottomBar: PropTypes.func
    };

    state: {
        stateText: string,
        responseText: string,
        showSpinner: boolean,
        showresponse: boolean,
        showrichresponse: boolean,
        showquestion: boolean,
        showthanks: boolean,
        keyHeight: number,
        msgId: string,
        recState: number,
        message: string,
        attScore: string,
        allAttend: string,
        inputWidth: number,
        richContent: Array<Object>,
        paused: boolean,
        videoData: Object,
        audioData: Object,
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

    constructor () {
        super();

        this.state = {
            stateText: '',
            responseText: 'You have 200 customers.',
            showrichresponse: false,
            showSpinner: false,
            keyHeight: 0,
            recState: 1,
            message: '',
            paused: true,
            stBoxData: [],
            videoData: {},
            audioData: {},
            btmCompact: true,
            relatedTopics: [],
            questions: [],
            richContent: [],
            suggestedQuestions: [],
            welcomeData: [],
            welcomeState: false,
            isActive: true,
            changeScreen: 0,
            status: 'start',
            ttsStatus: 'stop'
        };
        Tts.voices().then(voices => console.log(voices));
        Tts.setDefaultLanguage('pt-BR');
        Tts.addEventListener('tts-start', (event) => { this._clearTimeout(); this.setState({ttsStatus: 'speak'}); });
        Tts.addEventListener('tts-finish', (event) => { this._onInActive(); this.setState({ttsStatus: 'stop'}); });
        Tts.addEventListener('tts-cancel', (event) => { this._onInActive(); this.setState({ttsStatus: 'stop'}); });

        this.xTickValues = [];

        this.bar_options = {
            width: 250,
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
            
        this.pie_options = {
            margin: {
                top: 20,
                left: 20,
                right: 20,
                bottom: 20
            },
            width: 250,
            height: 250,
            color: '#2980B9',
            r: 30,
            R: 100,
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

        this.line_options = {
            width: windowSize.width - 134,
            height: windowSize.width - 134,
            color: '#2980B9',
            margin: {
                top: 20,
                left: 75,
                bottom: 25,
                right: 20
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
                    fontSize: 12,
                    fontWeight: true,
                    fill: '#34495E'
                }
            }
        };
        this.bottomBarHeight = 86 * ratio;
        AIService.sendQuestion("initial", (successResult) => {
            
            if (successResult.data !== undefined) {
                this.setState({suggestedQuestions: successResult.relatedSkills, welcomeData: successResult.data, welcomeState: true});
            } else {
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
        this.setState({ stateText: '', showspeech: true, showresponse: false, showrichresponse: false, recState: 1 });
        this._startListen();
    };

    _goFullScreen = () => {
        this.props.navigation.navigate('fullScreen', { url: this.state.fURL, type: this.state.fType });
    };

    _generateLineData = () => {
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
                        loop={true} // control whether the video should loop when ended

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
                        loop={true} // control whether the video should loop when ended

                        onReady={e => this.setState({ isReady: true })}
                        onChangeState={(e) => { this._changeStatus(e); }}
                        onChangeQuality={e => this.setState({ quality: e.quality })}
                        onError={e => this.setState({ error: e.error })}
                        onChangeFullscreen={e => this._changeScreen(e)}

                        style={{ alignSelf: 'stretch', height: windowSize.width * 9 / 16 }}
                    /></View>);
                }

                return (<View><YouTube
                    videoId="vrEXmO5yJIc" // The YouTube video ID
                    play={false} // control playback of video with true/false
                    fullscreen={true} // control whether the video should play in fullscreen or inline
                    loop={true} // control whether the video should loop when ended

                    onReady={e => this.setState({ isReady: true })}
                    onChangeState={(e) => { this._changeStatus(e); }}
                    onChangeQuality={e => this.setState({ quality: e.quality })}
                    onError={e => this.setState({ error: e.error })}
                    onChangeFullscreen={e => this._changeScreen(e)}

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

    async _startListen () {
        
        try {
            //More Locales will be available upon release.
            let spokenText = await SpeechAndroid.startSpeech('Speak it', SpeechAndroid.PORTUGUESE_BRAZIL);

            this.setState({ stateText: spokenText, showSpinner: true, recState: 3, stBoxData: [] });

            setTimeout(() => { this._finalize(); }, 100);
        }
        catch (error) {
            switch (error) {
                case SpeechAndroid.E_VOICE_CANCELLED:
                    this.setState({ stateText: 'Voice Recognizer cancelled' });
                    break;
                case SpeechAndroid.E_NO_MATCH:
                    this.setState({ stateText: 'No match for what you said' });
                    break;
                case SpeechAndroid.E_SERVER_ERROR:
                    this.setState({ stateText: 'Google Server Error' });
                    break;
                /*And more errors that will be documented on Docs upon release*/
            }
        }
    }

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

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        this.props.hideBottomBar();
    }

    componentWillUnmount () {
        this.props.showBottomBar();
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = (e) => {
        if (this.state.btmCompact) {
            this.setState({ keyHeight: e.endCoordinates.height });
            setTimeout(() => this.scrollView.scrollToEnd({animated: false}), 100);
        } else {
            Keyboard.dismiss();
        }
            
    };

    _keyboardDidHide = () => {
        if (this.state.btmCompact) {
            this.setState({ keyHeight: 0 });
        }
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
    }

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
                this.state.recState === 2 && <View style={{opacity: (100 - this.state.peak * 3) / 100, position: 'absolute', width: 38 + this.state.peak, height: 38 + this.state.peak, left: (28 * ratio - this.state.peak)/2, top: (28 * ratio - this.state.peak)/2, borderColor: 'white', borderWidth: 3, backgroundColor: 'transparent', borderRadius: 38}}>
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
        
    }

    _finalize = () => {
        let that = this;
        
        let tempQ = that.state.questions;

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

        AIService.sendQuestion(qText, (successResult) => {
            
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
                    let length = item.content.length;

                    for (let i = Math.ceil(length / 700) - 1; i >= 1; i--) {
                        let tempStr = item.content.substring(i * 700, (i + 1) * 700 > length ? length : (i + 1) * 700);

                        rich.push(that._generateRichResponse('text', tempStr));
                    }

                    item.content = item.content.substring(0, length < 700 ? length : 700);
                }

                if (item.type.indexOf('chart') === -1 && item.type !== 'number-box') {
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
                    let line_data = that._generateLineData(item.data);
                    
                    that.line_options.axisX.tickValues = that.xTickValues;
                    rich.push(that._generateRichResponse(item.type, item.content ? item.content : '', item.width, item.height, '', line_data, that.line_options));
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
            that._clearTimeout();
            if (successResult.understand === 'true' || successResult.understand === true) {
                
                that.setState({
                    // showSpinner: false,
                    responseText: successResult.voiceMessage,
                    // msgId: successResult.id,
                    recState: 1,
                    richContent: tempRich,
                    // videoData: vData,
                    showresponse: true,
                    showrichresponse: false,
                    relatedTopics: tempRelated
                    // audioData: auData
                });
                let speak_str = successResult.voiceMessage;
                
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
                    recState: 1,
                    // msgId: 0,
                    showrichresponse: false,
                    showresponse: true,
                    richContent: tempRich
                    // videoData: vData,
                    // audioData: auData
                });

                let speak_str = successResult.voiceMessage;
                
                speak_str = speak_str.replace(/(\d+),(\d+)/g, '$1$2');
                speak_str = speak_str.replace(/(\d+),(\d+)/g, '$1$2');
                speak_str = speak_str.replace(/(\d+),(\d+)/g, '$1$2');
                speak_str = speak_str.replace('TOTVS', 'totvs');
                if (this.state.status === 'start' || this.state.status === 'ended') {
                    Tts.speak(speak_str);
                }
                
            }
            // alert(JSON.stringify(successResult));
            // setTimeout(() => {
            //     this.setState({recState: 1});
            // }, 7000);
            that._onInActive();
        }, (failResult) => {
            // alert("fail");
            // this.setState({
            //     // showSpinner: false,
            //     responseText: 'Desculpe, eu não compreendi',
            //     // msgId: 0,
            //     showrichresponse: false,
            //     showresponse: true,
            //     recState: 1
            //     // richContent: []
            // });
            // setTimeout(() => {
            //     this.setState({recState: 1});
            // }, 7000);
            // Tts.speak('Desculpe, eu não compreendi');
        });
    }
    _sendTextQuestion = (question) => {
        Tts.stop();
        if (question.dispatchConfig) {
            this.setState({stateText: this.state.message, micState: false, recState: 2, showspeech: true, showresponse: false, showrichresponse: false, message: '', keyHeight: 0, btmCompact: true});
        }
        else {
            this.setState({stateText: question, micState: false, recState: 2, showspeech: true, showresponse: false, showrichresponse: false, keyHeight: 0, btmCompact: true});
        }

        setTimeout(() => {
            this._finalize();
        }, 100);
    };

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

    render () {
        return (
            <InteractionProvider
                timeout={1 * 1000} // idle after 5s
                onActive={() => this._onActive()}
                onInactive={() => this._onInActive()}
            >
                <BackgroundView
                    Mwhite={true}>
                    
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
                            marginBottom: -29 * ratio - 45 - this.bottomBarHeight - this.state.keyHeight,
                            paddingBottom: 29 * ratio + 45 + this.bottomBarHeight + this.state.keyHeight}, u(['spacing-ph-zero', 'spacing-pv-default'])]}
                        ref={(ref) => {
                            this.contentView = ref;
                        }}>
                        <ScrollView style={{paddingBottom: 30}}
                            ref={(ref) => { this.scrollView = ref; }}
                            onContentSizeChange={(contentWidth, contentHeight) => {
                                this.scrollView.scrollToEnd({animated: true});
                            }}>
                            <View style={[u('spacing-mb-small'), {flexDirection: 'column-reverse', flex: 1, minHeight: windowSize.height - 100 * ratio - this.bottomBarHeight}]}>
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
                        </ScrollView>
                    </Animatable.View>
                    
                    <Animatable.View style={{
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                        marginBottom: 0,
                        height: !this.state.btmCompact ? 29 * ratio + this.bottomBarHeight + this.state.keyHeight : 29 * ratio + this.bottomBarHeight
                    }}
                    ref={(ref) => {
                        this.bottomView = ref;
                    }}>
                        <View style={{width: '100%', backgroundColor: c('purple dark'), alignItems: 'center', height: 29 * ratio + this.bottomBarHeight}}>
                            <View style={{backgroundColor: 'white', height: 32 * ratio, width: '100%'}}></View>
                            {this._renderMic()}
                            <View style={[{
                                alignItems: 'center',
                                backgroundColor: c('purple dark'),
                                width: windowSize.width - 12,
                                marginTop: 10 * ratio,
                                height: 31 * ratio,
                                flexDirection: 'row',
                                borderWidth: 1,
                                borderRightWidth: 0,
                                borderColor: c('purple border'),
                                borderRadius: 6 }]}>
                                <TextBox
                                    Mtransparent={true}
                                    MalignCenter={false}
                                    autoCapitalize="none"
                                    placeholder={I18n.t(['voice', 'enterMessage'])}
                                    returnKeyType="send"
                                    autoFocus={false}
                                    value={this.state.message}
                                    onChangeText={(message) => { this.setState({ message }); this._onInActive(); }}
                                    style={{
                                        fontSize: 12 * ratio,
                                        width: windowSize.width - 43 * ratio,
                                        paddingLeft: 14 * ratio,
                                        paddingRight: 28 * ratio,
                                        borderRadius: 4,
                                        height: 31 * ratio - 3,
                                        color: this.state.keyHeight === 0 ? 'white' : c('black main'),
                                        backgroundColor: this.state.keyHeight === 0 ? 'transparent' : 'white'}}
                                    onSubmitEditing={this._sendTextQuestion}
                                />
                                <TouchableOpacity
                                    style={{borderRadius: 6, backgroundColor: 'transparent'}}
                                    onPress = {() => { this.setState({keyHeight: this.state.btmCompact ? 256 : 0, btmCompact: !this.state.btmCompact}); setTimeout(() => {Keyboard.dismiss(); this.scrollView.scrollToEnd({animated: false});}, 50); }}
                                >
                                    <LinearGradient
                                        colors={[this.state.btmCompact ? c('purple dark') : c('purple active'), this.state.btmCompact ? c('purple dark') : c('purple main')]}
                                        style={[{
                                            justifyContent: 'center',
                                            alignItems: 'center',
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

VoiceAndroid.propTypes = {
    navigation: PropTypes.any
};

export default connect(null, mapDispatchToProps)(VoiceAndroid);
