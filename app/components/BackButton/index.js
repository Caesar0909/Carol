// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, TouchableOpacity, View } from 'react-native';
import bem from 'react-native-bem';
import styles from './styles';
import Icon from '../Icon/';

const BACK_ICON = {
    android: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAQAAAD/5HvMAAAAbklEQVR4Ae3ZxQHDMAxAUZ197sBasQu1gXuoaHhfC7ygAyFJktYysi7Oc56si7OS6uKspLo4z7hHqYtzw8HBwemNg4ODg/OtqY3zfIkD9FdSVEZq5bJvn4SEhISEhISEVHw43yGlny9Hv6ckSdIEb5dSW8V5J5sAAAAASUVORK5CYII=',
    ios: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAACBCAYAAABuFIx8AAAAAXNSR0IArs4c6QAAA6ZJREFUeAHt3LmO1DAYAODfI6Cmo0LiGRAdDQ1UUAHvgHiFpUix21MBb0ADHd02lBR0PAAgRIFotl4KY88oc+zksB0f/2VpJlEmv518Y0s5bANITZ29ASf2LXT2TgrBKiWIfIxH+wcfwMILt/ycgmfII8SewA7tyTbUwE+4Dg+gMz+222ZWZMENofVAkXhy4KbQEvBkwIWgReLxh4tBi8DjDZeCFojHF24JWgAeT7gcaDN4/OByok3g8YIrgTaCxweuJNo+HsB9ODO/edyr1kDb4H1zt2Z//Sr9GlcLzcAnh/bU3c9e0odrhEYbriEaXbjGaDThEKDRg0OCRgsOERodOGRoNOAQouGHQ4qGGw4xGl445Gg44Qig4YMjgoYLjhAaHjhiaDjgCKK1hyOK1haOMFo7OOJobeA2aB9dp77H/gCKpSvvCHKXU/dlDRM0/yfUg2OEVg+OGVodOIZo5eGYopWFY4xWDo45Whk4AWj54YSg5YUThJYPThhaHjiBaMvhhKItgxOMlg4nHC0NTtG8W+RjJUVbo8XBKdoWLRxO0Q7QwuAU7QhtHk7RBtGm4RRtFG0cTtEm0YbhFG0W7RhO0YLQDuEULRhtB6doUWgbOEWLRvMB1+AS3rsl6Q4wSWe+MMgPLf+yMI/pcAO/4BY860cWT+9M59eVez7yqOjhWrgNf+A1WFuvg0/RE9pkvnLjzJ87vK9Fy/IT3L2CN5zwNrWgszfdzH3nrrPfvaKABt7BKbwEY2zRcipkvms+ihfFvYPzYYoXjHcIp3gL4BQvCO+4xvVh2mx7icHlOJzfXfEG0fzGaTi/h+J5haM0D+dDFC8RTvEWwCneAV5YU90P0Wa71oiH05q3AE7xAi5H1r4jX4KbbVpT3XcUirccTmizzQMnEC8fnDC8vHCC8PLDCcErAycArxwcc7yycIzxysMxxasDxxCvHhwzvLpwjPDqwzHBawPHAK8dHHG8tnCE8drDEcXDAUcQDw8cMTxccITw8MERwcMJRwAPLxxyPNxwiPHwwyHFowGHEI8OHDI8WnCI8OjBIcGjCYcAjy5cYzzacA3x6MM1wuMBVwvPwIXr/HsXTs13P5kBj9SZCzdM/mGxYfIeDVz+Ds2D8alx/d9fok9yj3ZmtnMX8IPzgDnxBtB8ETzhcuGNoPGGW4o3gcYfLhVvBk0GXCxeAJocuFC8QDRZcHN4EWjy4MbwItFkwl3FS0DzWchN/iL5xJ67T9JEXP8BBzR5KHiXJWIAAAAASUVORK5CYII='
};

const BackButton = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <View style={b('back-button')}>
            <TouchableOpacity onPress={() => { props.onPress(); }}>
                <View style={b('back-button__spacer')}>
                    <Icon name={"BackArrow"} fill={props.color} height={30} width={30} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

BackButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    color: PropTypes.string,
    Mflex: PropTypes.bool
};

BackButton.defaultProps = {
    color: 'white',
    Mflex: false
};

export default BackButton;
