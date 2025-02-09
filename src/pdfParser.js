const fs = require('fs');
const pdfParse = require('pdf-parse');

// Read the PDF file into a buffer
const path = require('path');
const filesPath = path.join(__dirname, '../files');
const outputTextPath = path.join(__dirname, '../output/text.txt');
const file = fs.readdirSync(filesPath)[0];

const filePath = path.join(filesPath, file);
const buffer = fs.readFileSync(filePath);



pdfParse(buffer)
    .then(function (data) {
        fs.writeFileSync(outputTextPath, data.text);
    })
    .catch(err => {
        console.error('Error parsing PDF:', err);
    });
