// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import T from '../T/';

import u from '../../helpers/utils/utils';

class StatBox extends Component {
    _rederContent = () => {
        console.log(this.props.data);
        let count = 0;

        
        return this.props.data.map((item) => {
            count++;
            
            return (<View key={count} style={[u(['spacing-ph-small', 'spacing-pv-small']), {flex: 1, height: 65, borderWidth: 2, borderColor: count === 1 ? '#f67d6c' : '#1cb4c1', backgroundColor: '#ffffff'}]}>
                    <T style={[{color: count === 1 ? '#f67d6c' : '#1cb4c1'}, {fontSize: 20, fontWeight: 'bold'}]}>{item.value}</T>
                    <T style={[u(['spacing-mt-small']), {fontWeight: 'bold'}]}>{item.name}</T>
                </View>);
        });
    };

    render () {
        return (
            <View style={[this.props.style, { flex: 1, maxHeight: 65, flexDirection: 'row'}]}>
                {this._rederContent()}
                {/* <View style={[u(['spacing-ph-small', 'spacing-pv-small']), {flex: 1, height: 65, borderWidth: 2, borderColor: '#f67d6c', backgroundColor: '#ffffff'}]}>
                    <T style={[{color: '#f67d6c'}, {fontSize: 20, fontWeight: 'bold'}]}>{this.props.attScore}</T>
                    <T style={[u(['spacing-mt-small']), {fontWeight: 'bold'}]}>{I18n.t(['voice', 'attr'])}</T>
                </View>
                <View style={[u(['spacing-ph-small', 'spacing-pv-small']), {flex: 1, height: 65, borderWidth: 2, borderColor: '#1cb4c1', backgroundColor: '#ffffff'}]}>
                    <T style={[{color: '#1cb4c1'}, {fontSize: 20, fontWeight: 'bold'}]}>{this.props.allAttend}</T>
                    <T style={[u(['spacing-mt-small']), {fontWeight: 'bold'}]}>{I18n.t(['voice', 'finan'])}</T> */}
                    {/*
                    <View style={[u(['spacing-mt-small']), {backgroundColor: '#ededed', height: 10, width: '100%'}]}>
                        <View style={[{backgroundColor: 'red', height: 10, width: '50%'}]}>
                        </View>
                    </View>
                    */}
                {/* </View> */}
            </View>
        );
    }
}

StatBox.defaultProps = {
    attScore: '',
    allAttend: ''
};

StatBox.propTypes = {
    data: PropTypes.array,
    style: PropTypes.object
};

export default StatBox;
