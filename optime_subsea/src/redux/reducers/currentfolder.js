const initialState = {
  folder: null, // Placeholder for the current folder's detail
  path: null, // Initially null, to be updated to a string
};

// Reducer function updated for managing 'folder' and 'path'
const currentFolder = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CURRENT_FOLDER":
      // Assuming action.payload will contain an object with folder and path properties
      return {
        ...state,
        folder: action.payload.folder, // Updated to the new folder detail from the payload
        path: action.payload.path, // Updated to the new path from the payload
      };

    // Add more cases as needed

    default:
      return state;
  }
};

export default currentFolder;
