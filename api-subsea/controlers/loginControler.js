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
    const query =
      "SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1";
    const values = [userData.username, userData.password];

    // Use the pool to execute the query asynchronously
    const [results] = await pool.query(query, values);

    if (results.length > 0) {
      console.log("User found:", results[0].username);
      return {
        checkstatus: true,
        username: results[0].username,
        userId: results[0].userid,
        role: results[0].role,
      };
    } else {
      console.log("No user found with the given username and password.");
      return null; // Indicate no user was found
    }
  } catch (err) {
    console.error("Error during login check:", err);
    throw err; // Rethrow the error to be handled by the caller
  }
}

module.exports = { checkUser };
