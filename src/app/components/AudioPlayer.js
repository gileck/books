import React, { useEffect, useState } from 'react';
import { IconButton, Slider, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export function AudioPlayer({ wordSpeed, audio, onEnded, onPrev, onNext, onWordSpeedChanged, playbackSpeed, setPlaybackSpeed }) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    // console.log({ isPlaying, audio });

    const [volume, setVolume] = React.useState(30);
    const [speedDialogOpen, setSpeedDialogOpen] = React.useState(false);
    const [optionsDialogOpen, setOptionsDialogOpen] = React.useState(false);

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

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px',
            backgroundColor: '#282828',
            color: 'white',
            position: 'fixed',
            bottom: 67,
            left: 0,
            right: 0,
            zIndex: 1000,
        }}>
            <Grid container alignItems="center" justifyContent="center">
                <Grid item>
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
                                    { value: 0.5, label: '1.5x' },
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
                    {/* Add extra options here */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleOptionsDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
