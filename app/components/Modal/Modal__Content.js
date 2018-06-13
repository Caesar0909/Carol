// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View } from 'react-native';

const Modal__Content = (props: Object) => {
    const ContentElem = props.useScrollView ? ScrollView : View;

    return (
        <ContentElem>
            {props.children}
        </ContentElem>
    );
};

Modal__Content.propTypes = {
    children: PropTypes.node,
    useScrollView: PropTypes.bool
};

export default Modal__Content;
