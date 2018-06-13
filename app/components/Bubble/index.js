// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';
import c from '../../helpers/color';
import u from '../../helpers/utils/utils';
import IconButton from '../../components/IconButton/';
import { ratio } from '../../helpers/windowSize';

const Bubble = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);
    const bStyle = [b('talkBubble'), u('spacing-mb-small'), u('spacing-pf-default')];
    const subStyle = [b('talkBubbleSquare')];

    if (props.width) { bStyle.push({width: props.width}); }
    

    if (props.MNav === true) {
        bStyle.push({width: '85%'});
        
        return (
            <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={bStyle}>
                    <View style={[b('talkBubbleSquare')]}>
                        <Text>{props.label}</Text>
                    </View>
                    <View style={[b('talkBubbleTriangle')]} />
                </View>
                <View style={[{width: 30, flexDirection: 'row', alignItems: 'center', borderColor: '#70bd73', borderWidth: 2, justifyContent: 'center'}, u('spacing-mb-small')]}>
                    <IconButton
                        color={c('green dark-background')}
                        hollow = {false}
                        fill={'#70bd73'}
                        name="ArrowForward"
                        size={30}
                        onPress={props.MAction}
                        style={{margin: '0 auto'}}
                    />
                </View>
            </View>
        );
    }
    
    if (props.MType === 'rich' || props.flow === 'left') {
        if (props.Bcolor) {
            subStyle.push({borderColor: props.Bcolor, marginLeft: 6 * ratio});
        }
        else {
            subStyle.push({marginLeft: 6 * ratio});
        }
        
        return (
            <View style={bStyle}>
                <View style={subStyle}>
                    {props.children}
                </View>
            </View>
        );
    }
    // if (props.flow === 'left') {
    //     return (
    //         <View style={bStyle}>
    //             <View style={[b('talkBubbleSquare'), {marginLeft: 6 * ratio}]}>
    //                 {props.children}
    //             </View>
    //             {/* <View style={[b('talkBubbleTriangle')]} /> */}
    //         </View>
    //     );
    // }
    bStyle.push({width: props.width, alignSelf: 'flex-end'});
    
    if (props.Bcolor) {
        subStyle.push({borderColor: props.Bcolor, marginRight: 6 * ratio, marginTop: 14});
    }
    else {
        subStyle.push({marginRight: 6 * ratio, marginTop: 14});
    }
    
    return (
        <View style={bStyle}>
            <View style={subStyle}>
                {props.children}
            </View>
        </View>
    );
    
    
};

Bubble.defaultProps = {
    Bwidth: 0,
    flow: 'left',
    MNav: false
};

Bubble.propTypes = {
    children: PropTypes.node.isRequired,
    Bcolor: PropTypes.string,
    Bwidth: PropTypes.number,
    MNav: PropTypes.bool,
    MAction: PropTypes.func,
    width: PropTypes.number,
    flow: PropTypes.string,
    MType: PropTypes.string
};

export default Bubble;
