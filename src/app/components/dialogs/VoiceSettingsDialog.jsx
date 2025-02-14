import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const voices = [
    { id: 'en-US-Neural2-A', name: 'Female 1' },
    { id: 'en-US-Neural2-C', name: 'Female 2' },
    { id: 'en-US-Neural2-D', name: 'Male 1' },
    { id: 'en-US-Neural2-F', name: 'Male 2' },
    { id: 'en-US-Neural2-H', name: 'Female 3' },
    { id: 'en-US-Neural2-I', name: 'Male 3' },
];

export function VoiceSettingsDialog({ open, onClose, selectedVoice, onVoiceChange }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Voice Settings</DialogTitle>
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
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
