const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const Epub = require("epub-gen");

async function extractTextFromPDF(pdfPath) {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const extractedText = [];

    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
        const page = pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        extractedText.push(textContent.items.map((t) => t.str).join(" "));
    }

    return extractedText.join("\n\n");
}

async function convertPdfToEpub(pdfPath, epubOutput) {
    const pdfText = await extractTextFromPDF(pdfPath);

    const epubOptions = {
        title: "Converted EPUB",
        author: "PDF Converter",
        content: [
            {
                title: "Chapter 1",
                data: pdfText,
            },
        ],
    };

    new Epub(epubOptions, epubOutput)
        .promise.then(() => console.log("EPUB file created successfully!"))
        .catch((err) => console.error("Error generating EPUB:", err));
}

// Example usage
const pdfFilePath = path.join(__dirname, "../../files/jaws.pdf"); // Replace with your file
const epubFilePath = path.join(__dirname, "../../files/jaws-new.epub");

convertPdfToEpub(pdfFilePath, epubFilePath);
