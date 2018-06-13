import { createStore, applyMiddleware } from 'redux';
import { Map } from 'immutable';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import requestStatusMiddleware from '../middleware/requestStatusMiddleware';

import createReducer from '../setup';

export default function configureStore (initialState = new Map()) {
    const middlewares = [
        requestStatusMiddleware
    ];
    const composeEnhancers = composeWithDevTools({});

    if (process.env.NODE_ENV === 'development') {
        const reduxLogger = createLogger();
        middlewares.push(reduxLogger);
    }
    const enhancers = [
        applyMiddleware(...middlewares)
    ];

    const store = createStore(
        createReducer(),
        initialState,
        composeEnhancers(...enhancers)
    );

    return store;
}
