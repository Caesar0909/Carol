// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Modal as ReactNativeModal, View } from 'react-native';
import bem from 'react-native-bem';
import ModalBackdrop from './ModalBackdrop';
import Modal__Title from './Modal__Title';
import styles from './styles';

const Modal = (props: Object) => {
    const b = (selector) => bem(selector, props, styles);

    return (
        <ReactNativeModal {...props}>
            <ModalBackdrop>
                <View style={b('modal')}>
                    {props.title && <Modal__Title title={props.title} />}
                    {props.children}
                </View>
            </ModalBackdrop>
        </ReactNativeModal>
    );
};

Modal.defaultProps = {
    animationType: 'slide',
    transparent: true
};

Modal.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string
};

export default Modal;
