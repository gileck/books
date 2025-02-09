import { fetchWithCache, useFetch } from "@/useFetch"
import { useEffect, useState } from "react"
import { AudioPlayer } from "../components/AudioPlayer";
import { MainTextContent } from "../components/MainTextContent"
import EpubReader from "../components/EpubReader"
import { localStorageAPI } from "../localStorageAPI"
const { getConfig, saveConfig } = localStorageAPI();
function splitTextToSentences(text, maxWords = 10) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    return sentences.map(s => s.trim());
}
export function Main() {

    const [audioChunks, setAudioChunks] = useState({});
    const [currentChunkIndex, setCurrentChunkIndex] = useState(getConfig('currentChunkIndex') || 0);
    const [currentChapterIndex, setCurrentChapterIndex] = useState(getConfig('currentChapterIndex') || 0);
    const [wordSpeed, setWordSpeed] = useState(getConfig('wordSpeed') || 0);
    const [playbackSpeed, setPlaybackSpeed] = useState(getConfig('playbackSpeed') || 1);

    useEffect(() => {
        saveConfig('currentChunkIndex', currentChunkIndex);
        saveConfig('currentChapterIndex', currentChapterIndex);
        saveConfig('wordSpeed', wordSpeed);
        saveConfig('playbackSpeed', playbackSpeed);
    }, [currentChunkIndex, currentChapterIndex, wordSpeed, playbackSpeed]);


    function onWordSpeedChanged(speed) {
        setWordSpeed(speed);
    }
    // console.log({ currentChunkIndex });
    const { data } = useFetch('/chapters.json', {
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



    useEffect(() => {
        if (currentChunkIndex >= chunks.length) return;

        const fetchChunk = async (index) => {
            if (audioChunks[index]) return;

            const data = await fetchWithCache('/api/tts', {
                disableFetchInBackground: true,
                shouldUsecache: true,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: chunks[index] })
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
    }, [currentChunkIndex, chunks]);

    const handleChunkSelect = (index) => {
        // console.log({ index });

        // Pause current audio if playing
        if (audioChunks[currentChunkIndex]?.audio) {
            audioChunks[currentChunkIndex].audio.pause();
            audioChunks[currentChunkIndex].audio.currentTime = 0;
        }
        if (index === currentChunkIndex) {
            audioChunks[currentChunkIndex].audio.play()
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

    return (
        <div>
            <MainTextContent
                currentChunkIndex={currentChunkIndex}
                textChunks={chunks}
                timepoints={audioChunks[currentChunkIndex]?.timepoints}
                audio={audioChunks[currentChunkIndex]?.audio}
                onChunkSelect={handleChunkSelect}
                onChunksFinished={onChunksFinished}
                wordSpeed={wordSpeed}
            />

            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'white',
                padding: '1rem',
                borderTop: '1px solid #eee'
            }}>
                <AudioPlayer
                    playbackSpeed={playbackSpeed}
                    setPlaybackSpeed={setPlaybackSpeed}
                    onWordSpeedChanged={onWordSpeedChanged}
                    wordSpeed={wordSpeed}
                    audio={audioChunks[currentChunkIndex]?.audio}
                    onEnded={() => onAudioFinished()}
                    onPrev={() => setCurrentChunkIndex(prev => Math.max(0, prev - 1))}
                    onNext={() => setCurrentChunkIndex(prev => Math.min(chunks.length - 1, prev + 1))}
                />
            </div>
        </div>
    )
}