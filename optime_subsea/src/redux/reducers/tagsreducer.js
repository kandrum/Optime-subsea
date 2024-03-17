const initialState = {
  selectedKeys: {},
  startDate: "",
  endDate: "",
};

function tagsReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_SELECTED_KEYS":
      return {
        ...state,
        selectedKeys: action.payload,
      };
    case "SET_START_DATE":
      return {
        ...state,
        startDate: action.payload,
      };
    case "SET_END_DATE":
      return {
        ...state,
        endDate: action.payload,
      };
    default:
      return state;
  }
}

export default tagsReducer;
