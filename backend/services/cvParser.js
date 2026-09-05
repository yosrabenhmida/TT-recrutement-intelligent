// services/cvParser.js
const { PDFParse } = require("pdf-parse");
const fs = require("fs");

exports.extractTextFromCV = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: dataBuffer });

  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy(); // libère les ressources même en cas d'erreur
  }
};
