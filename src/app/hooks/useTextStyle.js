import { useTheme } from '@mui/material/styles';

export function useTextStyle() {
    const theme = useTheme();

    return {
        color: theme.palette.text.primary,
        fontSize: theme.typography.fontSize,
        fontFamily: theme.typography.fontFamily,
        lineHeight: '1.6',
        transition: 'all 0.2s ease',
        textAlign: 'justify',
        padding: theme.spacing(2),
    };
}
