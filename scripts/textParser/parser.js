// Text parser for book content
const parseTextToJSON = (text) => {
    const chapters = {};
    const lines = text.split('\n');
    let currentChapter = '';
    let buffer = {
        text: '',
        chapter: '',
        isComplete: false
    };

    const isEndOfSentence = (line) => /[.!?;]$/.test(line.trim());
    const isImageLine = (line) => /Image \d+\./.test(line.trim());
    const isChapterLine = (line) => {
        const trimmed = line.trim();
        return /^(?:\d+\s+)?CHAPTER\s+\d+$/i.test(trimmed) ||
            /^(?:\d+\s+)?INTRODUCTION$/i.test(trimmed);
    };

    const isChapterTitle = (line) => {
        return /^[A-Z\s]+$/i.test(line.trim()) && !isChapterLine(line);
    };

    const getChapterName = (line) => {
        if (/INTRODUCTION/i.test(line)) return 'INTRODUCTION';
        const match = line.match(/CHAPTER\s+\d+/i);
        return match ? match[0].toUpperCase() : null;
    };

    const getChapterNumber = (line) => {
        const match = line.match(/CHAPTER\s+(\d+)/i);
        return match ? parseInt(match[1]) : null;
    };

    const cleanLine = (line) => {
        return line.replace(/^\d+\s+/, '')  // Remove leading page numbers
            .replace(/\s+\d+$/, '')   // Remove trailing page numbers
            .replace(/CHAPTER\s+\d+$/i, '')
            .replace(/^INTRODUCTION$/i, '')
            .trim();
    };

    const addToChapter = (text, chapter) => {
        if (!text.trim()) return;
        chapter = chapter || '';
        if (!chapters[chapter]) {
            chapters[chapter] = [];
        }
        chapters[chapter].push(text.trim());
    };

    const flushBuffer = () => {
        if (buffer.text) {
            addToChapter(buffer.text, buffer.chapter);
            buffer.text = '';
            buffer.isComplete = true;
        }
    };

    const appendToBuffer = (text, addSpace = true) => {
        if (!text) return;
        if (buffer.text && addSpace) {
            buffer.text += ' ';
        }
        buffer.text += text;
    };

    // Process line by line
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;

        // Handle chapter headers
        if (isChapterLine(line)) {
            const newChapter = getChapterName(line);
            const newChapterNum = getChapterNumber(line);
            const currentChapterNum = buffer.chapter ? getChapterNumber(buffer.chapter) : null;

            // Only flush buffer if we're switching to a different chapter
            // and the sentence is complete
            const isSameChapter = newChapter === buffer.chapter ||
                (currentChapterNum && newChapterNum &&
                    newChapterNum === currentChapterNum);

            if (!isSameChapter && buffer.isComplete) {
                flushBuffer();
            }

            currentChapter = newChapter || '';
            if (!buffer.chapter) {
                buffer.chapter = currentChapter;
            }

            // Skip next line if it's a chapter title
            if (i + 1 < lines.length && isChapterTitle(lines[i + 1])) {
                i++;
            }
            continue;
        }

        // Skip chapter titles
        if (isChapterTitle(line)) {
            continue;
        }

        // Handle image lines
        if (isImageLine(line)) {
            flushBuffer();

            let imageText = line;
            while (i + 1 < lines.length && !isEndOfSentence(imageText)) {
                i++;
                const nextLine = lines[i].trim();
                if (!isChapterLine(nextLine) && !isImageLine(nextLine)) {
                    imageText += ' ' + nextLine;
                } else {
                    i--;
                    break;
                }
            }
            addToChapter(imageText.trim(), currentChapter);
            continue;
        }

        // Clean and process regular lines
        line = cleanLine(line);
        if (!line) continue;

        // Handle hyphenation
        if (line.endsWith('-')) {
            appendToBuffer(line.slice(0, -1), false);
            continue;
        }

        // Set initial chapter if needed
        if (!buffer.chapter) {
            buffer.chapter = currentChapter;
        }

        // Add line to buffer
        appendToBuffer(line);

        // Check if sentence is complete
        if (isEndOfSentence(line)) {
            flushBuffer();
            buffer.chapter = currentChapter;
        } else {
            buffer.isComplete = false;
        }
    }

    // Handle any remaining content
    flushBuffer();

    // Clean up chapters
    const result = {};
    for (const chapter in chapters) {
        const cleaned = chapters[chapter]
            .map(p => p.replace(/\s+/g, ' ').trim())
            .filter(p => p);

        if (cleaned.length > 0) {
            result[chapter] = cleaned;
        }
    }

    return result;
};

module.exports = { parseTextToJSON };

