import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./style/Analyze.module.css";
import { ip } from "./appconstants";
export default function Analyze() {
  const folderName = useSelector((state) => state.currentFolder.folder);
  const [organizedData, setOrganizedData] = useState({});
  const [selectedKeys, setSelectedKeys] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    async function fetchKeyData() {
      const filePath = `uploads/${folderName}/mydata/keys.csv`;
      try {
        const response = await fetch(`${ip}/getKeyData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filePath }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOrganizedData(organizeData(data));
      } catch (error) {
        console.error("Fetching key data failed", error);
      }
    }

    if (folderName) {
      fetchKeyData();
    }
  }, [folderName]);

  const organizeData = (data) => {
    const hierarchy = {};
    data.forEach((item) => {
      const parts = item.platform.split(".");
      let currentLevel = hierarchy;

      parts.forEach((part, index) => {
        if (!currentLevel[part]) {
          currentLevel[part] =
            index === parts.length - 1
              ? { ...item, subItems: {} }
              : { subItems: {} };
        }
        currentLevel = currentLevel[part].subItems;
      });
    });
    return hierarchy;
  };

  const handleCheckboxChange = (key) => {
    setSelectedKeys((prevSelectedKeys) => ({
      ...prevSelectedKeys,
      [key]: !prevSelectedKeys[key],
    }));
  };

  const renderHierarchy = (node, path = "") => {
    return (
      <ul>
        {Object.keys(node).map((key) => {
          const fullPath = path ? `${path}.${key}` : key;
          return (
            <li key={fullPath}>
              {key.replace("Platform.", "")}
              {node[key].key && (
                <>
                  <button onClick={() => console.log(`Key: ${node[key].key}`)}>
                    tag {node[key].key}
                  </button>
                  <input
                    type="checkbox"
                    checked={selectedKeys[node[key].key] || false}
                    onChange={() => handleCheckboxChange(node[key].key)}
                  />
                </>
              )}
              {node[key].subItems &&
                Object.keys(node[key].subItems).length > 0 &&
                renderHierarchy(node[key].subItems, fullPath)}
            </li>
          );
        })}
      </ul>
    );
  };

  const handleSubmit = () => {
    console.log("Selected keys:", selectedKeys);
    console.log("Start date:", startDate);
    console.log("End date:", endDate);
    // Here you would handle the submission of the data, such as sending it to a server or processing it further.
  };

  return (
    <div className={styles.AnalyzeContainer}>
      <h1>Select Keys, Start-Date , End-Data to </h1>
      <p>Folder Name: {folderName || "No folder selected"}</p>
      <div>
        <h2>Key Data</h2>
        {Object.keys(organizedData).length > 0 ? (
          renderHierarchy(organizedData)
        ) : (
          <p>No key data available.</p>
        )}
      </div>
      <div>
        <label htmlFor="start-date">Start Date:</label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={styles.BlueDateInput}
        />
        <label htmlFor="end-date">End Date:</label>
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={styles.BlueDateInput}
        />
        <button onClick={handleSubmit} className={styles.BlueButton}>
          Analyze
        </button>
      </div>
    </div>
  );
}
