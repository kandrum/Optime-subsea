// listDirectories.js
const fs = require("fs");
const path = require("path");

const listDirectories = (baseDirPath, folderName = "") => {
  const result = {};

  const targetDirPath = path.join(baseDirPath, folderName);

  if (!fs.existsSync(targetDirPath)) {
    // Directory does not exist, return a specific message
    return { message: "No data available" };
  }

  const entries = fs.readdirSync(targetDirPath, { withFileTypes: true });

  if (entries.length === 0) {
    // Directory is empty, return a specific message
    return { message: "No data available" };
  }

  entries.forEach((entry) => {
    const fullPath = path.join(targetDirPath, entry.name);

    if (entry.isDirectory()) {
      result[entry.name] = listDirectories(fullPath);
    } else {
      if (!result.files) {
        result.files = [];
      }
      result.files.push(entry.name);
    }
  });

  return result;
};

module.exports = { listDirectories };
