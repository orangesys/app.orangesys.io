import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import createLogger from 'redux-logger';
import reducers from './reducers';
import sagas from './sagas';

export default(initialState = {}) => {
  const middlewares = [];
  const sagaMiddleware = createSagaMiddleware();
  middlewares.push(applyMiddleware(sagaMiddleware));
  if (process.env.NODE_ENV !== 'production') {
    const devToolsExtension = window.devToolsExtension;
    if (typeof devToolsExtension === 'function') {
      middlewares.push(devToolsExtension());
    }
    middlewares.push(applyMiddleware(createLogger()));
  }

  const store = createStore(reducers, initialState, compose(...middlewares));
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers').default);  // eslint-disable-line global-require
    });
  }
  sagaMiddleware.run(sagas);
  return store;
};
