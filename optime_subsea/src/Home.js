import React from "react";
import Header from "./Header";
import Content from "./Content";
import styles from "./style/Homestyle.module.css"; // Ensure the path to your styles is correct
import { useSelector } from "react-redux"; // Corrected import statement

function Home() {
  // Access the userType state using the useSelector hook
  const userType = useSelector((state) => state.userType);
  const Project_clicked = useSelector((state) => state.clickAdd.clicked);
  const company_clicked = useSelector(
    (state) => state.clickProjectReducer.clicked
  );
  // Log the userType state
  React.useEffect(() => {
    console.log("Current User Type from Homecomponent:", userType);
  }, [userType]);

  console.log("from Home company", Project_clicked);
  console.log("from home project", company_clicked);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.headerBackground}>
        <Header />
      </div>
      <div className={styles.layoutAndContentContainer}>
        <div className={styles.contentContainer}>
          <Content />
        </div>
      </div>
    </div>
  );
}

export default Home;
