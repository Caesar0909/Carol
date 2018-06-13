// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from '../Icon/';
import c from '../../helpers/color';

import styles from './styles';

const Spinner = (props: Object) => {
    const content = (
        <Animatable.View
            animation="rotate"
            duration={400}
            easing="linear"
            iterationCount="infinite"
            style={[
                props.style,
                {
                    height: props.size,
                    width: props.size
                }
            ]}
        >
            <Icon name="Ring" fill={props.fill} height={props.size} width={props.size} />
        </Animatable.View>
    );

    return (
        props.withDimBackground ?
        <View style={styles.wrapper}>
            { content }
        </View>
        :
        content
    );
};

Spinner.defaultProps = {
    fill: c('purple light'),
    size: 34,
    withDimBackground: false
};

Spinner.propTypes = {
    fill: PropTypes.string,
    size: PropTypes.number,
    style: PropTypes.object,
    withDimBackground: PropTypes.bool
};

export default Spinner;
