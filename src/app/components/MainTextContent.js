import { Box, Slider, CircularProgress, Fab } from '@mui/material';
import VerticalAlignCenterIcon from '@mui/icons-material/VerticalAlignCenter';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ReaderContent } from './ReaderContent';
import { useTheme } from '@mui/material/styles';

const WINDOW_SIZE = 10; // Number of sentences to show above and below

export function MainTextContent({ images, wordSpeed, timepoints, audio, currentChunkIndex, textChunks, onChunkSelect, onChunksFinished }) {

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isInitialScrollComplete, setIsInitialScrollComplete] = useState(false);
    const [isCurrentChunkVisible, setIsCurrentChunkVisible] = useState(true);

    const theme = useTheme();

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
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Wait for smooth scroll to complete
            const timer = setTimeout(() => {
                setIsInitialScrollComplete(true);
            }, 2000); // Adjust timing based on your scroll animation duration

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
                return theme.palette.primary.light;
            } else {
                return theme.palette.action.selected;
            }
        }
        return 'transparent';
    }
    const didImagesLoaded = images && Object.keys(images).length > 0;

    const renderWords = (text, chunkIndex) =>
        text.split(' ')
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


            ))



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
                        bottom: 80,
                        right: 16,
                        zIndex: 100000
                    }}
                >
                    <VerticalAlignCenterIcon />
                </Fab>
            )}
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