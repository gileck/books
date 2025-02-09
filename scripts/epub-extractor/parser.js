const fs = require('fs');
const path = require('path');

function removePageNumbers(content) {
    // Use a regular expression to remove lines that contain only numbers
    return content.replace(/^\d+\s*$/gm, '');
}

function normalizeChapterTitle(title) {
    // Normalize "C H A P T E R   X" to "CHAPTER X"
    return title.replace(/C\sH\sA\sP\sT\sE\sR\s{3}/, 'CHAPTER ');
}

// function combineIncompleteLines(content) {
//     const lines = content.split('\n');
//     for (let i = 0; i < lines.length - 1; i++) {
//         if (!lines[i].endsWith('.') && !lines[i].endsWith(';') && !lines[i].endsWith(':') && !lines[i].endsWith('!') && !lines[i].endsWith('?') && /^[a-z]/.test(lines[i + 1])) {
//             lines[i] = lines[i] + ' ' + lines[i + 1];
//             lines.splice(i + 1, 1);
//             i--; // Recheck the current line after combining
//         }
//     }
//     return lines.join('\n');
// }

function addLineBreakBeforeImage(content) {
    return content.replace(/(Image \d+\.)/g, '\n$1');
}

function removeNumbersOnTheEndOfLines(content) {
    return content.replace(/\d+$/gm, '');
}

function combineIncompleteSentences2(content) {
    const lines = content.split('\n').map(line => line.trim());
    for (let i = 0; i < lines.length; i++) {
        const arrayOfLineEndings = ['.', ';', ':', '!', '?', ')', ']', '}', "\"", "'", "”"];
        const isEndsWithCapitalLetter = /^[A-Z]/.test(lines[i]);
        const isEndsWithNumber = /\d$/.test(lines[i]);
        const isNOTEndsWithCaracterArray = arrayOfLineEndings.every(ending => !lines[i].endsWith(ending))
        const isEmpty = lines[i].length === 0;
        const isEndsWithSlash = lines[i].endsWith('-');
        // if (isEndsWithSlash) {
        //     console.log("---");
        //     console.log(lines[i])
        //     console.log(">>>>");
        // }
        if (isEndsWithSlash || (!isEndsWithCapitalLetter && !isEndsWithNumber && isNOTEndsWithCaracterArray && !isEmpty)) {
            // console.log("---");
            // console.log(lines[i])
            // console.log(">>>>");


            for (let j = 1; j <= 10 && i + j < lines.length; j++) {
                if (/^[a-z]/.test(lines[i + j])) {
                    // console.log(lines[i + j]);
                    // console.log("---");

                    lines[i] = lines[i] + isEndsWithSlash ? '' : ' ' + lines[i + j];
                    lines.splice(i + j, 1);
                    i--;
                    break;
                }
            }
        }
    }
    return lines.join('\n');
}
function removeLinesWithOnlyCapitalLetters(content) {
    // and sapces
    return content.replace(/^[A-Z\s]+$/gm, '');

}

function removeEmptyLines(lines) {
    return lines.filter(line => line.trim().length > 0);
}
function removeLinesWithNumbersOnly(lines) {
    return lines.filter(line => !/^\d+$/.test(line.trim()));
}

