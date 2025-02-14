import React from 'react';
import { useAppearanceSettings } from '../hooks/useAppearanceSettings';
import { useSettings } from '../contexts/SettingsContext';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    RadioGroup,
    Radio,
    FormControlLabel,
    Slider,
    Box,
} from '@mui/material';

const themes = {
    classic: {
        name: 'Classic',
        colors: {
            primary: '#1976d2',
            secondary: '#dc004e',
            background: '#ffffff',
            text: '#000000',
        }
    },
    modern: {
        name: 'Modern',
        colors: {
            primary: '#6200ea',
            secondary: '#3f51b5',
            background: '#fafafa',
            text: '#212121',
        }
    }
};

const fontFamilies = [
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Times New Roman, serif', label: 'Times New Roman' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: 'Roboto, sans-serif', label: 'Roboto' },
];

export function AppearanceSettingsDialog({ open, onClose }) {
    const { settings, handleSettingsChange } = useSettings();
    const [localSettings, setLocalSettings] = React.useState(settings);

    React.useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleChange = (key, value) => {
        const newSettings = {
            ...localSettings,
            [key]: value
        };
        setLocalSettings(newSettings);
        handleSettingsChange(newSettings);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    minHeight: '80vh',
                    padding: 2
                }
            }}
        >
            <DialogTitle>Appearance Settings</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>Display Mode</Typography>
                    <RadioGroup
                        value={localSettings.mode}
                        onChange={(e) => handleChange('mode', e.target.value)}
                    >
                        <FormControlLabel value="light" control={<Radio />} label="Light Mode" />
                        <FormControlLabel value="dark" control={<Radio />} label="Dark Mode" />
                    </RadioGroup>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>Font Settings</Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Font Family</InputLabel>
                        <Select
                            value={localSettings.fontFamily}
                            onChange={(e) => handleChange('fontFamily', e.target.value)}
                            label="Font Family"
                        >
                            {fontFamilies.map((font) => (
                                <MenuItem
                                    key={font.value}
                                    value={font.value}
                                    style={{ fontFamily: font.value }}
                                >
                                    {font.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Typography gutterBottom>Font Size</Typography>
                    <Slider
                        value={localSettings.fontSize}
                        onChange={(_, value) => handleChange('fontSize', value)}
                        min={12}
                        max={24}
                        step={1}
                        marks={[
                            { value: 12, label: '12px' },
                            { value: 16, label: '16px' },
                            { value: 20, label: '20px' },
                            { value: 24, label: '24px' },
                        ]}
                        valueLabelDisplay="auto"
                    />
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>Theme</Typography>
                    <RadioGroup
                        value={localSettings.theme}
                        onChange={(e) => handleChange('theme', e.target.value)}
                    >
                        {Object.entries(themes).map(([key, theme]) => (
                            <FormControlLabel
                                key={key}
                                value={key}
                                control={<Radio />}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <span>{theme.name}</span>
                                        <Box sx={{
                                            display: 'flex',
                                            gap: 1,
                                            ml: 2
                                        }}>
                                            {Object.entries(theme.colors).map(([colorKey, color]) => (
                                                <Box
                                                    key={colorKey}
                                                    sx={{
                                                        width: 20,
                                                        height: 20,
                                                        backgroundColor: color,
                                                        borderRadius: '50%',
                                                        border: '1px solid #ccc'
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                }
                            />
                        ))}
                    </RadioGroup>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                        Preview Text
                    </Typography>
                    <Box sx={{
                        p: 2,
                        mt: 1,
                        borderRadius: 1,
                        backgroundColor: themes[localSettings.theme]?.colors.background,
                        color: themes[localSettings.theme]?.colors.text,
                        fontFamily: localSettings.fontFamily,
                        fontSize: localSettings.fontSize,
                    }}>
                        This is how your text will appear with the current settings.
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
