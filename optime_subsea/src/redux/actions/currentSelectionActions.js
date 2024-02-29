// actions/currentSelectionActions.js

export const setCurrentCompany = (companyName) => ({
    type: 'SET_CURRENT_COMPANY',
    payload: companyName,
  });
  
  export const setCurrentProject = (projectName) => ({
    type: 'SET_CURRENT_PROJECT',
    payload: projectName,
  });
  
  export const clearCurrentSelections = () => ({
    type: 'CLEAR_CURRENT_SELECTIONS',
  });
  