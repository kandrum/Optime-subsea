import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ip } from "./appconstants";
import styles from "./style/fileupload.module.css";
import { useNavigate } from "react-router-dom";
import gif from "./login.gif";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fetchedData, setFetchedData] = useState(null);
  const [uploadEndpoint, setUploadEndpoint] = useState("");
  const [folderName, setFolderName] = useState(null);
  const [formDataKey, setFormDataKey] = useState("file");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasMyData, setHasMyData] = useState(false);

  const dispatch = useDispatch();

  const userType = useSelector((state) => state.userType.result.role);
  const currentCompany = useSelector(
    (state) => state.currentSelection.currentCompany
  );
  const navigate = useNavigate();

  useEffect(() => {
    // This effect updates hasMyData based on fetchedData's state
    setHasMyData(fetchedData ? fetchedData.hasOwnProperty("mydata") : false);
  }, [fetchedData]);
  useEffect(() => {
    if (currentCompany.companyname && currentCompany.projectname) {
      const newFolderName = `${currentCompany.companyname}${currentCompany.projectname}`;
      dispatch({
        type: "SET_CURRENT_FOLDER",
        payload: { folder: newFolderName, path: "pathString" },
      });
      setFolderName(newFolderName);
    }
  }, [currentCompany, dispatch]);

  useEffect(() => {
    fetchData();
  }, [folderName]);

  const handleAnalyzeClick = () => {
    navigate("/analyze");
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${ip}/list-uploads?folder=${encodeURIComponent(folderName)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setFetchedData(data);
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null);
      return;
    }
    const isZip = /^application\/.*zip/i.test(selectedFile.type);
    setFile(selectedFile);
    setUploadEndpoint(isZip ? "/upload" : "/otherupload");
    setFormDataKey(isZip ? "zipfile" : "file");
  };

  const handleFileUpload = () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append(formDataKey, file);
    formData.append("folderName", folderName);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${ip}${uploadEndpoint}`, true);

    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        setUploadProgress(progress);
        if (progress === 100) {
          // File is fully uploaded but not necessarily processed
          setIsProcessing(true);
        }
      }
    };

    xhr.onload = function () {
      if (xhr.status === 200) {
        // Success
        const result = JSON.parse(xhr.responseText);
        alert(result.message);
      } else {
        // Error
        alert("Error uploading file.");
      }
      setIsLoading(false);
      setIsProcessing(false);
      setUploadProgress(0); // Reset progress
      fetchData(); // Refresh the data
    };

    xhr.onerror = function () {
      alert("Error uploading file.");
      setIsLoading(false);
      setIsProcessing(false);
      setUploadProgress(0); // Reset progress
    };

    xhr.send(formData);
  };

  const handleDeleteFile = async (filePath) => {
    // Ask user for confirmation before deleting
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );

    // Proceed with deletion only if user confirmed
    if (isConfirmed) {
      try {
        const response = await fetch(`${ip}/delete-file`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ path: filePath }),
        });

        if (!response.ok) {
          // If the response is not ok, throw an error to jump to the catch block
          throw new Error("Network response was not ok");
        }

        // If everything is fine, read the response and alert the user
        const result = await response.json();
        alert(result.message);
        fetchData();
      } catch (error) {
        console.error("Error deleting file:", error);
        alert("Error deleting file."); // You could improve by using the error message from the response
      }
    } else {
      console.log("File deletion was canceled by the user.");
    }
  };

  const handleFileooClick = async (filePath) => {
    // Here you can either display the file content directly
    // or provide a download link depending on the file type
    const fileUrl = `${ip}/files/${encodeURIComponent(filePath)}`;
    window.open(fileUrl, "_blank");
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
      <li
        onClick={() => handleFileooClick(getFilePath(fileName, subFolder))}
        style={{ cursor: "pointer" }}
      >
        {fileName}
        {(userType === "admin" || userType === "supervisor") && (
          <span
            onClick={() => handleDeleteFile(getFilePath(fileName, subFolder))}
            style={{ cursor: "pointer", marginLeft: "10px" }}
          >
            🗑️
          </span>
        )}
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
    <div
      className={styles["container"]}
      style={{ backgroundImage: `url(${gif})` }}
    >
      <h1 className={styles.title}>{folderName}</h1>
      <div className={styles.fileInputContainer}>
        {(userType === "admin" || userType === "supervisor") && (
          <>
            <input
              type="file"
              onChange={handleFileChange}
              className={file ? "" : styles.fileInput}
            />
            <button
              onClick={handleFileUpload}
              className={styles.uploadButton}
              disabled={isLoading}
            >
              Upload File
            </button>
          </>
        )}

        {folderName != null &&
          hasMyData && ( // Corrected the logic here to check for hasMyData's state
            <button
              onClick={handleAnalyzeClick}
              className={styles.uploadButton}
            >
              Analyze for {folderName}
            </button>
          )}

        {isProcessing && (
          <div>
            <p>Processing file...</p>
          </div>
        )}
        {isLoading && uploadProgress < 100 && (
          <div>
            <p>Uploading: {Math.round(uploadProgress)}%</p>
          </div>
        )}
      </div>
      <div className={styles["filedetails"]}>
        <h2>File Details</h2>
        {renderFiles()}
      </div>
    </div>
  );
}

export default FileUpload;
