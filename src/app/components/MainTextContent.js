import { Slider } from '@mui/material';
import React, { useState, useEffect, useLayoutEffect } from 'react';

export function MainTextContent({ wordSpeed, timepoints, audio, currentChunkIndex, textChunks, onChunkSelect, onChunksFinished }) {

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

    return (
        <div style={{
            padding: '20px',
            fontSize: '1.2rem',
            lineHeight: '1.6',
            marginBottom: '60px'
        }}>


            {textChunks.map((text, chunkIndex) => (
                <div key={chunkIndex} id={`chunk-${chunkIndex}`}>
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
            ))}

        </div>
    );
}