const fs = require("fs");
const path = require("path");

const readJsonFile = (relativePath) => {
  const filePath = path.join(__dirname, "..", relativePath);
  const fileContents = fs.readFileSync(filePath, "utf8");

  return JSON.parse(fileContents);
};

const writeJsonFile = (relativePath, data) => {
  const filePath = path.join(__dirname, "..", relativePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = {
  readJsonFile,
  writeJsonFile,
};
