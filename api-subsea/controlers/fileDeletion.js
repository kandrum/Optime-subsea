// fileDeletion.js

const fs = require("fs");
const path = require("path");

const deleteFile = (uploadsDir, relativeFilePath) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(uploadsDir, relativeFilePath);

    if (!fs.existsSync(filePath)) {
      return reject({ message: "Path does not exist" });
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        return reject({ message: "Failed to delete file" });
      }
      resolve({ message: "File deleted successfully" });
    });
  });
};

module.exports = deleteFile;
