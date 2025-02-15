function removeNumbersAtTheEndOfLinesAfterDot(lines) {
    return lines.map(line => {
        const match = line.match(/(\d+)\.$/);
        if (match) {
            return line.slice(0, -match[1].length) + '.';
        }
        return line;
    });
}
function removeEmptyLines(lines) {
    return lines.filter(line => line.trim().length > 0);
}
function removeLinesWithNumbersOnly(lines) {
    return lines.filter(line => !/^\d+$/.test(line.trim()));
}
// Text parser for book content
const arrayOfFunctions = [
    removeEmptyLines,
    // removeLinesWithNumbersOnly,
    // removeNumbersAtTheEndOfLinesAfterDot,

]

function splitToChapters(lines) {
    const chaptersRegex = /(INTRODUCTION|CHAPTER \d+)/;
    let currentChapter
    const chapterSplits = lines.reduce((acc, line, index) => {
        const lineContent = line.trim()
        if (lineContent.includes(currentChapter) || lineContent === currentChapter || /\d+ CHAPTER \d+/.test(lineContent)) {
            return acc
        }
        if (chaptersRegex.test(line)) {
            const chapterTitle = lineContent
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
function combineIncompleteSentencesInternal(lines, shouldRunOnImages = false) {

    for (let i = 0; i < lines.length; i++) {
        const arrayOfLineEndings = ['.', ';', ':', '!', '?', ']', '}'];
        const isEndsWithCapitalLetter = /[A-Z]$/.test(lines[i]);
        // const isEndsWithNumber = /\d$/.test(lines[i]);
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
        const sentenceDoesNotStartWithImage = !lines[i].startsWith('Image ');

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

        if (isEndsWithSlash || (sentenceHasAtLeastThreeWords && sentenceDoesNotStartWithANumber && !isEndsWithCapitalLetter && isNOTEndsWithCaracterArray && !isEmpty)) {
            // console.log("Line without ending: ", lines[i]);

            // const nextLine = lines[i + 1];
            // if (nextLine && !nextLine.startsWith('Image ')) {
            //     lines[i] = lines[i] + ' ' + nextLine;
            //     lines.splice(i + 1, 1);
            //     i--;
            // }

            for (let j = 1; j <= 2 && i + j < lines.length; j++) {
                // small letter or any of this characters: (
                if (lines[i + j].startsWith('Image ')) {
                    continue
                }
                if (/^[a-z]|\(/.test(lines[i + j]) && !lines[i + j].startsWith('Image ')) {
                    // console.log("Line continues: ", lines[i + j]);

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
            // console.log("result: ", lines[i + 1]);
            // console.log("___________________________");


        }
    }
    return lines
}
const parseTextToJSON = (text) => {
    let lines = text.split('\n').map(line => line.trim());
    for (const func of arrayOfFunctions) {
        lines = func(lines);
    }
    const chapters = splitToChapters(lines);
    return Object.entries(chapters).reduce((acc, [key, value]) => {
        acc[key] = combineIncompleteSentencesInternal(value)
        return acc
    }, {})


};

module.exports = { parseTextToJSON };

