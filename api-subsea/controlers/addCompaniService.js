const mysql = require("mysql2/promise");
require("dotenv").config({ path: "../.env" });

// Create a MySQL pool instead of a single connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function addCompany(companyData) {
  try {
    const query = "INSERT INTO company (companyname, userid) VALUES (?, ?)";
    const values = [companyData.companyname, companyData.userid];

    // Use the pool to execute the query
    const [results] = await pool.query(query, values);

    console.log("Company added with ID:", results.insertId);
    return {
      message: "Company added successfully",
      companyid: results.insertId,
    }; // Return the success message and company ID
  } catch (err) {
    console.error("Error adding the company:", err);
    throw err; // Rethrow the error to be handled by the caller
  }
}

async function getAllCompanies() {
  try {
    const query = "SELECT companyid, companyname FROM company";

    // Use the pool to execute the query
    const [results] = await pool.query(query);

    console.log("Fetched companies:", results);
    return results; // Return the fetched company data
  } catch (err) {
    console.error("Error fetching companies:", err);
    throw err; // Rethrow the error to be handled by the caller
  }
}

async function deleteCompany(companyId) {
  try {
    const query = "DELETE FROM company WHERE companyid = ?";
    const values = [companyId];

    // Use the pool to execute the query
    const [results] = await pool.query(query, values);

    if (results.affectedRows === 0) {
      console.log("No company found with ID:", companyId);
      return {
        message: "No company found with the provided ID",
      };
    } else {
      console.log("Company deleted with ID:", companyId);
      return {
        message: "Company deleted successfully",
        companyid: companyId,
      }; // Return the success message and company ID
    }
  } catch (err) {
    console.error("Error deleting the company:", err);
    throw err; // Rethrow the error to be handled by the caller
  }
}

module.exports = { addCompany, getAllCompanies, deleteCompany };
