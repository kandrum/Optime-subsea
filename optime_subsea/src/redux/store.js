//store.js
import { createStore, combineReducers } from "redux";
import companiesReducer from "./reducers/companiesReducers";
import currentSelectionReducer from "./reducers/currentCompanyProject";
import userTypeReduce from "./reducers/VerifyReducer";
import uiReducer from "./reducers/uiReducer";
import clickAddReducer from "./reducers/addcompanybutton";
import clickProjectReducer from "./reducers/addProjectButton";
import currentFolder from "./reducers/currentfolder";
import tagsReducer from "./reducers/tagsreducer";
const rootReducer = combineReducers({
  companies: companiesReducer,
  userType: userTypeReduce,
  currentSelection: currentSelectionReducer,
  ui: uiReducer,
  clickAdd: clickAddReducer,
  clickProjectReducer: clickProjectReducer,
  currentFolder: currentFolder,
  tags: tagsReducer,
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
