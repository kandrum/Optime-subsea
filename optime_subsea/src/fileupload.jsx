import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ip } from "./appconstants";
import styles from "./style/fileupload.module.css";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fetchedData, setFetchedData] = useState(null);
  const [uploadEndpoint, setUploadEndpoint] = useState("");
  const [folderName, setFolderName] = useState("");
  const [formDataKey, setFormDataKey] = useState("file");
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
  }, [currentCompany]); // Depend on current PROJECT

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${ip}/list-uploads?folder=${encodeURIComponent(folderName)}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("companies data from fileupload.jsx", data);
        setFetchedData(data);
      } catch (error) {
        console.error("Failed to fetch:", error);
      }
    };

    fetchData();
  }, [folderName]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return; // Exit if no file was selected

    // Check if the file is a zip file
    // const isZip = selectedFile.type === "application/x-zip-compressed";
    const isZip = /^application\/.*zip/i.test(selectedFile.type);

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
  const handleDeleteFile = async (filePath) => {
    try {
      const response = await fetch(`${ip}/delete-file`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: filePath }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      alert(result.message);
      // Optionally refresh the list after deleting
      // fetchData();
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file.");
    }
  };

  const renderFiles = () => {
    // Check if fetchedData is still loading or null
    if (!fetchedData) return <p>Loading files...</p>;

    // Check if the fetchedData contains the message indicating no data
    if ("message" in fetchedData) {
      return <p>{fetchedData.message}</p>;
    }

    // Helper function to get the full path of a file for deletion
    const getFilePath = (fileName, subFolder) => {
      return `${folderName}${subFolder ? "/" + subFolder : ""}/${fileName}`;
    };

    // Helper component to render file with delete icon
    const FileItem = ({ fileName, subFolder }) => (
      <li>
        {fileName}
        <span
          onClick={() => handleDeleteFile(getFilePath(fileName, subFolder))}
          style={{ cursor: "pointer", marginLeft: "10px" }}
        >
          🗑️
        </span>
      </li>
    );

    // Check if there are any root-level files to be displayed
    const rootFiles =
      fetchedData.files && fetchedData.files.length > 0 ? (
        <div>
          <h3>Root Files</h3>
          <ul>
            {fetchedData.files.map((fileName) => (
              <FileItem key={fileName} fileName={fileName} subFolder={null} />
            ))}
          </ul>
        </div>
      ) : null;

    // Map through the folder names excluding the 'files' key
    const folderFiles = Object.entries(fetchedData)
      .filter(([key]) => key !== "files")
      .map(([subFolder, detail]) => (
        <div key={subFolder}>
          <h3>{subFolder}</h3>
          <ul>
            {detail.files && detail.files.length > 0
              ? detail.files.map((fileName) => (
                  <FileItem
                    key={fileName}
                    fileName={fileName}
                    subFolder={subFolder}
                  />
                ))
              : null}
          </ul>
        </div>
      ));

    // Render both root-level files and subfolders
    return (
      <>
        {rootFiles}
        {folderFiles}
      </>
    );
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
