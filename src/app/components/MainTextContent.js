import { Box, Slider } from '@mui/material';
import React, { useState, useEffect, useLayoutEffect } from 'react';

export function MainTextContent({ images, wordSpeed, timepoints, audio, currentChunkIndex, textChunks, onChunkSelect, onChunksFinished }) {

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    useLayoutEffect(() => {
        const element = document.getElementById(`chunk-${currentChunkIndex}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

    }, [currentChunkIndex, textChunks.length])

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

    const handleWordDoubleClick = (chunkIndex) => {
        if (onChunkSelect) {
            onChunkSelect(chunkIndex);
        }
    };

    function calcBackgroundColor(chunkIndex, wordIndex) {
        // currentChunkIndex === chunkIndex ? '#e3f2fd' : 'transparent'
        if (currentChunkIndex === chunkIndex) {
            if (isPlaying && currentWordIndex === wordIndex) {
                return '#89c4f5';
            } else {
                return '#e3f2fd';
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
        <div style={{
            padding: '20px',
            fontSize: '1.2rem',
            lineHeight: '1.6',
            marginBottom: '60px'
        }}>


            {textChunks.map((text, chunkIndex) => (

                <div key={chunkIndex} id={`chunk-${chunkIndex}`}>

                    {
                        text.startsWith('Image ') && didImagesLoaded ? <ImageBox text={text} images={images} render={() => renderWords(text, chunkIndex)} /> : renderWords(text, chunkIndex)
                    }
                </div>


            ))}

        </div>
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