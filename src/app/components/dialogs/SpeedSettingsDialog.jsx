import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography, IconButton, Slider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export function SpeedSettingsDialog({
    open,
    onClose,
    playbackSpeed,
    wordSpeed,
    onPlaybackSpeedChange,
    onWordSpeedChange,
    onSpeedIncrease,
    onSpeedDecrease,
    onWordSpeedIncrease,
    onWordSpeedDecrease,
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                    {/* Playback Speed Controls */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Audio Playback Speed
                        </Typography>
                        <Grid container alignItems="center" justifyContent="center" spacing={1}>
                            <Grid item>
                                <IconButton onClick={onSpeedDecrease} size="large">
                                    <RemoveIcon />
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6" sx={{ mx: 2 }}>
                                    {playbackSpeed.toFixed(1)}x
                                </Typography>
                            </Grid>
                            <Grid item>
                                <IconButton onClick={onSpeedIncrease} size="large">
                                    <AddIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Slider
                            value={playbackSpeed}
                            onChange={onPlaybackSpeedChange}
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
                        />
                    </Grid>

                    {/* Word Timing Controls */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Word Timing Adjustment
                        </Typography>
                        <Grid container alignItems="center" justifyContent="center" spacing={1}>
                            <Grid item>
                                <IconButton onClick={onWordSpeedDecrease} size="large">
                                    <RemoveIcon />
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6" sx={{ mx: 2 }}>
                                    {wordSpeed.toFixed(1)}x
                                </Typography>
                            </Grid>
                            <Grid item>
                                <IconButton onClick={onWordSpeedIncrease} size="large">
                                    <AddIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Slider
                            value={wordSpeed}
                            onChange={onWordSpeedChange}
                            min={0}
                            max={1}
                            step={0.1}
                            marks={[
                                { value: 0, label: '1x' },
                                { value: 0.5, label: '1.5x' },
                                { value: 1, label: '2x' },
                            ]}
                            valueLabelDisplay="auto"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
}
