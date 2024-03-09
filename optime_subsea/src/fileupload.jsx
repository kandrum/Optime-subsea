import React, { useState } from "react";
import { useSelector } from "react-redux";

function FileUpload() {
  const [file, setFile] = useState(null);

  // Accessing userType and currentCompany from Redux store
  const userType = useSelector((state) => state.userType);
  const currentCompany = useSelector(
    (state) => state.currentSelection.currentCompany
  );

  // Construct folderName from currentCompany's details
  const folderName = `${currentCompany.companyname}${currentCompany.projectname}`;
  console.log(
    "User type:",
    userType.result.role,
    "Uploading file for:",
    folderName
  );

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
    // Include folderName in the FormData
    formData.append("folderName", folderName);

    try {
      const response = await fetch("http://localhost:1226/upload", {
        // Adjusted for relative URL, assuming same origin policy
        method: "POST",
        body: formData,
        // No headers included as FormData sets the Content-Type to 'multipart/form-data' automatically
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

  return (
    <div>
      <h1>Uploading file for: {folderName}</h1>
      <input type="file" onChange={handleFileChange} accept=".zip" />
      <button onClick={handleFileUpload}>Upload File</button>
    </div>
  );
}

export default FileUpload;
