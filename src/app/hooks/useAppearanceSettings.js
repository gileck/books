import { useState, useCallback } from 'react';

const defaultSettings = {
    mode: 'light',  // Ensure this is 'light'
    fontFamily: 'Arial, sans-serif',
    fontSize: 16,
    theme: 'classic'
};

export function useAppearanceSettings() {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('appearanceSettings');
        return saved ? JSON.parse(saved) : defaultSettings;
    });

    const handleSettingsChange = useCallback((newSettings) => {
        // Ensure we're working with a complete settings object
        const updatedSettings = {
            ...settings,
            ...newSettings
        };

        setSettings(updatedSettings);

        console.log({ updatedSettings });

        localStorage.setItem('appearanceSettings', JSON.stringify(updatedSettings));
    }, [settings]);

    return {
        settings,
        handleSettingsChange
    };
}
