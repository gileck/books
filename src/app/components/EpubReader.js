import React, { useEffect, useState, useRef } from "react";
import { Button, Slider, Switch, Box, Typography, AppBar, Toolbar } from "@mui/material";
import ePub from "epubjs";

const SimpleEpubReader = () => {
    const [book, setBook] = useState(null);
    const [currentText, setCurrentText] = useState("Loading...");
    const [fontSize, setFontSize] = useState(100);
    const [darkMode, setDarkMode] = useState(false);
    const renditionRef = useRef(null);

    useEffect(() => {
        // const bookInstance = ePub("/file.epub"); // Update with your EPUB path
        const bookInstance = ePub("https://react-reader.metabits.no/files/alice.epub"); // Update with your EPUB path
        setBook(bookInstance);

        // Attach a rendition instance
        const rendition = bookInstance.renderTo("viewer", {
            width: "100%",
            height: "100%",
        });
        renditionRef.current = rendition;

        // Display the first chapter
        bookInstance.ready.then(() => {
            console.log({ bookInstance });
            const firstChapter = bookInstance.navigation.toc[0];
            rendition.display(firstChapter.href);
        });
    }, []);

    const loadChapter = (href) => {
        if (renditionRef.current) {
            renditionRef.current.display(href);
        }
    };

    const nextChapter = () => {
        if (book && renditionRef.current) {
            renditionRef.current.next();
        }
    };

    const prevChapter = () => {
        if (book && renditionRef.current) {
            renditionRef.current.prev();
        }
    };

    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: darkMode ? "#121212" : "#fff" }}>
            <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Button variant="contained" onClick={prevChapter}>
                    Previous
                </Button>
                <Button variant="contained" onClick={nextChapter}>
                    Next
                </Button>
            </Box>

            <Box id="viewer" sx={{}} />


        </Box>
    );
};

export default SimpleEpubReader;