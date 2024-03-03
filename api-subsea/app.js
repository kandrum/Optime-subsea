const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { checkUser } = require("./controlers/loginControler.js");
const { registerUser } = require("./controlers/registerControler.js");
const { addCompany } = require("./controlers/addCompaniService");

const PORT = 1226;

// CORS options to allow all origins and all HTTP methods
const corsOptions = {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow all HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // You can adjust the headers as needed
  credentials: true, // This allows cookies to be sent alongside requests, if needed
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Use CORS middleware with the specified options
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Define routes
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.get("/api/data", (req, res) => {
  res.json({ message: "Here is some data" });
});

app.post("/logincheck", (req, res) => {
  const userData = req.body;

  checkUser(userData)
    .then((result) => {
      if (result && result.checkstatus) {
        // User found, send a success response
        res.status(200).json({ message: "Login successful", result: result });
      } else {
        // No user found, send a not found response
        res
          .status(404)
          .json({ message: "User not found or incorrect password" });
      }
    })
    .catch((err) => {
      // Error handling, send a server error response
      console.error("Error during login check:", err);
      res.status(500).json({ message: "An error occurred during login check" });
    });
});
//creating a new router to recive data from frontend
app.post("/register", registerUser);

// POST endpoint to add a company
app.post("/addcompany", (req, res) => {
  const { companyname, userid } = req.body;

  // Call the addCompany function with the company data
  addCompany({ companyname, userid })
    .then((result) => {
      // Send a success response with the result
      res.status(201).json(result);
    })
    .catch((error) => {
      // Send an error response
      res.status(500).json({ message: "Error adding company", error });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
