import { useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

export function useAppThemes(settings) {
    const contentTheme = useMemo(() => createTheme({
        palette: {
            mode: settings.mode,
            ...(settings.theme === 'classic' ? {
                primary: { main: '#1976d2' },
                secondary: { main: '#dc004e' },
                background: {
                    default: settings.mode === 'dark' ? '#121212' : '#ffffff',
                    paper: settings.mode === 'dark' ? '#1e1e1e' : '#ffffff',
                },
                text: {
                    primary: settings.mode === 'dark' ? '#ffffff' : '#000000',
                }
            } : {
                primary: { main: '#6200ea' },
                secondary: { main: '#3f51b5' },
                background: {
                    default: settings.mode === 'dark' ? '#121212' : '#fafafa',
                    paper: settings.mode === 'dark' ? '#1e1e1e' : '#ffffff',
                },
                text: {
                    primary: settings.mode === 'dark' ? '#ffffff' : '#000000',
                }
            }),
        },
        typography: {
            fontFamily: settings.fontFamily,
            fontSize: settings.fontSize,
        },
    }), [settings]);

    const appTheme = useMemo(() => createTheme({
        palette: {
            mode: 'light'  // Change this from 'dark' to 'light'
        }
    }), []);

    return { appTheme, contentTheme };
}
