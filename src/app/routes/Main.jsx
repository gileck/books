import { fetchWithCache, useFetch } from "@/useFetch"
import { useEffect, useState, useMemo } from "react"
import { AudioPlayer } from "../components/AudioPlayer";
import { MainTextContent } from "../components/MainTextContent"
import EpubReader from "../components/EpubReader"
import { localStorageAPI } from "../localStorageAPI"
import { Box } from "@mui/material";
import { set } from "lodash";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAppearanceSettings } from '../hooks/useAppearanceSettings';
import { useAppThemes } from '../hooks/useAppThemes';
import { SettingsContext } from '../contexts/SettingsContext';
import { useBookmarks } from '../hooks/useBookmarks';

const { getConfig, saveConfig } = localStorageAPI();
function splitTextToSentences(text, minWords = 10) {
    const sentences = text.match(/[^.!?]+[.!?]/g) || [text]; // Split based on sentence-ending punctuation
    let result = [];
    let buffer = "";
    let wordCount = 0;

    for (let sentence of sentences) {
        const words = sentence.trim().split(/\s+/);
        wordCount += words.length;
        buffer += (buffer ? " " : "") + sentence.trim();

        if (wordCount >= minWords) {
            result.push(buffer);
            buffer = "";
            wordCount = 0;
        }
    }

    if (buffer.length > 0) {
        result.push(buffer);
    }

    return result;
}



