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
function fixWordsWithDash(lines) {
    return lines.map(line => {
        return line.replace(/(\w+)- (\w+)/g, '$1$2');
    });
}
// Text parser for book content
const arrayOfFunctions = [
    removeEmptyLines,
    fixWordsWithDash,
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
function combineIncompleteSentencesInternal(lines) {

    for (let i = 0; i < lines.length; i++) {
        const arrayOfLineEndings = ['.', ';', ':', '!', '?', ']', '}', "”"];
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
        // if (lines[i + 1]?.startsWith('Image ')) {
        //     continue
        // }
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
                if (/^[a-z]|^I\s|^\(/.test(lines[i + j])) {
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

function removeStudyNumbers(lines) {
    // We need to track the study number sequence across all lines
    let currentStudyNumber = 1;
    
    // Process each line while maintaining the sequence across lines
    return lines.map(line => {
        // Handle the case where study numbers appear immediately after a period
        // We need to process these in a loop to handle multiple occurrences
        let modified = true;
        while (modified) {
            modified = false;
            // Pattern: word ending with period followed by a number (e.g., "sentence.1")
            const regex = new RegExp(`\\.(${currentStudyNumber})\\b`, 'g');
            if (regex.test(line)) {
                line = line.replace(regex, '.');
                currentStudyNumber++;
                modified = true;
            }
        }
        
        // Handle the case where study numbers appear at the end of words (e.g., "end"1)
        modified = true;
        while (modified) {
            modified = false;
            // Pattern: word ending with a quote followed by a number (e.g., "end"1)
            const wordEndRegex = new RegExp(`"(\\w+)"${currentStudyNumber}\\b`, 'g');
            if (wordEndRegex.test(line)) {
                line = line.replace(wordEndRegex, '"$1"');
                currentStudyNumber++;
                modified = true;
            }
        }
        
        // Split the line into words and process each word
        const words = line.split(' ');
        const processedWords = [];
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const prevWord = i > 0 ? words[i-1] : '';
            
            // Skip study numbers that follow "Image"
            if (prevWord === 'Image') {
                processedWords.push(word);
                continue;
            }
            
            // Check for different formats of study numbers
            // Format: just the number
            if (word === currentStudyNumber.toString()) {
                currentStudyNumber++;
                // Skip this word (remove the study number)
            }
            // Format: number followed by period (e.g., "1.")
            else if (word === currentStudyNumber.toString() + '.') {
                currentStudyNumber++;
                processedWords.push('.'); // Keep the period, remove the number
            }
            // Format: period followed by number (e.g., ".1")
            else if (word === '.' + currentStudyNumber.toString()) {
                currentStudyNumber++;
                processedWords.push('.'); // Keep the period, remove the number
            }
            // Check for study number at the end of a word (e.g., "word1")
            else if (word.endsWith(currentStudyNumber.toString()) && 
                    !word.startsWith(currentStudyNumber.toString()) && 
                    /\D\d+$/.test(word)) {
                const numberPart = currentStudyNumber.toString();
                processedWords.push(word.slice(0, -numberPart.length));
                currentStudyNumber++;
            }
            else {
                processedWords.push(word); // Keep non-study numbers and other words
            }
        }
        
        // Join back to a line
        return processedWords.join(' ');
    });
}
const parseTextToJSON = (text) => {
    let lines = text.split('\n').map(line => line.trim());
    for (const func of arrayOfFunctions) {
        lines = func(lines);
    }
    const chapters = splitToChapters(lines);
    return Object.entries(chapters).reduce((acc, [key, value]) => {
        acc[key] = combineIncompleteSentencesInternal(removeStudyNumbers(value))
        return acc
    }, {})


};

module.exports = { parseTextToJSON, removeStudyNumbers };
