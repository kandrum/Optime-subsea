import React from "react";
import styles from "./style/Contentstyle.module.css"; // Ensure this path is correct

const Content = () => {
  // Function to open the AWS Management Console sign-in URL
  const openAWSConsole = () => {
    window.open(
      "https://s3.console.aws.amazon.com/s3/buckets/subseaoilgas?region=us-east-2&bucketType=general&tab=objects",
      "_blank"
    );
  };

  return (
    <div className={styles.content}>
      <p>Click the button to sign in to the AWS IAM A User</p>
      <p>Accountid: 724465909256</p>
      {/* Button to open AWS Management Console sign-in page */}
      <div className={styles.buttonContainer}>
        <button onClick={openAWSConsole}>Upload File</button>
        <button>Analyze</button>
      </div>
    </div>
  );
};

export default Content;
