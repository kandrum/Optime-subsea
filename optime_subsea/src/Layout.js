// Layout.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style/Layoutstyle.module.css"; // Adjust the import path as needed
import {
  setCurrentCompany,
  setCurrentProject,
} from "./redux/actions/currentSelectionActions"; // Adjust the import path as needed

const Layout = () => {
  const [showAddCompanyInput, setShowAddCompanyInput] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.companies);

  // Get the visibility state from Redux store
  const isSidebarVisible = useSelector((state) => state.ui.isSidebarVisible);
  const userType = useSelector((state) => state.userType);

  console.log("Layout", userType);

  const handleAddCompanyKeyPress = (e) => {
    if (userType.result.role === "admin") {
      if (e.key === "Enter" && companyName.trim()) {
        dispatch({
          type: "ADD_COMPANY",
          payload: { name: companyName.trim() },
        });
        setCompanyName("");
        setShowAddCompanyInput(false);
      }
    } else {
      alert("You do not have access to Add company");
    }
  };

  const handleAddProjectKeyPress = (e) => {
    if (e.key === "Enter" && selectedCompany && projectName.trim()) {
      dispatch({
        type: "ADD_PROJECT",
        payload: { companyName: selectedCompany, project: projectName.trim() },
      });
      setProjectName("");
      setSelectedCompany(null); // Clear selected company to hide the input box
    }
  };

  const handleProjectClick = (companyName, projectName) => {
    dispatch(setCurrentCompany(companyName));
    dispatch(setCurrentProject(projectName));
  };

  return (
    <div
      className={`${styles.sidebar} ${isSidebarVisible ? "" : styles.hidden}`}
    >
      <div className={styles.sidebarHeader}>Manage Companies and Projects</div>
      <div className={styles.sidebarContent}>
        {showAddCompanyInput ? (
          <input
            autoFocus
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            onKeyPress={handleAddCompanyKeyPress}
            placeholder="Enter company name"
            className={styles.sidebarInput}
            onBlur={() => setShowAddCompanyInput(false)}
          />
        ) : (
          <button
            onClick={() => setShowAddCompanyInput(true)}
            className={styles.addCompanyBtn}
          >
            Add Company
          </button>
        )}

        {companies.map((company, index) => (
          <div key={index} className={styles.companySection}>
            <div className={styles.flex}>
              <div className={styles.companyName}>{company.name}</div>
              <button
                onClick={() => setSelectedCompany(company.name)}
                className={styles.addProjectBtn}
              >
                +
              </button>
            </div>
            {company.projects &&
              company.projects.map((project, projIndex) => (
                <div
                  key={projIndex}
                  className={`${styles.projectName} ${styles.clickable}`}
                  onClick={() => handleProjectClick(company.name, project)}
                >
                  {project}
                </div>
              ))}
            {selectedCompany === company.name && (
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyPress={handleAddProjectKeyPress}
                placeholder="Enter project name"
                className={styles.projectInput}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Layout;
