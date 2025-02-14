import { useState, useCallback } from 'react';

const defaultSettings = {
    mode: 'light',  // Ensure this is 'light'
    fontFamily: 'Arial, sans-serif',
    fontSize: 16,
    theme: 'classic',
    highlightColors: {
        sentence: '#e3f2fd',  // Light blue for sentence highlight
        word: '#89c4f5',      // Darker blue for current word
        sentenceDark: '#294964',  // Dark mode sentence highlight
        wordDark: '#1976d2',      // Dark mode word highlight
    }
};

export function useAppearanceSettings() {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('appearanceSettings');
        if (!saved) return defaultSettings;

        // Merge saved settings with defaults to ensure all properties exist
        const parsedSettings = JSON.parse(saved);
        return {
            ...defaultSettings,
            ...parsedSettings,
            highlightColors: {
                ...defaultSettings.highlightColors,
                ...(parsedSettings.highlightColors || {})
            }
        };
    });

    const handleSettingsChange = useCallback((newSettings) => {
        // Ensure we're working with a complete settings object
        const updatedSettings = {
            ...settings,
            ...newSettings
        };

        setSettings(updatedSettings);

        localStorage.setItem('appearanceSettings', JSON.stringify(updatedSettings));
    }, [settings]);

    return {
        settings,
        handleSettingsChange
    };
}
