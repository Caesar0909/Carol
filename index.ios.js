import React from 'react';
import { AppRegistry } from 'react-native';
import Main from './app/Main';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';

import configureStore from './app/reduxes/stores';

const store = configureStore(fromJS({}));

const RNRedux = () => {
    return (
        <Provider store={store}>
            <Main/>
        </Provider>
    );
};

AppRegistry.registerComponent('Carol', () => RNRedux);
