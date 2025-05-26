import React, { useEffect, useState } from 'react';
import { IconButton, Grid, Typography, Button, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight } from '@mui/icons-material';
import LinearProgress from '@mui/material/LinearProgress';
import SettingsIcon from '@mui/icons-material/Settings';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { SpeedSettingsDialog } from './dialogs/SpeedSettingsDialog';
import { BookmarkNameDialog } from './dialogs/BookmarkNameDialog';
import { AppearanceSettingsDialog } from './dialogs/AppearanceSettingsDialog';

export function AudioPlayer({
    displayedText,
    progressMetrics,
    currentChapterName,
    wordSpeed,
    audio,
    onEnded,
    onPrev,
    onPrevChapter,
    onNextChapter,
    onNext,
    onWordSpeedChanged,
    playbackSpeed,
    setPlaybackSpeed,
    selectedVoice,
    onVoiceChange,
    bookmarks,
    onAddBookmark,
    onBookmarkSelect,
    onRemoveBookmark,
    isBookmarked
}) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speedDialogOpen, setSpeedDialogOpen] = useState(false);
    const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);
    const [appearanceDialogOpen, setAppearanceDialogOpen] = useState(false);
    const [bookmarkNameDialogOpen, setBookmarkNameDialogOpen] = useState(false);

    useEffect(() => {
        if (!audio) return;
        if (audio.paused && isPlaying) {
            audio.play();
        }
    }, [audio, isPlaying]);

    useEffect(() => {
        if (!audio) return;
        audio.playbackRate = playbackSpeed;

        const handlePlay = () => setIsPlaying(true);
        const handleEnded = () => onEnded();

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [audio, playbackSpeed, onEnded]);

    const handleAudioAction = (action) => {
        // if (!audio) return;
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        action();
    };

    const togglePlay = () => {
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const isCurrentSentenceBookmarked = () => {
        try {
            return isBookmarked();
        } catch (error) {
            console.warn('Error checking bookmark status:', error);
            return false;
        }
    };

    const handleBookmarkClick = () => {
        onAddBookmark();
        // if (isCurrentSentenceBookmarked()) {
        //     onAddBookmark(); // This will now remove the bookmark
        // } else {
        //     setBookmarkNameDialogOpen(true);
        // }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 480, mx: 'auto', pb: 0 }}>
            {/* Progress Display */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                }}
            >
                <IconButton onClick={() => handleAudioAction(onPrevChapter)} sx={{ color: 'white' }}>
                    <KeyboardDoubleArrowLeft />
                </IconButton>
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: 'white',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >

                    {displayedText}

                </Typography>
                <IconButton onClick={() => handleAudioAction(onNextChapter)} sx={{ color: 'white' }}>
                    <KeyboardDoubleArrowRight />
                </IconButton>
            </Box>

            <Typography
                variant="caption"
                sx={{
                    color: '#999',
                    textAlign: 'center',
                    display: 'block',
                    mb: 0.5
                }}
            >
                {progressMetrics.current} / {progressMetrics.total} ({Math.round(progressMetrics.progress)}% complete)
            </Typography>

            <LinearProgress
                variant="determinate"
                value={progressMetrics.progress}
                sx={{
                    mb: 1,
                    backgroundColor: '#404040',
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: '#1DB954'
                    }
                }}
            />

            {/* Controls */}
            <Grid container alignItems="center" justifyContent="center" spacing={1}>
                <Grid item>
                    <IconButton onClick={() => setAppearanceDialogOpen(true)} sx={{ color: 'white' }}>
                        <SettingsIcon />
                    </IconButton>
                </Grid>


                <Grid item>

                    <IconButton onClick={() => handleAudioAction(onPrev)} sx={{ color: 'white' }}>
                        <SkipPreviousIcon />
                    </IconButton>
                </Grid>

                <Grid item>
                    <IconButton
                        onClick={togglePlay}
                        sx={{
                            borderRadius: '50%',
                            bgcolor: '#1DB954',
                            color: 'white',
                            '&:hover': { bgcolor: '#1ed760' },
                            padding: '12px',
                            '& .MuiSvgIcon-root': {
                                fontSize: '2rem'
                            }
                        }}
                    >
                        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                </Grid>

                <Grid item>
                    <IconButton onClick={() => handleAudioAction(onNext)} sx={{ color: 'white' }}>
                        <SkipNextIcon />
                    </IconButton>
                </Grid>

                <Grid item>
                    <IconButton
                        onClick={() => setSpeedDialogOpen(true)}
                        sx={{ color: 'white', fontSize: '12px' }}
                    >
                        {playbackSpeed.toFixed(1)}x
                    </IconButton>
                </Grid>

                {/* <Grid item>
                    <IconButton onClick={() => setOptionsDialogOpen(true)} sx={{ color: 'white' }}>
                        <MoreVertIcon />
                    </IconButton>
                </Grid> */}

                <Grid item>
                    <IconButton
                        onClick={handleBookmarkClick}
                        sx={{
                            color: isCurrentSentenceBookmarked() ? '#1DB954' : 'white',
                            bgcolor: isCurrentSentenceBookmarked() ? 'rgba(29, 185, 84, 0.1)' : 'transparent',
                            '&:hover': {
                                bgcolor: isCurrentSentenceBookmarked() ? 'rgba(29, 185, 84, 0.2)' : 'rgba(255, 255, 255, 0.1)'
                            }
                        }}
                        title={isCurrentSentenceBookmarked() ? "Remove bookmark" : "Add bookmark"}>
                        <BookmarkIcon />
                    </IconButton>
                </Grid>



                {/* <Grid item>
                    
                    <IconButton
                        onClick={() => setBookmarksDialogOpen(true)}
                        sx={{ color: 'white' }}
                        title="View bookmarks"
                    >
                        <BookmarksIcon />
                    </IconButton>
                </Grid> */}
            </Grid>

            {/* Dialogs */}
            <SpeedSettingsDialog
                open={speedDialogOpen}
                onClose={() => setSpeedDialogOpen(false)}
                playbackSpeed={playbackSpeed}
                wordSpeed={wordSpeed}
                onPlaybackSpeedChange={(_, value) => setPlaybackSpeed(value)}
                onWordSpeedChange={(_, value) => onWordSpeedChanged(value)}
                onSpeedIncrease={() => setPlaybackSpeed(Math.min(playbackSpeed + 0.1, 2))}
                onSpeedDecrease={() => setPlaybackSpeed(Math.max(playbackSpeed - 0.1, 0.5))}
                onWordSpeedIncrease={() => onWordSpeedChanged(Math.min(wordSpeed + 0.1, 2))}
                onWordSpeedDecrease={() => onWordSpeedChanged(Math.max(wordSpeed - 0.1, 0))}
                selectedVoice={selectedVoice}
                onVoiceChange={(voice) => {
                    onVoiceChange(voice);
                    audio.pause();
                }}
            />

            <BookmarkNameDialog
                open={bookmarkNameDialogOpen}
                onClose={() => setBookmarkNameDialogOpen(false)}
                onSave={onAddBookmark}
                defaultName={currentChapterName}
            />

            <AppearanceSettingsDialog
                open={appearanceDialogOpen}
                onClose={() => setAppearanceDialogOpen(false)}
            />
        </Box>
    );
}