function combineIncompleteSentences(lines) {
    lines = combineIncompleteSentencesInternal(lines, true);
    lines = combineIncompleteSentencesInternal(lines, false);
    return lines;
}
function combineIncompleteSentencesInternal(lines, shouldRunOnImages) {

    for (let i = 0; i < lines.length; i++) {
        const arrayOfLineEndings = ['.', ';', ':', '!', '?', ')', ']', '}', "'", "”"];
        const isEndsWithCapitalLetter = /[A-Z]$/.test(lines[i]);
        const isEndsWithNumber = /\d$/.test(lines[i]);
        const isNOTEndsWithCaracterArray = arrayOfLineEndings.every(ending => !lines[i].endsWith(ending))
        const isEmpty = lines[i].length === 0;
        const isEndsWithSlash = lines[i].endsWith('-');
        //print the first word of the line
        const isSentenceStartsWithImage = lines[i].startsWith('Image ')
        const sentenceHasAtLeastThreeWords = lines[i].split(' ').length >= 3;
        if (isSentenceStartsWithImage) {
            // console.log(lines[i]);
        }
        if (shouldRunOnImages && !isSentenceStartsWithImage) {
            continue;
        }
        if (!shouldRunOnImages && isSentenceStartsWithImage) {
            continue;
        }
        // const lastWordDoesDoesNotStartWithCapitalLetter = !/^[A-Z]/.test(lines[i].split(' ').pop());
        //sentence does not start with a number
        const sentenceDoesNotStartWithANumber = !/^\d:/.test(lines[i]);

        // if (isEndsWithSlash) {
        //     console.log("---");
        //     console.log(lines[i])
        //     console.log(">>>>");
        // }

        // console.log({
        //     sentenceDoesNotStartWithANumber,
        //     isEndsWithCapitalLetter,
        //     isEndsWithNumber,
        //     isNOTEndsWithCaracterArray,
        //     isEmpty,
        //     isEndsWithSlash

        // });

        if (isEndsWithSlash || (sentenceHasAtLeastThreeWords && sentenceDoesNotStartWithANumber && !isEndsWithCapitalLetter && !isEndsWithNumber && isNOTEndsWithCaracterArray && !isEmpty)) {
            console.log("Line without ending: ", lines[i]);

            for (let j = 1; j <= 10 && i + j < lines.length; j++) {
                // small letter or any of this characters: (
                if (/^[a-z]|\(/.test(lines[i + j])) {
                    console.log("Line continues: ", lines[i + j]);

                    if (isEndsWithSlash) {
                        //remove slash
                        lines[i] = lines[i].slice(0, -1);
                        //add next line without space
                        lines[i] = lines[i] + lines[i + j];
                    } else {
                        lines[i] = lines[i] + ' ' + lines[i + j];
                    }
                    lines.splice(i + j, 1);
                    i--;
                    break;
                }
            }
            console.log("result: ", lines[i + 1]);
            console.log("___________________________");


        }
    }
    return lines
}

function removeNumbersAtTheEndOfLinesAfterDot(lines) {
    return lines.map(line => {
        const match = line.match(/(\d+)\.$/);
        if (match) {
            return line.slice(0, -match[1].length) + '.';
        }
        return line;
    });
}



const arrayOfFunctions = [
    removeEmptyLines,
    removeLinesWithNumbersOnly,
    removeNumbersAtTheEndOfLinesAfterDot
]

function splitToChapters(lines) {
    const chaptersRegex = /(INTRODUCTION|C\sH\sA\sP\sT\sE\sR\s{3}\d+)/;
    let currentChapter
    const chapterSplits = lines.reduce((acc, line, index) => {
        if (lines[index]?.trim() === currentChapter || /CHAPTER \d+/.test(lines[index]?.trim())) {
            return acc
        }
        if (chaptersRegex.test(line)) {
            const chapterTitle = normalizeChapterTitle(lines[index].trim())
            const chapterName = chapterTitle === 'INTRODUCTION' ? 'INTRODUCTION' : lines[index + 1]?.trim()
            acc[chapterName] = acc[chapterName] || []
            currentChapter = chapterName
        } else {
            acc[currentChapter].push(line)
        }
        return acc;
    }, {})

    return chapterSplits
}
function runChaptersFunctions(lines) {

    const arrayOfChapterFunctions = [
        combineIncompleteSentences
    ]
    for (const func of arrayOfChapterFunctions) {
        lines = func(lines);
    }
    return lines
}
function parseBookByChapters(filePath) {
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf-8');

    // Remove page numbers
    // content = removePageNumbers(content);
    // content = combineIncompleteLines(content);
    // content = addLineBreakBeforeImage(content);
    // content = combineIncompleteSentences(content);
    // content = removeNumbersOnTheEndOfLines(content);
    // content = removeLinesWithOnlyCapitalLetters(content);
    let lines = content.split('\n').map(line => line.trim());
    for (const func of arrayOfFunctions) {
        lines = func(lines);
    }

    // return lines
    const byCapters = splitToChapters(lines)
    return Object.entries(byCapters).reduce((acc, [key, value]) => {
        acc[key] = runChaptersFunctions(value)
        return acc
    }, {})

    // Initialize an empty object to store chapters
    const chapters = {};

    // Split the content by chapter headings including "INTRODUCTION", "C H A P T E R   X", and "CHAPTER X"
    // const chapterSplits = content.split(/(INTRODUCTION|C\sH\sA\sP\sT\sE\sR\s{3}\d+|CHAPTER \d+)/);

    // Iterate through the split content and store each chapter's content in the object
    for (let i = 1; i < chapterSplits.length; i += 2) {
        let chapterTitle = chapterSplits[i].trim();
        let chapterContent = chapterSplits[i + 1].trim();

        // Normalize the chapter title
        chapterTitle = normalizeChapterTitle(chapterTitle);

        // Remove the chapter title from the content along with any surrounding new lines
        // const chapterTitleRegex = new RegExp(`^${chapterTitle}`, 'm');
        // chapterContent = chapterContent.replace(chapterTitleRegex, '').trim();

        // Split the chapter content into paragraphs
        const paragraphs = chapterContent.split(/\n/).map(paragraph => paragraph.trim());

        // Handle the special case for "INTRODUCTION"
        if (chapterTitle === 'INTRODUCTION') {
            if (chapters[chapterTitle]) {
                chapters[chapterTitle].content.push(...paragraphs);
            } else {
                chapters[chapterTitle] = {
                    name: 'INTRODUCTION',
                    content: paragraphs
                };
            }
        } else {
            // Extract the first line as the chapter name
            const lines = chapterContent.split('\n');
            // const chapterName = lines.shift().trim();
            // chapterContent = removeChapterNameFromContent(chapterContent, chapterName);
            chapterContent = lines.join('\n').trim();

            // Split the remaining content into paragraphs
            const remainingParagraphs = chapterContent.split(/\n/).map(paragraph => paragraph.trim());

            // Append content if chapter already exists, otherwise create new entry
            if (chapters[chapterTitle]) {
                chapters[chapterTitle].content.push(...remainingParagraphs);
            } else {
                chapters[chapterTitle] = {
                    name: chapterTitle,
                    content: remainingParagraphs
                };
            }
        }
    }

    return chapters;
}

// Example usage
const scriptDir = __dirname;
const filePath = path.join(scriptDir, 'output.txt');
const chapters = parseBookByChapters(filePath);

// console.log('Chapter names:', Object.keys(chapters));

// Write the chapters object to a JSON file
const outputFilePath = path.join(scriptDir, 'chapters.json');
fs.writeFileSync(outputFilePath, JSON.stringify(chapters, null, 2), 'utf-8');

console.log(`Chapters have been written to ${outputFilePath}`);