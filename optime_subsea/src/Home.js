import React from "react";
import Header from "./Header";
import Content from "./Content";
import styles from "./style/Homestyle.module.css";
import { useSelector } from "react-redux";
import AddCompanyAndProjectForm from "./addCompany";

function Home() {
  // Redux selectors and useEffect hook here

  return (
    <div className={styles.homeContainer}>
      <header className={styles.headerBackground}>
        <Header />
        {/* ... header content ... */}
      </header>
      <div className={styles.mainLayout}>
        <aside className={styles.leftSidebarContainer}>
          <AddCompanyAndProjectForm />
          {/* ... sidebar content ... */}
        </aside>
        <main className={styles.contentContainer}>
          <Content />
          {/* ... main content ... */}
        </main>
      </div>
    </div>
  );
}

export default Home;
