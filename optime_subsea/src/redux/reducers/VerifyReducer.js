const initialState = { "message": "Login successful",
"result": {
    "checkstatus": null,
    "username": null,
    "role": null
} };

const userTypeReduce = (state = initialState, action) => {
  switch (action.type) {
    case "userType":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default userTypeReduce;
