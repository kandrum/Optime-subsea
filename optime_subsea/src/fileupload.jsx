import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ip } from "./appconstants";
import styles from "./style/fileupload.module.css";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fetchedData, setFetchedData] = useState(null);
  const [uploadEndpoint, setUploadEndpoint] = useState("");
  const [folderName, setFolderName] = useState(""); // State variable for folderName
  const [formDataKey, setFormDataKey] = useState("file"); // Default key is "file"

  // Accessing userType and currentCompany from Redux store
  const userType = useSelector((state) => state.userType);
  const currentCompany = useSelector(
    (state) => state.currentSelection.currentCompany
  );

  useEffect(() => {
    // Construct folderName from currentCompany's details
    if (currentCompany.companyname && currentCompany.projectname) {
      const newFolderName = `${currentCompany.companyname}${currentCompany.projectname}`;
      setFolderName(newFolderName);
    }
  }, [currentCompany]); // Depend on currentCompany to update folderName

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${ip}/list-uploads`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFetchedData(data);
      } catch (error) {
        console.error("Failed to fetch:", error);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return; // Exit if no file was selected

    // Check if the file is a zip file
    const isZip = selectedFile.type === "application/x-zip-compressed";

    console.log(`Selected file type: ${selectedFile.type}`); // Log the MIME type of the file

    setFile(selectedFile);
    // Set the upload endpoint based on whether the file is a zip
    setUploadEndpoint(isZip ? "/upload" : "/otherupload");

    // Set the FormData key based on the file type
    const newFormDataKey = isZip ? "zipfile" : "file";
    setFormDataKey(newFormDataKey);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    // Log the file type before uploading
    console.log(`Uploading file type: ${file.type}`);

    const formData = new FormData();
    // Use the FormData key determined based on the file type
    formData.append(formDataKey, file);
    formData.append("folderName", folderName);

    try {
      const response = await fetch(`${ip}${uploadEndpoint}`, {
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

  const renderFiles = () => {
    if (!fetchedData) return <p>Loading files...</p>;

    const folderData = fetchedData[folderName];
    if (!folderData) return <p>No files found for the selected folder.</p>;

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
