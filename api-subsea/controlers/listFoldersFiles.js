const fs = require("fs");
const path = require("path");

const listDirectories = (dirPath) => {
  const result = {};

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name);

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
