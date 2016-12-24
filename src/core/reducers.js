import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { authReducer } from './auth';
import { setupReducer } from './setup';
import { dashboardReducer } from './dashboard';
import { settingsReducer } from './settings';

export default combineReducers({
  routing: routerReducer,
  auth: authReducer,
  setup: setupReducer,
  dashboard: dashboardReducer,
  settings: settingsReducer,
});
