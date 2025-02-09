const fs = require('fs');
const path = require('path');
const util = require("util");

const filesPath = path.join(__dirname);
const inputFile = 'jaws copy.txt';
const text = fs.readFileSync(path.join(__dirname, inputFile), 'utf-8');

const readFile = util.promisify(fs.readFile);

// Updated Regex Patterns
const CHAPTER_PAGE_REGEX = /^([A-Z][A-Z\s]+)\s+(\d+)\s*$/gm;
const IMAGE_REGEX = /^Image\s+(\d+)\.\s*((?:[^\n]|\n(?!\n))+)/gm;

function parseBook() {
    try {
        let bookData = {
            title: "Jaws: The Story of a Hidden Epidemic",
            chapters: [],
        };

        let chapterPositions = [];
        let matches;
        let lastPageNumber = 0;

        while ((matches = CHAPTER_PAGE_REGEX.exec(text)) !== null) {
            let chapterTitle = matches[1].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
            let pageNumber = parseInt(matches[2]);

            if (chapterTitle !== 'CHAPTER') {
                chapterPositions.push({
                    title: chapterTitle,
                    start: matches.index,
                    end: matches.index + matches[0].length,
                    page: pageNumber || lastPageNumber + 1
                });
                lastPageNumber = pageNumber || lastPageNumber + 1;
            }
        }

        let chapterGroups = {};
        for (let i = 0; i < chapterPositions.length; i++) {
            let current = chapterPositions[i];
            let next = chapterPositions[i + 1];
            let contentStart = current.end;
            let contentEnd = next ? next.start : text.length;

            if (!chapterGroups[current.title]) {
                chapterGroups[current.title] = {
                    title: current.title,
                    contentRanges: [],
                    page: current.page
                };
            }

            if (i === 0) {
                contentStart = 0;
            }

            chapterGroups[current.title].contentRanges.push({
                start: contentStart,
                end: contentEnd
            });
        }

        for (let title in chapterGroups) {
            let group = chapterGroups[title];
            let allContent = group.contentRanges.map(range =>
                text.substring(range.start, range.end)
            ).join('\n\n');

            let chapter = {
                title: group.title,
                content: extractParagraphs(cleanText(allContent), group.page),
                images: [],
                page_start: group.page
            };

            if (chapter.content.length > 0) {
                bookData.chapters.push(chapter);
            }
        }

        extractImages(text, bookData);
        return bookData;
    } catch (error) {
        console.error("Error parsing book:", error);
    }
}

// Function to clean unnecessary text
function cleanText(text) {
    return text
        .replace(/^[A-Z][A-Z\s]+(?:\s+\d+)?$/gm, '') // Remove chapter titles
        .replace(/^Image \d+\..*?(?=\n\n|\n$|$)/gms, '')
        .replace(/\f/g, '')
        .replace(/^\s*\d+\s*$/gm, '')
        .replace(/\n(?!\n)/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Function to split text into paragraphs
function extractParagraphs(text, startPage) {
    let paragraphs = text.split(/\n\s*\n+/);
    let result = [];

    for (let paragraph of paragraphs) {
        paragraph = paragraph.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        if (paragraph.length > 0) {
            result.push({ page_number: startPage, text: paragraph });
        }
    }

    return result;
}

// Function to extract images and assign them to chapters
function extractImages(text, bookData) {
    let matches;
    while ((matches = IMAGE_REGEX.exec(text)) !== null) {
        let [_, imageNumber, description] = matches;
        let imagePosition = matches.index;
        let image = {
            image_id: parseInt(imageNumber),
            description: description.trim().replace(/\n(?!\n)/g, ' ').replace(/\s+/g, ' ')
        };

        let targetChapter = null;
        let minDistance = Infinity;

        for (let chapter of bookData.chapters) {
            let chapterStart = text.indexOf(chapter.title.split(' ')[0]);
            if (chapterStart < imagePosition && (imagePosition - chapterStart) < minDistance) {
                minDistance = imagePosition - chapterStart;
                targetChapter = chapter;
            }
        }

        if (targetChapter) {
            targetChapter.images.push(image);
        }
    }
}

// Run the parser
const data = parseBook();
console.log({ data });

const outputFilePath = path.join(__dirname, 'output.json');
fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2));