export function Main() {
    const { settings, handleSettingsChange } = useAppearanceSettings();
    const { appTheme, contentTheme } = useAppThemes(settings);
    const { bookmarks, addBookmark, removeBookmark, isBookmarked, toggleBookmark } = useBookmarks();

    // Remove the theme creation code from here since it's now in useAppThemes

    const [audioChunks, setAudioChunks] = useState({});
    
    // const [currentChunkIndex, setCurrentChunkIndex] = useState(getConfig('currentChunkIndex') || 0);
    const [currentChapterIndex, setCurrentChapterIndex] = useState(getConfig('currentChapterIndex') || 0);
    const [currentChunkIndexByChapter, setCurrentChunkIndexByChapter] = useState({
        [currentChapterIndex]: getConfig('currentChunkIndex') || 0
    });
    const currentChunkIndex = currentChunkIndexByChapter[currentChapterIndex] ?? getConfig('currentChunkIndex') ?? 0
    const setCurrentChunkIndex = (index) => {
        setCurrentChunkIndexByChapter(prev => ({
            ...prev,
            [currentChapterIndex]: index
        }))
    }
    // console.log({ currentChunkIndex });

    const [wordSpeed, setWordSpeed] = useState(getConfig('wordSpeed') || 0);
    const [playbackSpeed, setPlaybackSpeed] = useState(getConfig('playbackSpeed') || 1);
    const [selectedVoice, setSelectedVoice] = useState(getConfig('selectedVoice') || 'en-US-Neural2-A');
    console.log({selectedVoice});
    

    useEffect(() => {
        setCurrentChunkIndex(currentChunkIndexByChapter[currentChapterIndex] || 0)
        setAudioChunks({})
    }, [currentChapterIndex])

    useEffect(() => {
        if (currentChunkIndex > 0) {
            saveConfig('currentChunkIndex', currentChunkIndex);
        }
        saveConfig('currentChapterIndex', currentChapterIndex);
        saveConfig('wordSpeed', wordSpeed);
        saveConfig('playbackSpeed', playbackSpeed);
    }, [currentChunkIndex, currentChapterIndex, wordSpeed, playbackSpeed]);

    useEffect(() => {
        saveConfig('selectedVoice', selectedVoice);
    }, [selectedVoice]);

    function onWordSpeedChanged(speed) {
        setWordSpeed(speed);
    }
    // console.log({ currentChunkIndex });
    const { data } = useFetch('/chapters.json', {
        disableFetchInBackground: true,
        shouldUsecache: false
    })

    const { data: images } = useFetch('/images.json', {
        disableFetchInBackground: true,
        shouldUsecache: false
    })






    // console.log({ data });
    // const text = data.chapters ? data.chapters[currentChapterIndex].content.map(c => c.text).join(' ') : '';
    // console.log(data);
    const chapters = Object.entries(data).map(([key, value]) => ({ chapterName: key, text: value.join('\n') }));
    // console.log({ chapters });
    const text = chapters[currentChapterIndex]?.text || ''



    const chunks = splitTextToSentences(text)
    // console.log({ chunks });



    useEffect(() => {
        if (currentChunkIndex >= chunks.length) return;

        const fetchChunk = async (index) => {
            if (audioChunks[index]) return;

            const data = await fetchWithCache('/api/tts', {
                disableFetchInBackground: true,
                shouldUsecache: false,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: chunks[index],
                    voice: selectedVoice
                })
            });

            if (data?.audioContent && !audioChunks[index]) {
                setAudioChunks(prev => ({
                    ...prev,
                    [index]: {
                        audio: new Audio(`data:audio/mp3;base64,${data.audioContent}`),
                        timepoints: data.timepoints
                    }
                }));
            }
        };

        fetchChunk(currentChunkIndex);
        if (currentChunkIndex < chunks.length - 1) {
            fetchChunk(currentChunkIndex + 1);
        }
    }, [currentChunkIndex, chunks, selectedVoice]);

    const handleChunkSelect = (index) => {
        // Pause current audio if playing
        if (audioChunks[currentChunkIndex]?.audio) {
            audioChunks[currentChunkIndex].audio.pause();
            audioChunks[currentChunkIndex].audio.currentTime = 0;
        }
        setCurrentChunkIndex(index);
    };

    function onChunksFinished() {
        // setCurrentChunkIndex(0)
    }

    function onAudioFinished() {
        if (currentChunkIndex < chunks.length - 1) {
            setCurrentChunkIndex(currentChunkIndex + 1)
        }
        if (audioChunks[currentChunkIndex]?.audio && currentChunkIndex === chunks.length - 1) {
            audioChunks[currentChunkIndex].audio.pause();
        }
        
    }

    // Add progress calculations
    const progressMetrics = {
        current: currentChunkIndex + 1,
        total: chunks.length,
        remaining: Math.max(0, chunks.length - currentChunkIndex),
        progress: chunks.length > 0 ? (currentChunkIndex / chunks.length) * 100 : 0
    };

    const handleAddBookmark = (name) => {
        const isCurrentlyBookmarked = isBookmarked(currentChapterIndex, currentChunkIndex);
        if (isCurrentlyBookmarked) {
            const bookmark = bookmarks.find(
                b => b.chapterIndex === currentChapterIndex && b.chunkIndex === currentChunkIndex
            );
            if (bookmark) {
                removeBookmark(bookmark.id);
            }
        } else {
            addBookmark(
                currentChapterIndex,
                currentChunkIndex,
                chapters[currentChapterIndex]?.chapterName,
                chunks[currentChunkIndex],
                name
            );
        }
    };

    return (
        <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <SettingsContext.Provider value={{ settings, handleSettingsChange }}>
                <div>
                    <div style={{
                        height: '72vh',
                        overflowY: 'auto',
                        borderBottom: '1px solid #eee'
                    }}>
                        <ThemeProvider theme={contentTheme}>
                            <MainTextContent
                                images={images}
                                currentChunkIndex={currentChunkIndex}
                                textChunks={chunks}
                                timepoints={audioChunks[currentChunkIndex]?.timepoints}
                                audio={audioChunks[currentChunkIndex]?.audio}
                                onChunkSelect={handleChunkSelect}
                                onChunksFinished={onChunksFinished}
                                wordSpeed={wordSpeed}
                                isBookmarked={isBookmarked}
                                currentChapterIndex={currentChapterIndex}
                            />
                        </ThemeProvider>
                    </div>

                    {/* Audio player remains unchanged, using base theme */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px',
                        backgroundColor: '#282828',  // Back to dark background
                        color: 'white',  // Always white text
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '22vh',
                        zIndex: 1000,
                        boxShadow: '0 -2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <AudioPlayer
                            isBookmarked={() => isBookmarked(currentChapterIndex, currentChunkIndex)}
                            displayedText={`Chapter ${currentChapterIndex}: ${chapters[currentChapterIndex]?.chapterName}`}
                            currentChapterIndex={currentChapterIndex}
                            currentChapterName={chapters[currentChapterIndex]?.chapterName}
                            onPrevChapter={() => setCurrentChapterIndex(prev => Math.max(0, prev - 1))}
                            onNextChapter={() => setCurrentChapterIndex(prev => Math.min(chapters.length - 1, prev + 1))}
                            playbackSpeed={playbackSpeed}
                            setPlaybackSpeed={setPlaybackSpeed}
                            onWordSpeedChanged={onWordSpeedChanged}
                            wordSpeed={wordSpeed}
                            audio={audioChunks[currentChunkIndex]?.audio}
                            onEnded={() => onAudioFinished()}
                            onPrev={() => setCurrentChunkIndex(currentChunkIndex - 1)}
                            onNext={() => setCurrentChunkIndex(currentChunkIndex + 1)}
                            selectedVoice={selectedVoice}
                            onVoiceChange={(voice) => {
                                setSelectedVoice(voice);
                                // Clear audio chunks to force regeneration with new voice
                                setAudioChunks({});
                            }}
                            progressMetrics={progressMetrics}
                            bookmarks={bookmarks}
                            onAddBookmark={handleAddBookmark}
                            onBookmarkSelect={(bookmark) => {
                                setCurrentChapterIndex(bookmark.chapterIndex);
                                setCurrentChunkIndex(bookmark.chunkIndex);
                            }}
                            onRemoveBookmark={removeBookmark}
                        />
                    </div>
                </div>
            </SettingsContext.Provider>
        </ThemeProvider>
    )
}