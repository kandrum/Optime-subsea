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
    const [folderName, setFolderName] = useState("SelectTheProject");
    const [formDataKey, setFormDataKey] = useState("file");
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    
    const userType = useSelector((state) => state.userType.result.role);
    const currentCompany = useSelector((state) => state.currentSelection.currentCompany);
    const navigate = useNavigate();

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
            const response = await fetch(`${ip}/list-uploads?folder=${encodeURIComponent(folderName)}`);
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

    const handleFileUpload = async () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append(formDataKey, file);
            formData.append("folderName", folderName);

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
        } finally {
            setIsLoading(false);
            fetchData();
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
            fetchData();
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
    <div className={styles["container"]} style={{ backgroundImage: `url(${gif})` }}>
        <h1 className={styles.title}>Uploading file for: {folderName}</h1>
        <div className={styles.fileInputContainer}>
            {(userType === "admin" || userType === "supervisor") && (
                <>
                    <input type="file" onChange={handleFileChange} className={file ? "" : styles.fileInput} />
                    <button onClick={handleFileUpload} className={styles.uploadButton} disabled={isLoading}>
                        Upload File
                    </button>
                </>
            )}
            <button onClick={handleAnalyzeClick} className={styles.uploadButton}>
                Analyze for {folderName}
            </button>
            {isLoading && <div className={styles.loader}></div>}
        </div>
        <div className={styles["filedetails"]}>
            <h2>File Details</h2>
            {renderFiles()}
        </div>
    </div>
);
}

export default FileUpload;
