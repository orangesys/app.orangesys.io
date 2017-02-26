import assert from 'assert';
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducers from 'src/core/reducers';
import App from 'src/views/app';

const initialState = {
  auth: {},
};

describe('<App />', () => {
  it('can render', () => {
    const store = createStore(reducers, initialState);
    const renderer = mount(
      <Provider store={store} key="provider">
        <App router={{}} />
      </Provider>
    );
    assert(renderer.length === 1);
  });
});
