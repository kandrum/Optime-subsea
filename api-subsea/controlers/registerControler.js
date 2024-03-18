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

async function fetchAllUsers(req, res) {
  try {
    const query = "SELECT userid, username, role, isActive FROM users";
    const [users] = await pool.query(query);

    console.log("Fetched all users successfully");
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "An error occurred while fetching users" });
  }
}

async function updateUserActivation(req, res) {
  const { userid, isActive } = req.body;

  // Check if isActive is either "Y" or "N"
  if (!["Y", "N"].includes(isActive)) {
    return res
      .status(400)
      .json({ message: "Invalid activation status provided" });
  }

  try {
    const query = "UPDATE users SET isActive = ? WHERE userid = ?";
    const [result] = await pool.query(query, [isActive, userid]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`User activation updated successfully for userid: ${userid}`);
    res.status(200).json({
      message: `User ${userid} activation updated successfully`,
      userid: userid,
    });
  } catch (err) {
    console.error("Error updating user activation:", err);
    res
      .status(500)
      .json({ message: "An error occurred during the activation update" });
  }
}

module.exports = { registerUser, fetchAllUsers, updateUserActivation };
