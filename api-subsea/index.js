const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { readCSVAndExtractData } = require("./controlers/providekeys.js");
const app = express();
require("dotenv").config();
const { checkUser } = require("./controlers/loginControler.js");
const {
  registerUser,
  fetchAllUsers,
  updateUserActivation,
} = require("./controlers/registerControler.js");

const {
  uploadMiddleware,
  handleFileUpload,
} = require("./controlers/otherfiles.js");
const {
  addCompany,
  getAllCompanies,
  deleteCompany,
} = require("./controlers/addCompaniService");
const {
  addProject,
  fetchAllProjects,
  deleteProject,
} = require("./controlers/addProjectService.js");
const { spawn } = require("child_process");
const { upload, handleZipUpload } = require("./controlers/zipHandler.js");
const { listDirectories } = require("./controlers/listFoldersFiles");
const multer = require("multer");
const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const handleFileRequest = require("./controlers/filePathService.js");
const deleteFile = require("./controlers/fileDeletion.js");
const PORT = 1226;

// CORS options to allow all origins and all HTTP methods
const corsOptions = {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], // Allow all HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // You can adjust the headers as needed
  credentials: true, // This allows cookies to be sent alongside requests, if needed
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Use CORS middleware with the specified options
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Define routes
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
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
// Endpoint to get all users
app.get("/getallusers", fetchAllUsers);
app.patch("/updateActivation", updateUserActivation);
/* ---------------------------- POST endpoint to add a company --------------------------- */
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

/* ----------------------------------------  Endpoint to add a project --------------------- */
app.post("/addprojects", async (req, res) => {
  try {
    // Extract project data from request body
    const projectData = req.body;

    // Call the addProject function and await its response
    const result = await addProject(projectData);

    // Send success response
    res.status(201).json(result);
  } catch (err) {
    // Handle errors
    console.error("Error in /projects endpoint:", err.message);
    res.status(500).json({ message: "Failed to add project" });
  }
});

/* ---------------------------------------- get all companies ------------------------------- */
app.get("/getcompanies", async (req, res) => {
  try {
    const companies = await getAllCompanies();
    // Directly return the fetched companies data, which includes both companyid and companyname
    res.json(companies);
  } catch (err) {
    console.error("Error fetching companies:", err.message);
    res.status(500).json({ message: "Failed to fetch companies" });
  }
});

/* ---------------------------------------- get the projects ------------------------------- */

app.get("/getallprojects", async (req, res) => {
  try {
    const projects = await fetchAllProjects();
    res.status(200).json({
      message: "Projects fetched successfully",
      data: projects,
    });
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    res.status(500).json({
      message: "Failed to fetch projects",
      error: err.message,
    });
  }
});

/* ---------------------------------------- delete company ------------------------------- */
app.delete("/deletecompany", async (req, res) => {
  const { companyid } = req.body; // Extract the company ID from the request body

  if (!companyid) {
    return res.status(400).json({ message: "Company ID must be provided" });
  }

  try {
    const result = await deleteCompany(companyid);
    if (result.message === "No company found with the provided ID") {
      res.status(404).json(result); // If no company is found, send a 404 response
    } else {
      res.status(200).json(result); // Send a success response
    }
  } catch (error) {
    console.error("Failed to delete company:", error);
    res.status(500).json({
      message: "Failed to delete the company due to an internal error.",
    });
  }
});
/* ---------------------------------------- delete project ------------------------------- */
app.delete("/deleteProject", async (req, res) => {
  try {
    // Assuming the projectId is sent in the request body or as a query parameter
    const projectId = req.body.projectId || req.query.projectId;

    if (!projectId) {
      return res.status(400).send({ message: "Project ID is required" });
    }

    const result = await deleteProject(projectId);

    if (result.message === "No project found with the specified ID") {
      return res.status(404).send(result);
    } else {
      return res.status(200).send(result);
    }
  } catch (err) {
    console.error("Error in /deleteProject route:", err);
    return res
      .status(500)
      .send({ message: "Error deleting project", error: err.message });
  }
});

/* ---------------------------------------- file upload ------------------------------- */

// Example ZIP extraction function
function extractZip(zipFilePath, extractToPath) {
  // Check if the target directory exists, and if so, remove it first
  if (fs.existsSync(extractToPath)) {
    fs.rmSync(extractToPath, { recursive: true, force: true });
  }

  // Now, proceed with extraction
  const zip = new AdmZip(zipFilePath);
  try {
    zip.extractAllTo(extractToPath, true);
    console.log("Extraction complete");
    // Optionally, delete the zip file after extraction
    fs.unlinkSync(zipFilePath);
  } catch (error) {
    console.error("Extraction error:", error);
  }
}

// Example file upload and ZIP extraction endpoint
// Define the route for ZIP file upload and extraction
app.post("/upload", upload.single("zipfile"), handleZipUpload);
app.post("/otherupload", uploadMiddleware("file"), handleFileUpload);

/* ---------------------------------------- List all uploads------------------------------- */

app.get("/list-uploads", (req, res) => {
  const uploadsDir = path.join(__dirname, "uploads");
  const folderName = req.query.folder || "";

  const directoryStructure = listDirectories(uploadsDir, folderName);

  if (directoryStructure.message) {
    // Check for the 'message' in the response and return it
    res.status(200).json(directoryStructure);
  } else {
    res.json(directoryStructure);
  }
});
/* ---------------------------------------- Insert file path ------------------------------- */

app.post("/add-file", handleFileRequest);

/* ---------------------------------------- Delete file ------------------------------- */
app.delete("/delete-file", (req, res) => {
  const uploadsDir = path.join(__dirname, "uploads"); // Your uploads directory path
  // Access the path from the request body instead of req.query
  const relativeFilePath = req.body.path;

  // Ensure that the path is provided
  if (!relativeFilePath) {
    return res.status(400).json({ message: "No path provided" });
  }

  deleteFile(uploadsDir, relativeFilePath)
    .then((result) => res.json(result))
    .catch((error) => res.status(404).json(error));
});

/* ---------------------------------------- getkeys  ------------------------------- */
app.post("/getKeyData", async (req, res) => {
  const { filePath } = req.body; // Expecting the full file path to be provided in the request body
  if (!filePath) {
    return res.status(400).send("File path is required in the request body");
  }

  try {
    const data = await readCSVAndExtractData(filePath);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing the CSV file");
  }
});
/* ---------------------------------------- Analyze ------------------------------- */
app.get("/process-csv", (req, res) => {
  // Extract query parameters
  const filePath = req.query.filePath;
  const tags = req.query.tags; // Assume tags are passed as a comma-separated list
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  // Spawn Python process with filePath, tags, startDate, and endDate as arguments
  const pythonProcess = spawn("python", [
    "./controlers/process_csv.py",
    filePath,
    tags, // Pass the tags as a command line argument
    startDate,
    endDate,
  ]);

  let dataString = "";
  pythonProcess.stdout.on("data", (data) => {
    dataString += data.toString();
  });

  pythonProcess.stdout.on("end", () => {
    try {
      const jsonData = JSON.parse(dataString);
      res.json(jsonData);
    } catch (error) {
      res
        .status(500)
        .send("Dates in the filter not Availabe Choose Some Other Dates");
    }
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  pythonProcess.on("error", (error) => {
    console.error("Failed to start Python script:", error);
    res.status(500).send("Failed to process CSV file");
  });
});

/* ---------------------------------------- Start the server ------------------------------- */
app.listen(PORT, "localhost", () => {
  console.log(`Server is running on 0.0.0.0:${PORT}`);
});

//module.exports.handler = serverless(app);
