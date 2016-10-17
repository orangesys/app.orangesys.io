import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { authReducer } from './auth';
import { setupReducer } from './setup';

export default combineReducers({
  routing: routerReducer,
  auth: authReducer,
  setup: setupReducer,
});
