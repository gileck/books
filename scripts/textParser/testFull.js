const fs = require('fs');
const path = require('path');
const { parseTextToJSON } = require('./parser2');

const inputFile = process.argv[2] || path.join(__dirname, './book.txt');

if (!inputFile) {
    console.error('Please provide an input file path');
    process.exit(1);
}

const text = fs.readFileSync(inputFile, 'utf-8');
const result = parseTextToJSON(text);

// Save the result
const outputPath = path.join(path.dirname(inputFile), 'chapters.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.log(`Parsed results saved to ${outputPath}`);

//copy to public folder as chapters.json
const publicPath = path.join(__dirname, '../../public/chapters.json');
fs.copyFileSync(outputPath, publicPath);
console.log(`Copied to public folder as chapters.json`);