const multer = require("multer");
const yauzl = require("yauzl");
const fs = require("fs");
const path = require("path");

// Configure Multer for file uploads, setting a storage destination and file size limit
const upload = multer({
  dest: path.join(__dirname, "../uploads/"),
  limits: { fileSize: 5000 * 1024 * 1024 }, // 5000 MB or 5 GB
});

// Function to handle ZIP file upload and extraction
const handleZipUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded." });
  }

  const folderName = req.body.folderName;
  if (!folderName) {
    return res.status(400).send({ message: "Folder name is required." });
  }

  const zipFilePath = req.file.path;
  const extractPath = path.join(__dirname, "../uploads", folderName);

  // Check for potential directory traversal vulnerabilities
  if (
    !extractPath.startsWith(path.normalize(path.join(__dirname, "../uploads/")))
  ) {
    return res.status(400).send({ message: "Invalid folder name provided." });
  }

  // Open the ZIP file using yauzl
  yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
    if (err) {
      console.error("Error opening ZIP file:", err);
      return res.status(500).send({ message: "Error processing ZIP file." });
    }

    zipfile.readEntry();
    zipfile.on("entry", (entry) => {
      const fullPath = path.join(extractPath, entry.fileName);

      // Check if the entry is a directory
      if (/\/$/.test(entry.fileName)) {
        fs.mkdir(fullPath, { recursive: true }, (err) => {
          if (err) {
            console.error("Error creating directory:", err);
            return;
          }
          zipfile.readEntry();
        });
      } else {
        // Ensure the directory exists before trying to write the file
        fs.mkdir(path.dirname(fullPath), { recursive: true }, (err) => {
          if (err) {
            console.error("Error creating directory for file:", err);
            return;
          }
          zipfile.openReadStream(entry, (err, readStream) => {
            if (err) {
              console.error("Error reading ZIP stream:", err);
              return;
            }
            const writeStream = fs.createWriteStream(fullPath);
            readStream.pipe(writeStream).on("finish", () => {
              zipfile.readEntry();
            });
          });
        });
      }
    });

    zipfile.on("end", () => {
      console.log("Extraction complete");
      // Clean up the uploaded zip file
      fs.unlink(zipFilePath, (err) => {
        if (err) {
          console.error("Error deleting ZIP file:", err);
        }
      });
      res.send({
        message:
          "File uploaded and extracted successfully into the specified folder.",
      });
    });
  });
};

module.exports = { upload, handleZipUpload };
