import React from "react";
import styles from "./style/Contentstyle.module.css"; // Ensure this path is correct
import { useSelector } from "react-redux";

const Content = () => {
  const openAWSConsole = () => {
    window.open(
      "https://s3.console.aws.amazon.com/s3/buckets/subseaoilgas?region=us-east-2&bucketType=general&tab=objects",
      "_blank"
    );
  };

  // Accessing userType from Redux store
  const userType = useSelector((state) => state.userType);
  console.log("usertype from content", userType.result.role);

  // Accessing currentCompany (including companyname and projectname) from Redux store
  const currentCompany = useSelector(
    (state) => state.currentSelection.currentCompany
  );

  return (
    <div className={styles["content"]}>
      {/* Displaying the company name and project name */}
      {currentCompany && (
        <>
          <h1>Company Name: {currentCompany.companyname}</h1>
          <h1>Project Name: {currentCompany.projectname}</h1>
          <h1 className={styles["headingfoldername"]}>
            Go to Aws Consele, Create a folder and upload the files to be
            analyzed , the Folder-name should be{" "}
            {currentCompany.companyname + currentCompany.projectname}
          </h1>
        </>
      )}

      <p>Click the button to sign in to the AWS IAM A User</p>
      <p>Accountid: 724465909256</p>
      <br />
      <div className={styles["buttonContainer"]}>
        {" "}
        {/* Note: corrected the typo here */}
        {/* Conditional rendering based on user role */}
        {(userType.result.role === "admin" ||
          userType.result.role === "supervisor") && (
          <button onClick={openAWSConsole} className={styles.btnclass}>
            Upload File
          </button>
        )}
        <button className={styles.btnclass}>Analyze</button>
      </div>
    </div>
  );
};

export default Content;
