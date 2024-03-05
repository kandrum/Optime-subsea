import React, { useState, useEffect } from "react";
import styles from "./style/addcompany.module.css";
import { useDispatch, useSelector } from "react-redux";
function AddCompanyAndProjectForm() {
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showCompanyInput, setShowCompanyInput] = useState(false);
  const [showProjectInput, setShowProjectInput] = useState({});
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const userType = useSelector((state) => state.userType);
  const [userID, setUserId] = useState(userType.result.userId);

  useEffect(() => {
    fetchCompanies();
    fetchProjects();
  }, []);

  const fetchCompanies = async () => {
    const response = await fetch("http://localhost:1226/getcompanies");
    const data = await response.json();
    setCompanies(data);
  };

  const fetchProjects = async () => {
    const response = await fetch("http://localhost:1226/getallprojects");
    const data = await response.json();
    setProjects(data.data);
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:1226/addcompany", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyname: newCompanyName, userid: userID }),
    });
    if (response.ok) {
      fetchCompanies();
      setShowCompanyInput(false);
      setNewCompanyName("");
    }
  };
  const handleDeleteCompany = async (companyid) => {
    const response = await fetch("http://localhost:1226/deletecompany", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyid }),
    });
    if (response.ok) {
      // If the delete operation was successful, fetch the updated list of companies
      fetchCompanies();
    } else {
      // Handle error situation or notify the user
      console.error("Failed to delete the company.");
    }
  };

  const handleDeleteProject = async (projectId) => {
    const response = await fetch("http://localhost:1226/deleteProject", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });
    if (response.ok) {
      fetchProjects(); // Refresh the projects list to reflect the deletion
    } else {
      console.error("Failed to delete the project.");
      // Optionally, you could handle this error more gracefully in your UI
    }
  };

  const handleAddProject = async (companyid) => {
    const response = await fetch("http://localhost:1226/addprojects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newProjectName, companyid, userid: userID }),
    });
    if (response.ok) {
      fetchProjects();
      setShowProjectInput({ ...showProjectInput, [companyid]: false });
      setNewProjectName("");
    }
  };

  const handleProjectClick = (
    companyid,
    projectid,
    companyname,
    projectname
  ) => {
    console.log(
      `CompanyID: ${companyid}, ProjectID: ${projectid}, CompanyName: ${companyname}, ProjectName: ${projectname}`
    );
  };

  return (
    <div className={styles.container}>
      <h2>Add Companies</h2>
      {showCompanyInput ? (
        <form onSubmit={handleAddCompany}>
          <input
            type="text"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            required
          />
          <button type="submit">Add Company</button>
        </form>
      ) : (
        <button
          onClick={() => setShowCompanyInput(true)}
          className={styles.smallButton}
        >
          + Add Company
        </button>
      )}

      <ul>
        {companies.map((company) => (
          <li key={company.companyid}>
            {company.companyname}
            <button
              onClick={() =>
                setShowProjectInput({
                  ...showProjectInput,
                  [company.companyid]: true,
                })
              }
              className={styles.smallButton}
            >
              + Add Project
            </button>
            <button
              onClick={() => handleDeleteCompany(company.companyid)}
              className={styles.deleteButton}
            >
              🗑️
            </button>
            {showProjectInput[company.companyid] && (
              <form onSubmit={() => handleAddProject(company.companyid)}>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                />
                <button type="submit">Add Project</button>
              </form>
            )}
            <ul>
              {projects
                .filter((project) => project.companyid === company.companyid)
                .map((project) => (
                  <li
                    key={project.projectid}
                    onClick={() =>
                      handleProjectClick(
                        company.companyid,
                        project.projectid,
                        company.companyname,
                        project.name
                      )
                    }
                  >
                    {project.name}
                    <button
                      onClick={() => handleDeleteProject(project.projectid)}
                      className={styles.deleteButton} // Consider styling appropriately
                    >
                      🗑️
                    </button>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddCompanyAndProjectForm;
