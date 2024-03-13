const fs = require("fs");
const readline = require("readline");

function readCSVAndExtractData(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    const lineReader = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    lineReader.on("line", (line) => {
      const str = line.split(","); // Split the line by comma
      const key = str[0].trim(); // First value
      const platform = str[1].trim(); // Second value
      results.push({ key, platform });
    });

    lineReader.on("close", () => {
      resolve(results);
    });

    lineReader.on("error", (error) => {
      reject(error);
    });
  });
}

module.exports = { readCSVAndExtractData };
