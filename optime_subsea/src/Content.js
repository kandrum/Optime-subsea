import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./style/Contentstyle.module.css"; // Ensure the path to your styles is correct
import { useNavigate } from "react-router-dom";
const Content = () => {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const currentProject = useSelector(
    (state) => state.currentSelection.currentProject
  );
  const navigate = useNavigate(); // Hook for navigation
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:8000/tag");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const sortedTags = data.unique_tags.sort((a, b) => a - b);
        setTags(sortedTags);
      } catch (error) {
        console.error("Fetching tags failed: ", error);
      }
    };

    if (currentProject) {
      fetchTags();
    }
  }, [currentProject]);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to /analyze with state
    navigate("/analyze", { state: { selectedTag, fromDate, toDate } });
  };

  if (!currentProject) {
    return <p>Please select a project to see the tags.</p>;
  }

  return (
    <div className={styles.contentContainer}>
      <div className={styles.tagsDisplayContainer}>
        <div className={styles.header}>
          <h1>Tags for project: {currentProject}</h1>
        </div>
        <ul>
          {tags.map((tag, index) => (
            <li
              key={index}
              className={styles.tag}
              onClick={() => handleTagClick(tag)}
            >{`TAG ${tag}`}</li>
          ))}
        </ul>
      </div>
      <div className={styles.filter}>
        <h2>Selected Tag: {selectedTag}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            required
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            required
          />
          <button type="submit">Analyze</button>
        </form>
      </div>
    </div>
  );
};

export default Content;
