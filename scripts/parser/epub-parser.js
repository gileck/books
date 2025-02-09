const fs = require("fs");
const path = require("path");
const EPub = require("epub");

// Function to convert EPUB to JSON
const convertEpubToJson = (epubPath, outputJsonPath) => {
    const epub = new EPub(epubPath);

    epub.on("error", (err) => {
        console.error("EPUB Parsing Error:", err);
    });

    epub.on("end", async () => {
        // Extract metadata
        const metadata = {
            title: epub.metadata.title,
            author: epub.metadata.creator,
            publisher: epub.metadata.publisher,
            language: epub.metadata.language,
        };

        // Extract TOC (Table of Contents)
        const toc = epub.toc.map((chapter) => ({
            title: chapter.title,
            href: chapter.href,
        }));

        // Extract all chapters content
        const chapters = [];

        for (const chapter of epub.toc) {
            try {
                const chapterContent = await new Promise((resolve, reject) => {
                    epub.getChapter(chapter.id, (error, text) => {
                        if (error) reject(error);
                        resolve(text);
                    });
                });

                chapters.push({
                    title: chapter.title,
                    href: chapter.href,
                    content: chapterContent,
                });
            } catch (error) {
                console.error(`Error fetching chapter ${chapter.title}:`, error);
            }
        }

        // Construct the final JSON object
        const jsonOutput = {
            metadata,
            toc,
            chapters,
        };

        // Write to a JSON file
        fs.writeFileSync(outputJsonPath, JSON.stringify(jsonOutput, null, 2), "utf-8");
        console.log("EPUB converted to JSON successfully!");
    });

    // Start parsing the EPUB file
    epub.parse();
};

// Example usage
const epubFilePath = path.join(__dirname, "../../files/jaws.epub")
const outputJsonPath = path.join(__dirname, "output.json");

convertEpubToJson(epubFilePath, outputJsonPath);

