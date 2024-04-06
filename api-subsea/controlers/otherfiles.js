const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Temporary upload directory
const tempUploadPath = path.join(__dirname, "../uploads/temp");

// Ensure the temporary upload directory exists
fs.mkdirSync(tempUploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempUploadPath);
  },
  filename: function (req, file, cb) {
    // Original filename modified to check for uniqueness
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const uniqueFilename =
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    cb(null, uniqueFilename);
  },
});

const configureMulter = () =>
  multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/(jpg|jpeg|png|gif|csv|pdf)$/)) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "Not a valid file type. Only images, CSV, and PDF files are allowed."
          ),
          false
        );
      }
    },
    limits: { fileSize: 5000 * 1024 * 1024 }, // 5 GB
  });

const uploadMiddleware = (fieldName) => {
  const upload = configureMulter();
  return upload.single(fieldName);
};

const handleFileUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded." });
  }

  // Access folderName from request body
  const folderName = req.body.folderName || "";
  const finalDestinationPath = path.join(__dirname, "../uploads", folderName);

  // Ensure final destination directory exists
  fs.mkdir(finalDestinationPath, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating directory:", err);
      return res.status(500).send({ message: "Failed to create directory." });
    }

    // Define paths for moving the file
    const tempFilePath = path.join(tempUploadPath, req.file.filename);
    const finalFilePath = path.join(finalDestinationPath, req.file.filename);

    // Rename the file if it already exists to maintain uniqueness
    let finalUniqueFilePath = finalFilePath;
    let fileCounter = 1;
    while (fs.existsSync(finalUniqueFilePath)) {
      const parsedPath = path.parse(finalFilePath);
      finalUniqueFilePath = path.join(
        parsedPath.dir,
        `${parsedPath.name}(${fileCounter})${parsedPath.ext}`
      );
      fileCounter++;
    }

    // Move the file to the final destination
    fs.rename(tempFilePath, finalUniqueFilePath, (err) => {
      if (err) {
        console.error("Error moving file:", err);
        fs.unlink(tempFilePath, (unlinkErr) => {
          if (unlinkErr)
            console.error("Error cleaning up temp file:", unlinkErr);
        });
        return res.status(500).send({ message: "Failed to move file." });
      }

      // Respond with success message and file details
      res.send({
        message: "File uploaded successfully.",
        fileInfo: {
          filename: path.basename(finalUniqueFilePath),
          path: finalUniqueFilePath,
          type: req.file.mimetype,
          folderName: folderName,
        },
      });
    });
  });
};

module.exports = { uploadMiddleware, handleFileUpload };
