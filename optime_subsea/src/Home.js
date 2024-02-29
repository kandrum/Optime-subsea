import React from "react";
import Header from "./Header";
import Layout from "./Layout";
import Content from "./Content";
import styles from "./style/Homestyle.module.css"; // Ensure the path to your styles is correct

function Home() {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.headerBackground}>
        <Header />
      </div>
      <div className={styles.layoutAndContentContainer}>
        <div className={styles.layoutContainer}>
          <Layout />
        </div>
        <div className={styles.contentContainer}>
          <Content />
        </div>
      </div>
    </div>
  );
}

export default Home;
