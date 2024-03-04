const mysql = require("mysql2/promise");
require("dotenv").config({ path: "../.env" });

// Assuming the MySQL pool is already created as shown in your previous snippet
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function addProject(projectData) {
  try {
    const query =
      "INSERT INTO projects (name, companyid, userid) VALUES (?, ?, ?)";
    const values = [
      projectData.name,
      projectData.companyid,
      projectData.userid,
    ];

    // Use the pool to execute the query
    const [results] = await pool.query(query, values);

    console.log("Project added with ID:", results.insertId);
    return {
      message: "Project added successfully",
      projectid: results.insertId,
    }; // Return the success message and project ID
  } catch (err) {
    console.error("Error adding the project:", err);
    throw err; // Rethrow the error to be handled by the caller
  }
}

async function fetchAllProjects() {
  try {
    const query = "SELECT * FROM projects";

    // Use the pool to execute the query
    const [rows] = await pool.query(query);

    console.log("Fetched all projects successfully");
    return rows; // Return the fetched rows
  } catch (err) {
    console.error("Error fetching projects:", err);
    throw err; // Rethrow the error to be handled by the caller
  }
}

module.exports = { addProject, fetchAllProjects };
