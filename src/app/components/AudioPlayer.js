import React, { useEffect, useState } from 'react';
import { IconButton, Slider, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, List, ListItem, ListItemText } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight, SkipNext } from '@mui/icons-material';
import LinearProgress from '@mui/material/LinearProgress';
import SettingsIcon from '@mui/icons-material/Settings';
import { AppearanceSettingsDialog } from './AppearanceSettingsDialog';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import DeleteIcon from '@mui/icons-material/Delete';
import { BookmarksDialog } from './BookmarksDialog';
import { BookmarkNameDialog } from './BookmarkNameDialog';

export function AudioPlayer({ displayedText, progressMetrics, currentChapterName, wordSpeed, audio, onEnded, onPrev, onPrevChapter, onNextChapter, onNext, onWordSpeedChanged, playbackSpeed, setPlaybackSpeed, selectedVoice, onVoiceChange, bookmarks, onAddBookmark, onBookmarkSelect, onRemoveBookmark, isBookmarked }) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    // console.log({ isPlaying, audio });

    const [volume, setVolume] = React.useState(30);
    const [speedDialogOpen, setSpeedDialogOpen] = React.useState(false);
    const [optionsDialogOpen, setOptionsDialogOpen] = React.useState(false);
    const [appearanceDialogOpen, setAppearanceDialogOpen] = useState(false);
    const [bookmarksDialogOpen, setBookmarksDialogOpen] = useState(false);
    const [bookmarkNameDialogOpen, setBookmarkNameDialogOpen] = useState(false);

    const voices = [
        { id: 'en-US-Neural2-A', name: 'Female 1' },
        { id: 'en-US-Neural2-C', name: 'Female 2' },
        { id: 'en-US-Neural2-D', name: 'Male 1' },
        { id: 'en-US-Neural2-F', name: 'Male 2' },
        { id: 'en-US-Neural2-H', name: 'Female 3' },
        { id: 'en-US-Neural2-I', name: 'Male 3' },
    ];

    useEffect(() => {
        if (audio) {
            audio.playbackRate = playbackSpeed;

        }
    }, [audio, playbackSpeed]);

    useEffect(() => {
        if (!audio) {
            return
        }
        if (isPlaying) {
            audio.play()
        } else {
            audio.pause()
        }
    }, [audio, isPlaying]);


    const togglePlay = () => {
        if (!audio) {
            return
        }
        const status = !isPlaying
        setIsPlaying(status);
        if (status) {
            audio.play()
        } else {
            audio.pause()
        }
    };

    const handleVolumeChange = (event, newValue) => {
        setVolume(newValue);
    };

    const toggleSpeedDialog = () => {
        setSpeedDialogOpen(!speedDialogOpen);
    };

    const handleSpeedChange = (event, newValue) => {
        setPlaybackSpeed(newValue);
        audio.playbackRate = newValue;
    };

    const handleSpeedIncrease = () => {
        const newSpeed = Math.min(playbackSpeed + 0.1, 2);
        setPlaybackSpeed(newSpeed);
        audio.playbackRate = newSpeed;
    };

    const handleSpeedDecrease = () => {
        const newSpeed = Math.max(playbackSpeed - 0.1, 0.5);
        setPlaybackSpeed(newSpeed);
        audio.playbackRate = newSpeed;
    };

    const handleWordSpeedChange = (event, newValue) => {
        onWordSpeedChanged(newValue);
    };

    const handleWordSpeedIncrease = () => {
        const newSpeed = Math.min(wordSpeed + 0.1, 2);
        onWordSpeedChanged(newSpeed);
    };

    const handleWordSpeedDecrease = () => {
        const newSpeed = Math.max(wordSpeed - 0.1, 0);
        onWordSpeedChanged(newSpeed);
    };

    const toggleOptionsDialog = () => {
        setOptionsDialogOpen(!optionsDialogOpen);
    };

    const handleNext = () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            // setIsPlaying(false);
        }
        onNext();
    };

    const handlePrevChapter = () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            // setIsPlaying(false);
        }
        onPrevChapter();
    };
    const handleNextChapter = () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            // setIsPlaying(false);
        }
        onNextChapter();
    };

    const handlePrev = () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            // setIsPlaying(false);
        }
        onPrev();
    };

    useEffect(() => {
        if (audio) {
            audio.addEventListener('play', () => {
                // console.log('play');
                setIsPlaying(true)
            })
            audio.addEventListener('pause', () => {
                // console.log('pause');
                // setIsPlaying(false)
            })
            audio.addEventListener('ended', () => {
                // console.log('end');
                onEnded()
                // setIsPlaying(false)
            });
        }
        return () => audio?.removeEventListener('ended', onEnded);
    }, [audio]);

    const isCurrentSentenceBookmarked = () => {
        try {
            return isBookmarked();
        } catch (error) {
            console.warn('Error checking bookmark status:', error);
            return false;
        }
    };

    const handleBookmarkClick = () => {
        if (isCurrentSentenceBookmarked()) {
            onAddBookmark(); // This will now remove the bookmark
        } else {
            setBookmarkNameDialogOpen(true);
        }
    };

    return (
        <div>
            <Typography
                variant="subtitle1"
                style={{
                    color: 'white',  // Always white
                    textAlign: 'center',
                    marginBottom: '5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '300px'
                }}
            >
                {displayedText}
            </Typography>
            <Typography
                variant="caption"
                style={{
                    color: '#999',  // Always gray
                    textAlign: 'center',
                    display: 'block',
                    marginBottom: '5px'
                }}
            >
                {progressMetrics.current} / {progressMetrics.total} ({Math.round(progressMetrics.progress)}% complete)
            </Typography>
            <LinearProgress
                variant="determinate"
                value={progressMetrics.progress}
                style={{
                    marginBottom: '10px',
                    backgroundColor: '#404040',
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: '#1DB954'
                    }
                }}
            />
            <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                    <IconButton onClick={handlePrevChapter}>
                        <KeyboardDoubleArrowLeft style={{ color: 'white' }} />
                    </IconButton>
                    <IconButton onClick={handlePrev}>
                        <SkipPreviousIcon style={{ color: 'white' }} />
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton onClick={togglePlay} style={{ borderRadius: '50%', backgroundColor: '#1DB954', color: 'white' }}>
                        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton onClick={handleNext}>
                        <SkipNextIcon style={{ color: 'white' }} />
                    </IconButton>
                    <IconButton onClick={handleNextChapter}>
                        <KeyboardDoubleArrowRight style={{ color: 'white' }} />
                    </IconButton>
                </Grid>
                <Grid item>
                    <Button
                        onClick={toggleSpeedDialog}
                        style={{ color: 'white', fontSize: '12px' }}>
                        {playbackSpeed.toFixed(1)}x
                    </Button>
                </Grid>
                <Grid item>
                    <IconButton onClick={toggleOptionsDialog} style={{ color: 'white' }}>
                        <MoreVertIcon />
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton onClick={() => setAppearanceDialogOpen(true)} style={{ color: 'white' }}>
                        <SettingsIcon />
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton
                        onClick={handleBookmarkClick}
                        sx={{
                            color: isCurrentSentenceBookmarked() ? '#1DB954' : 'white',
                            backgroundColor: isCurrentSentenceBookmarked() ? 'rgba(29, 185, 84, 0.1)' : 'transparent',
                            '&:hover': {
                                backgroundColor: isCurrentSentenceBookmarked()
                                    ? 'rgba(29, 185, 84, 0.2)'
                                    : 'rgba(255, 255, 255, 0.1)'
                            }
                        }}
                        title={isCurrentSentenceBookmarked() ? "Remove bookmark" : "Add bookmark"}
                    >
                        <BookmarkIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => setBookmarksDialogOpen(true)}
                        style={{ color: 'white' }}
                        title="View bookmarks"
                    >
                        <BookmarksIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <Dialog
                open={speedDialogOpen}
                onClose={toggleSpeedDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        width: '100%',
                        maxWidth: { xs: '95%', sm: '600px' },
                        m: { xs: 1, sm: 2 }
                    }
                }}
            >
                <DialogTitle>Playback Speed</DialogTitle>
                <DialogContent sx={{
                    minHeight: { xs: 150, sm: 200 },
                    px: { xs: 2, sm: 4 },
                    py: { xs: 2, sm: 3 }
                }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="center" spacing={1}>
                                <Grid item>
                                    <IconButton onClick={handleSpeedDecrease} size="large">
                                        <RemoveIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h6" sx={{ mx: 2 }}>
                                        {playbackSpeed.toFixed(1)}x
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton onClick={handleSpeedIncrease} size="large">
                                        <AddIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{ px: { xs: 3, sm: 4 } }}>
                            <Slider
                                value={playbackSpeed}
                                onChange={handleSpeedChange}
                                min={0.5}
                                max={2}
                                step={0.1}
                                marks={[
                                    { value: 0.5, label: '0.5x' },
                                    { value: 1, label: '1x' },
                                    { value: 1.5, label: '1.5x' },
                                    { value: 2, label: '2x' }
                                ]}
                                valueLabelDisplay="auto"
                                aria-labelledby="playback-speed-slider"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="center" spacing={1}>
                                <Grid item>
                                    <IconButton onClick={handleWordSpeedDecrease} size="large">
                                        <RemoveIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h6" sx={{ mx: 2 }}>
                                        {wordSpeed.toFixed(1)}x
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton onClick={handleWordSpeedIncrease} size="large">
                                        <AddIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{ px: { xs: 3, sm: 4 } }}>
                            <Slider
                                value={wordSpeed}
                                onChange={handleWordSpeedChange}
                                min={0}
                                max={1}
                                step={0.1}
                                marks={[
                                    { value: 0, label: '1x' },
                                    { value: .5, label: '1.5x' },
                                    { value: 1, label: '2x' },
                                ]}
                                valueLabelDisplay="auto"
                                aria-labelledby="playback-speed-slider"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleSpeedDialog} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={optionsDialogOpen} onClose={toggleOptionsDialog}>
                <DialogTitle>Options</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Voice</InputLabel>
                        <Select
                            value={selectedVoice}
                            onChange={(e) => onVoiceChange(e.target.value)}
                            label="Voice"
                        >
                            {voices.map((voice) => (
                                <MenuItem key={voice.id} value={voice.id}>
                                    {voice.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleOptionsDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <BookmarksDialog
                open={bookmarksDialogOpen}
                onClose={() => setBookmarksDialogOpen(false)}
                bookmarks={bookmarks}
                onBookmarkSelect={onBookmarkSelect}
                onRemoveBookmark={onRemoveBookmark}
            />
            <BookmarkNameDialog
                open={bookmarkNameDialogOpen}
                onClose={() => setBookmarkNameDialogOpen(false)}
                onSave={(name) => onAddBookmark(name)}
                defaultName={currentChapterName}
            />
            <AppearanceSettingsDialog
                open={appearanceDialogOpen}
                onClose={() => setAppearanceDialogOpen(false)}
            />
        </div>
    );
}
