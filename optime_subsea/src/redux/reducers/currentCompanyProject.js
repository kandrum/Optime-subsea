const initialState = {
  clicked: false,
  currentCompany: {},
};

const currentSelectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CURRENT_COMPANY_project":
      return {
        ...state,
        clicked: true,
        currentCompany: action.payload,
      };

    default:
      return state;
  }
};

export default currentSelectionReducer;
