import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ip } from "./appconstants";
import styles from "./style/fileupload.module.css";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fetchedData, setFetchedData] = useState(null); // State to store fetched data

  // Accessing userType and currentCompany from Redux store
  const userType = useSelector((state) => state.userType);
  const currentCompany = useSelector(
    (state) => state.currentSelection.currentCompany
  );

  // Construct folderName from currentCompany's details
  const folderName = `${currentCompany.companyname}${currentCompany.projectname}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${ip}/list-uploads`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFetchedData(data); // Storing the fetched data in state
      } catch (error) {
        console.error("Failed to fetch:", error);
      }
    };

    fetchData();
  }, []); // Dependency array is empty, so this runs once on mount

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("zipfile", file);
    formData.append("folderName", folderName);

    try {
      const response = await fetch(`${ip}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  // Function to render files based on the folder name
  const renderFiles = () => {
    if (!fetchedData) return <p>Loading files...</p>; // Show loading state if data is not fetched yet

    const folderData = fetchedData[folderName];
    if (!folderData) return <p>No files found for the selected folder.</p>; // Show message if no data is found for the folder

    return Object.entries(folderData).map(([subFolder, detail]) => (
      <div key={subFolder}>
        <h3>{subFolder}</h3>
        <ul>
          {detail.files.map((fileName) => (
            <li key={fileName}>{fileName}</li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Uploading file for: {folderName}</h1>
      <div className={styles.fileInputContainer}>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".zip"
          className={styles.fileInput}
        />
        <button onClick={handleFileUpload} className={styles.uploadButton}>
          Upload File
        </button>
      </div>
      <div>
        <h2>File Details</h2>
        {renderFiles()}
      </div>
    </div>
  );
}

export default FileUpload;
