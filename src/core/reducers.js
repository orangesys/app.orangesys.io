import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { authReducer } from './auth';
import { setupReducer } from './setup';
import { dashboardReducer } from './dashboard';

export default combineReducers({
  routing: routerReducer,
  auth: authReducer,
  setup: setupReducer,
  dashboard: dashboardReducer,
});
