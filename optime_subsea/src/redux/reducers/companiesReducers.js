const initialState = [];

const companiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_COMPANY':
      // Check if the company already exists to avoid duplicates
      const companyExists = state.find(company => company.name === action.payload.name);
      if (!companyExists) {
        // Add a new company with an empty projects array
        return [...state, { name: action.payload.name, projects: [] }];
      }
      return state;

    case 'ADD_PROJECT':
      // action.payload should include { companyName, project }
      return state.map(company => {
        if (company.name === action.payload.companyName) {
          // Add the new project to the matching company
          return {
            ...company,
            projects: [...company.projects, action.payload.project]
          };
        }
        return company;
      });

    default:
      return state;
  }
};

export default companiesReducer;
