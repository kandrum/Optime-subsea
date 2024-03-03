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

function addCompany(companyData) {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO company (companyname, userid) VALUES (?, ?)";
    const values = [companyData.companyname, companyData.userid];

    db.query(query, values, (err, results) => {
      if (err) {
        console.error("Error adding the company:", err);
        reject(err); // Pass the error to the caller
      } else {
        console.log("Company added with ID:", results.insertId);
        resolve({
          message: "Company added successfully",
          companyid: results.insertId,
        }); // Resolve the promise with the company ID
      }
    });
  });
}

module.exports = { addCompany };
