import React, { useState, useEffect } from "react";
import styles from "./style/addcompany.module.css";
import { useDispatch, useSelector } from "react-redux";
import headerBackground from "./sidebar.jpg";
import { ip } from "./appconstants";
function AddCompanyAndProjectForm() {
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showCompanyInput, setShowCompanyInput] = useState(false);
  const [showProjectInput, setShowProjectInput] = useState({});
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [userType2, setuserType2] = useState(
    useSelector((state) => state.userType.result.role)
  );
  console.log("afrom add company.jsx", userType2);
  const userType = useSelector((state) => state.userType);
  const [userID, setUserId] = useState(userType.result.userId);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchCompanies();
    fetchProjects();
  }, []);

  const fetchCompanies = async () => {
    const response = await fetch(`${ip}/getcompanies`);
    const data = await response.json();
    setCompanies(data);
  };

  const fetchProjects = async () => {
    const response = await fetch(`${ip}/getallprojects`);
    const data = await response.json();
    setProjects(data.data);
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    const response = await fetch(`${ip}/addcompany`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyname: newCompanyName, userid: userID }),
    });
    if (response.ok) {
      fetchCompanies();
      setShowCompanyInput(false);
      setNewCompanyName("");
    } else {
      // Handle non-200 responses
      const errorData = await response.json(); // Assuming your server sends back error details in JSON format
      alert(errorData.error.message);
    }
  };
  const handleDeleteCompany = async (companyid) => {
    // Ask user for confirmation before deleting
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this company and all its associated projects?"
    );

    // Proceed with deletion only if user confirmed
    if (isConfirmed) {
      const response = await fetch(`${ip}/deletecompany`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyid }),
      });

      if (response.ok) {
        fetchCompanies(); // Refresh the companies list to reflect the deletion
        alert("Company has been successfully deleted."); // Optional: Notify user of success
      } else {
        console.error("Failed to delete the company.");
        alert("Failed to delete the company."); // Optionally, inform the user about the failure
        // Further error handling or user notification logic can be added here
      }
    } else {
      // If the user clicks Cancel, you might want to notify them or take other actions
      console.log("Company deletion canceled."); // This is optional
    }
  };

  const handleDeleteProject = async (projectId) => {
    // Ask user for confirmation before deleting
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    // Proceed with deletion only if user confirmed
    if (isConfirmed) {
      const response = await fetch(`${ip}/deleteProject`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (response.ok) {
        fetchProjects(); // Refresh the projects list to reflect the deletion
        alert("Project has been successfully deleted."); // Optional: Notify user of success
      } else {
        console.error("Failed to delete the project.");
        alert("Failed to delete the project."); // Optionally, inform the user about the failure
        // Further error handling or user notification logic can be added here
      }
    } else {
      // If the user clicks Cancel, you might want to notify them or take other actions
      console.log("Project deletion canceled."); // This is optional
    }
  };

  const handleAddProject = async (e, companyid) => {
    // Prevent the default form submission behavior
    e.preventDefault();
    console.log("from handleAddProject", companyid);

    try {
      const response = await fetch(`${ip}/addprojects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newProjectName, // Ensure this matches "New Project3356" format in your actual use case
          companyid: companyid, // This should match a valid company ID, like 13
          userid: userID, // Make sure userID matches a valid user ID, like 101
        }),
      });

      if (response.ok) {
        const data = await response.json(); // Assuming your server sends back some response
        console.log("Project added successfully", data);
        fetchProjects(); // Refresh the projects list to include the newly added project
        setShowProjectInput({ ...showProjectInput, [companyid]: false });
        setNewProjectName(""); // Reset the project name input field
      } else {
        // Handle non-200 responses
        const errorData = await response.json(); // Assuming your server sends back error details in JSON format
        alert(errorData.message.message);
      }
    } catch (error) {
      // Handle network errors or other fetch issues
      console.error("Failed to add the project. Error:", error);
    }
  };

  // actions/currentSelectionActions.js
  const setCurrentCompanyProject = (
    companyid,
    projectid,
    companyname,
    projectname
  ) => ({
    type: "SET_CURRENT_COMPANY_project",
    payload: { companyid, projectid, companyname, projectname },
  });

  const handleProjectClick = (
    companyid,
    projectid,
    companyname,
    projectname
  ) => {
    console.log(
      `CompanyID: ${companyid}, ProjectID: ${projectid}, CompanyName: ${companyname}, ProjectName: ${projectname}`
    );

    // Dispatch the action to the store
    dispatch(
      setCurrentCompanyProject(companyid, projectid, companyname, projectname)
    );
  };

  return (
    <div className={styles.container}>
      {/* Conditionally show Add Company button/input for 'admin', based on userType2 */}
      {userType2 === "admin" &&
        (showCompanyInput ? (
          <form onSubmit={handleAddCompany} className={styles.addCompanyForm}>
            <input
              type="text"
              className={styles.companyInput}
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="Enter company name"
              required
            />
            <button type="submit" className={styles.addButton}>
              Add Company
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowCompanyInput(true)}
            className={styles.addCompanyButton}
          >
            + Add Company
          </button>
        ))}

      <div className={styles.companiesList}>
        {companies.map((company) => (
          <div key={company.companyid} className={styles.companyContainer}>
            <div className={styles.companyHeader}>
              <span className={styles.companyName}>{company.companyname}</span>
              {/* Conditionally show Delete Company button for 'admin', based on userType2 */}
              {userType2 === "admin" && (
                <button
                  onClick={() => handleDeleteCompany(company.companyid)}
                  className={styles.deleteButton}
                >
                  🗑️
                </button>
              )}
            </div>
            {/* Conditionally show Add Project button/input for 'admin', based on userType2 */}
            {(userType2 === "admin" || userType2 === "supervisor") && (
              <>
                {showProjectInput[company.companyid] && (
                  <form
                    onSubmit={(e) => handleAddProject(e, company.companyid)}
                    className={styles.addProjectForm}
                  >
                    <input
                      type="text"
                      className={styles.projectInput}
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Enter project name"
                      required
                    />
                    <button type="submit" className={styles.addButton}>
                      Add Project
                    </button>
                  </form>
                )}
                <button
                  onClick={() =>
                    setShowProjectInput({
                      ...showProjectInput,
                      [company.companyid]: true,
                    })
                  }
                  className={styles.addProjectButton}
                >
                  + Add Project
                </button>
              </>
            )}
            <div className={styles.projectsList}>
              {projects
                .filter((project) => project.companyid === company.companyid)
                .map((project) => (
                  <div key={project.projectid} className={styles.projectItem}>
                    <span
                      onClick={() =>
                        handleProjectClick(
                          company.companyid,
                          project.projectid,
                          company.companyname,
                          project.name
                        )
                      }
                      className={styles.projectName}
                    >
                      {project.name}
                    </span>
                    {/* Conditionally show Delete Project button for 'admin', based on userType2 */}
                    {(userType2 === "admin" || userType2 === "supervisor") && (
                      <button
                        onClick={() => handleDeleteProject(project.projectid)}
                        className={styles.deleteButton}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddCompanyAndProjectForm;
