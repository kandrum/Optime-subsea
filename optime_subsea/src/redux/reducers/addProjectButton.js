// Reducer (usually in a separate file like reducers.js)
const initialState = {
  clicked: false,
};

const clickProjectReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_CLICKED_Project":
      return {
        ...state,
        clicked: !state.clicked,
      };
    default:
      return state;
  }
};

export default clickProjectReducer;
