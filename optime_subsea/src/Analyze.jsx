import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Analyze() {
  const folderName = useSelector((state) => state.currentFolder.folder);
  const [organizedData, setOrganizedData] = useState({});

  useEffect(() => {
    async function fetchKeyData() {
      const filePath = `uploads/${folderName}/mydata/keys.csv`;
      try {
        const response = await fetch("http://localhost:1226/getKeyData", {
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

  const renderHierarchy = (node) => {
    return (
      <ul>
        {Object.keys(node).map((key) => (
          <li key={key}>
            {key.replace("Platform.", "")}{" "}
            {/* Removes the 'Platform.' prefix */}
            {node[key].key && ( // If there is a key, render a button
              <button onClick={() => console.log(`Key: ${node[key].key}`)}>
                tag {node[key].key}
              </button>
            )}
            {Object.keys(node[key].subItems).length > 0 &&
              renderHierarchy(node[key].subItems)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h1>Analyze Component</h1>
      <p>Folder Name: {folderName || "No folder selected"}</p>
      <div>
        <h2>Key Data</h2>
        {Object.keys(organizedData).length > 0 ? (
          renderHierarchy(organizedData)
        ) : (
          <p>No key data available.</p>
        )}
      </div>
    </div>
  );
}
