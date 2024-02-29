// redux/reducers/uiReducer.js

const initialState = {
    isSidebarVisible: true,
  };
  
  const uiReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'TOGGLE_SIDEBAR_VISIBILITY':
        return {
          ...state,
          isSidebarVisible: !state.isSidebarVisible
        };
      default:
        return state;
    }
  };
  
  export default uiReducer;
  