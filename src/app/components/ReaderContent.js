import { Box } from '@mui/material';
import { useTextStyle } from '../hooks/useTextStyle';
import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

export function ReaderContent({ children }) {
    const { settings } = useSettings();
    const textStyle = useTextStyle();

    return (
        <Box
            className="reader-content"
            sx={{
                ...textStyle,
                backgroundColor: 'background.default',
                color: 'text.primary',
                fontFamily: settings.fontFamily,
                fontSize: `${settings.fontSize}px`,
                transition: 'all 0.3s ease',
                '& span': {
                    transition: 'all 0.3s ease',
                },
            }}
        >
            {children}
        </Box>
    );
}
