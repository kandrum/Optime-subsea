// currentSelectionReducer.js

const initialState = {
  clicked: false,
};

const currentSelectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CURRENT_COMPANY":
      return {
        ...state,
        currentCompany: action.payload,
      };
    case "SET_CURRENT_PROJECT":
      return {
        ...state,
        currentProject: action.payload,
      };
    case "CLEAR_CURRENT_SELECTIONS":
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default currentSelectionReducer;
