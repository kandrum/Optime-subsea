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

async function checkUser(userData) {
  try {
    // Update the query to also check if the user is active
    const query =
      "SELECT * FROM users WHERE username = ? AND password = ? AND isActive = 'Y' LIMIT 1";
    const values = [userData.username, userData.password];

    // Use the pool to execute the query asynchronously
    const [results] = await pool.query(query, values);

    if (results.length > 0) {
      console.log("User found and is active:", results[0].username);
      return {
        checkstatus: true,
        username: results[0].username,
        userId: results[0].userid,
        role: results[0].role,
        isActive: results[0].isActive,
      };
    } else {
      console.log("No active user found with the given username and password.");
      return null; // Indicate no user was found or the user is not active
    }
  } catch (err) {
    console.error("Error during login check:", err);
    throw err; // Rethrow the error to be handled by the caller
  }
}

module.exports = { checkUser };
