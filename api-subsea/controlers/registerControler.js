const mysql = require("mysql2/promise");
require("dotenv").config({ path: "../.env" });

// Create a pool of connections instead of a single connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function registerUser(req, res) {
  const { username, password, role } = req.body;

  try {
    const query =
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
    const [results] = await pool.query(query, [username, password, role]);

    console.log("User registration successful, ID:", results.insertId);
    res
      .status(201)
      .json({ message: "Registration successful", userId: results.insertId });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "An error occurred during registration" });
  }
}

module.exports = { registerUser };
