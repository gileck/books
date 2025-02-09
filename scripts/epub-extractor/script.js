// read the epub folder files

const fs = require('fs');
const path = require('path');
const epubFolderPath = path.join(__dirname, 'output');
const epubFiles = fs.readdirSync(epubFolderPath);
const jsdom = require('jsdom');

function parseEpubHtmlFile(html) {
    // Extract the content from the HTML file
    // const content = html.match(/<body>([\s\S]*)<\/body>/)[1];
    const window = new jsdom.JSDOM(html).window;
    const document = window.document;
    const body = document.body;
    const content = body.textContent;
    return content
}

function readEpubFiles(epubFiles) {

    let text = ''
    epubFiles.forEach((file) => {
        const filePath = path.join(epubFolderPath, file);
        console.log(filePath);

        if (filePath.endsWith('.html')) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            text += parseEpubHtmlFile(fileContent)
        }

    });
    // console.log(text);
    fs.writeFileSync(path.join(__dirname, './output.txt'), text, 'utf-8');
}

readEpubFiles(epubFiles);

