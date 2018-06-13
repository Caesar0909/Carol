// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, Platform, View, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';

import T from '../components/T/';
import {hideBottomBar, showBottomBar} from '../reduxes/actions';

import immediatelyResetStack from '../helpers/immediatelyResetStack';
import Images from '../assets/icons/images/';
import { windowSize } from '../helpers/windowSize';
import c from '../helpers/color';


const mapDispatchToProps = dispatch => ({
    hideBottomBar: () => dispatch(hideBottomBar()),
    showBottomBar: () => dispatch(showBottomBar())
});

class Welcome extends Component {

    static propTypes = {
        hideBottomBar: PropTypes.func,
        showBottomBar: PropTypes.func
    };

    state: {
        
    };

    constructor () {
        super();

        this.state = {
            
        };
    }

    static route = {
        navigationBar: null
    };

    componentWillMount () {
        
        this.props.hideBottomBar();

        setTimeout(() => {
            immediatelyResetStack(this.props, 'companyHome', { showInviteCallout: true });
        }, 1000);
    }

    render () {
        return (
            <View style={{ flex:1, backgroundColor: c('purple background'), justifyContent: 'center', alignItems: 'center' }}>
                <Image source={Images.CAROL} style={{width: windowSize.width - 68, marginBottom: 35, height: (windowSize.width - 68) * 82 / 468}}/>
                <T style={{fontSize: 12, color: 'white'}}>Welcome</T>
            </View>
        );
    }
}

Welcome.propTypes = {
    navigation: PropTypes.any
};

export default connect(null, mapDispatchToProps)(Welcome);
