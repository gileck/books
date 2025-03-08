import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography, IconButton, Slider, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const voices = [
    // US English Neural2 Voices (Premium)
    { id: 'en-US-Neural2-A', name: 'US Female 1 (Premium)', gender: 'Female', accent: 'US' },
    { id: 'en-US-Neural2-C', name: 'US Female 2 (Premium)', gender: 'Female', accent: 'US' },
    { id: 'en-US-Neural2-D', name: 'US Male 1 (Premium)', gender: 'Male', accent: 'US' },
    { id: 'en-US-Neural2-F', name: 'US Male 2 (Premium)', gender: 'Male', accent: 'US' },
    { id: 'en-US-Neural2-G', name: 'US Female 3 (Premium)', gender: 'Female', accent: 'US' },
    { id: 'en-US-Neural2-H', name: 'US Female 4 (Premium)', gender: 'Female', accent: 'US' },
    { id: 'en-US-Neural2-I', name: 'US Male 3 (Premium)', gender: 'Male', accent: 'US' },
    { id: 'en-US-Neural2-J', name: 'US Male 4 (Premium)', gender: 'Male', accent: 'US' },


    // Standard Voices (Basic)
    { id: 'en-US-Standard-A', name: 'US Female (Basic)', gender: 'Female', accent: 'US' },
    { id: 'en-US-Standard-B', name: 'US Male (Basic)', gender: 'Male', accent: 'US' },
    { id: 'en-US-Standard-C', name: 'US Female 2 (Basic)', gender: 'Female', accent: 'US' },
    { id: 'en-US-Standard-D', name: 'US Male 2 (Basic)', gender: 'Male', accent: 'US' },
    { id: 'en-US-Standard-E', name: 'US Female 3 (Basic)', gender: 'Female', accent: 'US' },
    { id: 'en-US-Standard-F', name: 'US Female 4 (Basic)', gender: 'Female', accent: 'US' },
    { id: 'en-US-Standard-G', name: 'US Female 5 (Basic)', gender: 'Female', accent: 'US' },
    { id: 'en-US-Standard-H', name: 'US Female 6 (Basic)', gender: 'Female', accent: 'US' },
    { id: 'en-US-Standard-I', name: 'US Male 3 (Basic)', gender: 'Male', accent: 'US' },
    { id: 'en-US-Standard-J', name: 'US Male 4 (Basic)', gender: 'Male', accent: 'US' },

];

// Group voices by accent for better organization in the dropdown
const groupedVoices = voices.reduce((acc, voice) => {
    const key = voice.accent;
    if (!acc[key]) {
        acc[key] = [];
    }
    acc[key].push(voice);
    return acc;
}, {});

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
    selectedVoice,
    onVoiceChange
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
            <DialogTitle>Playback Speed & Voice Settings</DialogTitle>
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

                    {/* Voice Settings Controls */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Voice Settings
                        </Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Voice</InputLabel>
                            <Select
                                value={selectedVoice}
                                onChange={(e) => onVoiceChange(e.target.value)}
                                label="Voice"
                            >
                                {Object.entries(groupedVoices).map(([accent, accentVoices]) => [
                                    <MenuItem key={`group-${accent}`} disabled sx={{ opacity: 0.7, fontWeight: 'bold' }}>
                                        {accent === 'US' ? 'United States' :
                                            accent === 'UK' ? 'United Kingdom' :
                                                accent === 'AU' ? 'Australia' :
                                                    accent === 'IN' ? 'India' : accent} Voices
                                    </MenuItem>,
                                    ...accentVoices.map((voice) => (
                                        <MenuItem key={voice.id} value={voice.id} sx={{ pl: 4 }}>
                                            {voice.name}
                                        </MenuItem>
                                    )),
                                    <Divider key={`divider-${accent}`} />
                                ]).flat()}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
}
