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

// This function handles the insertion of file path in server
async function handleFileRequest(req, res) {
  const { companyid, projectid, filepath } = req.body;

  try {
    const query = `INSERT INTO files (companyid, projectid, filepath) VALUES (?, ?, ?)`;
    await pool.execute(query, [companyid, projectid, filepath]);
    res.status(200).send({ message: "Success" });
  } catch (error) {
    res.status(500).send({ message: "Error", error: error.message });
  }
}

module.exports = handleFileRequest;
