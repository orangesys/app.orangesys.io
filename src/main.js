import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { hashHistory as history } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './core/store';
import { initAuth } from './core/auth';
import { logException } from 'src/core/logger';
import Root from './views/root';

const store = configureStore();
const syncedHistory = syncHistoryWithStore(history, store);
const rootElement = document.getElementById('root');

function render(Component) {
  ReactDOM.render(
    <AppContainer>
      <Component history={syncedHistory} store={store} />
    </AppContainer>,
    rootElement
  );
}

if (module.hot) {
  module.hot.accept('./views/root', () => {
    render(require('./views/root').default);  // eslint-disable-line global-require
  });
}

initAuth(store.dispatch)
  .then(() => render(Root))
  .catch(error => logException(error));
