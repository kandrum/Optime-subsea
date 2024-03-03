const mysql = require("mysql2");

require("dotenv").config({ path: "../.env" });

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the MySQL server:", err);
    throw err; // Consider handling this error more gracefully
  }
  console.log("Connected to the MySQL server.");
});

function registerUser(req, res) {
  const { username, password, role } = req.body;

  const query = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
  db.query(query, [username, password, role], (err, results) => {
    if (err) {
      console.error("Error registering user:", err);
      res
        .status(500)
        .json({ message: "An error occurred during registration" });
      return;
    }
    res
      .status(201)
      .json({ message: "Registration successful", userId: results.insertId });
  });
}

module.exports = { registerUser };
