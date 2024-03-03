// Reducer (usually in a separate file like reducers.js)
const initialState = {
  clicked: false,
};

const clickReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_CLICKED":
      return {
        ...state,
        clicked: !state.clicked,
      };
    default:
      return state;
  }
};

export default clickReducer;
