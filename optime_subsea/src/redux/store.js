//store.js
import { createStore,combineReducers } from 'redux';
import companiesReducer from './reducers/companiesReducers';
import currentSelectionReducer from './reducers/currentCompanyProject'
import userTypeReduce from './reducers/VerifyReducer';
import uiReducer from './reducers/uiReducer';

const rootReducer = combineReducers({
  companies: companiesReducer,
  userType:userTypeReduce,
  currentSelection: currentSelectionReducer,
  ui:uiReducer,
  
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
