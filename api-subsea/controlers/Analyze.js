//../uploads/company subseadatasphere/mydata/Data.csv
const fs = require("fs");
const csv = require("csv-parser");
const moment = require("moment"); // for handling dates

function processData(filePath, tags, startDate, endDate) {
  return new Promise((resolve, reject) => {
    const results = {};
    tags.forEach((tag) => {
      results[tag] = {
        lowest: Infinity,
        highest: -Infinity,
        total: 0,
        count: 0,
      };
    });

    fs.createReadStream(filePath)
      .pipe(
        csv({
          mapValues: ({ header, index, value }) => {
            if (index === 1) return parseFloat(value);
            return value;
          },
          headers: ["tag", "value", "date"], // Manually specify headers
        })
      )
      .on("data", (data) => {
        if (
          tags.includes(data.tag) &&
          moment(data.date).isBetween(startDate, endDate, undefined, "[]")
        ) {
          const tagData = results[data.tag];
          tagData.lowest = Math.min(tagData.lowest, data.value);
          tagData.highest = Math.max(tagData.highest, data.value);
          tagData.total += data.value;
          tagData.count += 1;
        }
      })
      .on("end", () => {
        // Calculate averages
        Object.keys(results).forEach((tag) => {
          if (results[tag].count > 0) {
            results[tag].average = results[tag].total / results[tag].count;
          } else {
            delete results[tag]; // Remove tags with no data in the given range
          }
        });
        resolve(results);
      })
      .on("error", reject);
  });
}

// Example usage
const filePath = "./uploads/company subseadatasphere/high-volume/Data.csv";
const tags = ["1", "2"]; // Example tag
const startDate = "2024-02-26";
const endDate = "2024-02-27";

processData(filePath, tags, startDate, endDate)
  .then((results) => console.log(results))
  .catch((error) => console.error("Error processing CSV file:", error));
