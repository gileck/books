import { Box, Slider, CircularProgress, Fab } from '@mui/material';
import VerticalAlignCenterIcon from '@mui/icons-material/VerticalAlignCenter';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ReaderContent } from './ReaderContent';
import { useTheme } from '@mui/material/styles';
import { useSettings } from '../contexts/SettingsContext';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { SelectionFAB } from './SelectionFAB';
import { TextQuestionPanel } from './TextQuestionPanel';

const WINDOW_SIZE = 10; // Number of sentences to show above and below

export function MainTextContent({ images, wordSpeed, timepoints, audio, currentChunkIndex, textChunks, onChunkSelect, onChunksFinished, isBookmarked, currentChapterIndex }) {

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isInitialScrollComplete, setIsInitialScrollComplete] = useState(false);
    const [isCurrentChunkVisible, setIsCurrentChunkVisible] = useState(true);
    const [selectedText, setSelectedText] = useState('');
    const [showSelectionFAB, setShowSelectionFAB] = useState(true);
    const [questionPanel, setQuestionPanel] = useState(null);

    const theme = useTheme();
    const { settings } = useSettings();

    const [visibleRange, setVisibleRange] = useState({
        start: Math.max(0, currentChunkIndex - WINDOW_SIZE),
        end: currentChunkIndex + WINDOW_SIZE
    });

    const containerRef = useRef(null);
    const topTriggerRef = useRef(null);
    const bottomTriggerRef = useRef(null);

    useLayoutEffect(() => {
        const element = document.getElementById(`chunk-${currentChunkIndex}`);


        if (element) {
            setIsInitialScrollComplete(false); // Reset before new scroll
            const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            wait(500).then(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });

            // Wait for smooth scroll to complete
            const timer = setTimeout(() => {
                setIsInitialScrollComplete(true);
            }, 2500); // Adjust timing based on your scroll animation duration

            return () => clearTimeout(timer);
        }

    }, [currentChunkIndex, textChunks.length]);

    useEffect(() => {
        if (!audio) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => {
            if (currentChunkIndex === textChunks.length - 1) {
                setCurrentWordIndex(0);
                onChunksFinished()
            }
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [audio, timepoints]);

    useEffect(() => {
        if (!audio) {
            return
        }
        setCurrentWordIndex(0);
        const handleTimeUpdate = () => {
            if (timepoints.length === 0) return;
            const currentTime = audio.currentTime + wordSpeed
            // console.log(audio.currentTime, currentTime);

            let closestIndex = -1;

            if (currentTime < timepoints[0].timeSeconds) {
                setCurrentWordIndex(0);
                return
            }

            for (let i = closestIndex === -1 ? 0 : closestIndex; i < timepoints.length; i++) {
                if (currentTime >= timepoints[i].timeSeconds &&
                    (i === timepoints.length - 1 || currentTime < timepoints[i + 1].timeSeconds)) {
                    closestIndex = i;
                    break;
                }
            }

            // console.log({ closestIndex });
            if (closestIndex !== -1) {
                setCurrentWordIndex(closestIndex);
            }
        }

        audio.addEventListener('timeupdate', handleTimeUpdate);
        return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
    }, [audio, timepoints]);



    // Add scroll monitoring effect
    useEffect(() => {
        if (!isInitialScrollComplete || !containerRef.current) return;

        const options = {
            root: containerRef.current,
            threshold: 0.1, // More tolerant threshold
            rootMargin: '200px 0px', // Creates a 200px buffer zone top and bottom
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                // Only trigger when element is at least 10% visible
                if (!entry.isIntersecting || entry.intersectionRatio < 0.1) return;

                if (entry.target === topTriggerRef.current && visibleRange.start > 0) {
                    setVisibleRange(prev => ({
                        start: Math.max(0, prev.start - WINDOW_SIZE),
                        end: prev.end
                    }));
                } else if (entry.target === bottomTriggerRef.current && visibleRange.end < textChunks.length) {
                    setVisibleRange(prev => ({
                        start: prev.start,
                        end: Math.min(textChunks.length, prev.end + WINDOW_SIZE)
                    }));
                }
            });
        }, options);

        if (topTriggerRef.current) observer.observe(topTriggerRef.current);
        if (bottomTriggerRef.current) observer.observe(bottomTriggerRef.current);

        return () => observer.disconnect();
    }, [isInitialScrollComplete, visibleRange.start, visibleRange.end, textChunks.length]);

    // Add observer for current chunk visibility
    useEffect(() => {
        const currentElement = document.getElementById(`chunk-${currentChunkIndex}`);
        if (!currentElement || !containerRef.current) return;

        const options = {
            root: containerRef.current,
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                setIsCurrentChunkVisible(entry.isIntersecting);
            });
        }, options);

        observer.observe(currentElement);
        return () => observer.disconnect();
    }, [currentChunkIndex, containerRef.current, textChunks.length]);

    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();

            const text = selection.toString().trim();

            setSelectedText(text);
            // setShowSelectionFAB(text.length > 0);
        };

        document.addEventListener('selectionchange', handleSelection);

        return () => document.removeEventListener('selectionchange', handleSelection);
    }, []);

    const handleQuestionAction = (actionType, customQuestion = '') => {
        // // Get the last 3 sentences including the selected one
        // const selection = window.getSelection();

        // const range = selection.getRangeAt(0);
        // const selectedElement = range.startContainer.parentElement;
        // const chunkElement = selectedElement.closest('[id^="chunk-"]');
        // const chunkId = chunkElement?.id;
        // const currentIndex = chunkId ? parseInt(chunkId.split('-')[1]) : currentChunkIndex;

        // // Get up to 2 previous chunks for context
        // const contextStartIndex = Math.max(0, currentIndex - 2);
        const contextChunks = textChunks.slice(currentChunkIndex - 2, currentChunkIndex + 1);

        setQuestionPanel({
            text: selectedText || textChunks[currentChunkIndex],
            type: actionType,
            question: customQuestion,
            context: {
                chapterName: `Chapter ${currentChapterIndex}`,
                contextText: contextChunks.join(' ')
            }
        });

        // Clear selection after action
        window.getSelection().removeAllRanges();
        // setShowSelectionFAB(false);
    };

    const scrollToCurrentChunk = () => {
        const element = document.getElementById(`chunk-${currentChunkIndex}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleWordDoubleClick = (chunkIndex) => {
        if (onChunkSelect) {
            onChunkSelect(chunkIndex);
        }
    };

    function calcBackgroundColor(chunkIndex, wordIndex) {
        if (currentChunkIndex === chunkIndex) {
            if (isPlaying && currentWordIndex === wordIndex) {
                return settings.mode === 'dark'
                    ? settings.highlightColors.wordDark
                    : settings.highlightColors.word;
            }
            return settings.mode === 'dark'
                ? settings.highlightColors.sentenceDark
                : settings.highlightColors.sentence;
        }
        return 'transparent';
    }
    const didImagesLoaded = images && Object.keys(images).length > 0;

    const renderWords = (text, chunkIndex) => (
        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
            {isBookmarked(currentChapterIndex, chunkIndex) && (
                <BookmarkIcon
                    sx={{
                        position: 'absolute',
                        left: -24,
                        top: 0,
                        color: 'primary.main',
                        fontSize: '1.2rem'
                    }}
                />
            )}
            {text.split(' ')
                .filter(word => word.trim() !== '')
                .map((word, wordIndex) => (

                    <span
                        key={wordIndex}
                        onDoubleClick={() => handleWordDoubleClick(chunkIndex)}
                        style={{
                            backgroundColor: calcBackgroundColor(chunkIndex, wordIndex),
                            padding: '0 2px',
                            borderRadius: '3px',
                            transition: 'background-color 0.2s',
                            // fontWeight: currentChunkIndex === chunkIndex && isPlaying && currentWordIndex === wordIndex ? 'bold' : 'normal',
                            cursor: 'pointer'
                        }}
                    >
                        {word}{' '}
                    </span>


                ))}
        </div>
    );

    return (
        <Box
            ref={containerRef}
            sx={{
                height: '100%',
                overflowY: 'auto',
                position: 'relative',
                backgroundColor: 'background.default',
            }}
        >
            <div ref={topTriggerRef} style={{ height: '10px' }} />

            <ReaderContent>
                {textChunks
                    .slice(visibleRange.start, visibleRange.end)
                    .map((text, localIndex) => {
                        const globalIndex = localIndex + visibleRange.start;
                        return (
                            <div key={globalIndex} id={`chunk-${globalIndex}`}>
                                {text.startsWith('Image ') && didImagesLoaded
                                    ? <ImageBox text={text} images={images} render={() => renderWords(text, globalIndex)} />
                                    : renderWords(text, globalIndex)
                                }
                            </div>
                        );
                    })}
            </ReaderContent>

            <div ref={bottomTriggerRef} style={{
                height: '10px',
            }} />

            {!isCurrentChunkVisible && (
                <Fab
                    color="primary"
                    size="small"
                    onClick={scrollToCurrentChunk}
                    sx={{
                        position: 'fixed',
                        bottom: '25vh',  // Adjust to be above the audio player
                        right: '5%',
                        transform: 'translateX(-50%)',
                        zIndex: 100000
                    }}
                >
                    <VerticalAlignCenterIcon />
                </Fab>
            )}

            <SelectionFAB
                visible={showSelectionFAB}
                onAction={handleQuestionAction}
            />

            <TextQuestionPanel
                open={!!questionPanel}
                selectedText={questionPanel?.text}
                questionType={questionPanel?.type}
                question={questionPanel?.question}
                context={questionPanel?.context}
                onClose={() => setQuestionPanel(null)}
            />
        </Box>
    );
}

function getImageSrc(images, text) {
    const imageFromText = text.match(/Image \d+\./)
    const imageKey = imageFromText && imageFromText[0]
    const imageIndex = imageKey && imageKey.split('.')[0]
    if (imageIndex && images[imageIndex]) {
        return `/images/${images[imageIndex]}`
    } else {
        console.log('Image not found:', { text, imageIndex, imageFromText, images });
        return null
    }

    return null
}
function ImageBox({ render, images, text }) {
    return <>
        <img

            src={getImageSrc(images, text)}
            alt={text}
            style={{
                width: '100%',
                height: 'auto',
                marginBottom: '20px'
            }}
        />
        <Box
            sx={{
                border: '1px solid gray',
                p: 1
            }}
        >
            {render()}
        </Box>

    </>
}