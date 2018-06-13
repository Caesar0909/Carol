import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';
import {
    AsyncStorage,
    Image,
    Text,
    View,
    Platform
} from 'react-native';

import Images from '../../assets/icons/images/';
import { vRatio } from '../../helpers/windowSize';
import immediatelyResetStack from '../../helpers/immediatelyResetStack';
import SessionHelper from '../../helpers/SessionHelper';
import {
    Button
} from '../../components';

import styles from './styles';

export default class Instructions extends Component {
    static propTypes = {
        navigation: PropTypes.shape().isRequired
    }

    state = {
        index: 0
    }

    handleSkip = () => {
        this.goToMain();
    }

    handleNext = () => {
        const { index } = this.state;

        if (index >= 7) {
            this.goToMain();
        }
        else if (index >= 4) {
            this.swiper2.scrollBy(1);
        }
        else {
            this.swiper1.scrollBy(1);
        }

        this.setState({ index: index + 1 });
    }

    goToMain = () => {
        Platform.OS === 'android' ? immediatelyResetStack(this.props, 'companyHome', { showInviteCallout: true }) : this.props.navigation.navigate('companyHome', { showInviteCallout: true });
        AsyncStorage.setItem('seenInstructions', 'yes');
    }

    renderPart1 = (image, title, line1, line2, line3) => (
        <View style={styles.page}>
            <Image source={image} style={styles.thumbnail} />
            <Text style={[styles.title, styles.bold]}>{title}</Text>
            <Text style={styles.description}>{line1}</Text>
            <Text style={styles.description}>{line2}</Text>
            <Text style={styles.description}>{line3}</Text>
        </View>
    );

    renderPart2 = (image) => (
        <View style={styles.page}>
            <Image source={image} style={styles.fullImage} />
        </View>
    )

    renderPart1_1 = () => {
        const user = SessionHelper.currentSession();

        return this.renderPart1(
            Images.INSTRUCTION1_1,
            `Hi ${user.name}`,
            <Text>With our <Text style={styles.bold}>Carol App</Text></Text>,
            <Text>you have a full view from</Text>,
            <Text>your company</Text>
        );
    }

    renderPart1_2 = () => {
        return this.renderPart1(
            Images.INSTRUCTION1_2,
            'Hi, how can I help?',
            <Text>You can tap on the microphone or</Text>,
            <Text>text your question</Text>
        );
    }

    renderPart1_3 = () => {
        return this.renderPart1(
            Images.INSTRUCTION1_3,
            'A 360 view',
            <Text>See everything and know what</Text>,
            <Text>happens with your business</Text>
        );
    }

    renderPart1_4 = () => {
        return this.renderPart1(
            Images.INSTRUCTION1_4,
            'Carol predict',
            <Text>Know what will happen with</Text>,
            <Text>your business</Text>
        );
    }

    render () {
        const { index } = this.state;

        return (
            <View style={styles.container}>
                { index < 4 &&
                    <Swiper
                        ref={(ref) => { this.swiper1 = ref; }}
                        activeDotStyle={styles.activeDot}
                        dotStyle={styles.dot}
                        loop={false}
                        scrollEnabled={false}
                        paginationStyle={styles.paginationRow}
                    >
                        { this.renderPart1_1() }
                        { this.renderPart1_2() }
                        { this.renderPart1_3() }
                        { this.renderPart1_4() }
                    </Swiper>
                }
                { index >= 4 &&
                    <Swiper
                        ref={(ref) => { this.swiper2 = ref; }}
                        showsPagination={false}
                        loop={false}
                        scrollEnabled={false}
                    >
                        { this.renderPart2(Images.INSTRUCTION2_1) }
                        { this.renderPart2(Images.INSTRUCTION2_2) }
                        { this.renderPart2(Images.INSTRUCTION2_3) }
                        { this.renderPart2(Images.INSTRUCTION2_4) }
                    </Swiper>
                }
                { index < 4 && <Text style={[styles.button, styles.leftButton]} onPress={this.handleSkip}>Skip</Text> }
                { index < 4 && <Text style={[styles.button, styles.rightButton]} onPress={this.handleNext}>Next</Text> }
                { index >= 4 && <View style={styles.button2}>
                    <Button
                        Mwidth={280 * vRatio}
                        Mheight={40 * vRatio}
                        Mcolor="primary"
                        MSolid
                        label="Next"
                        onPress={this.handleNext}
                    />
                </View>}
            </View>
        );
    }
}
