// theme.js
import { createTheme } from '@mui/material/styles';

const colors = {
    listHeaderBackground: '#e3f2fd', // Light blue background for headers
    listHeaderText: '#0d47a1',      // Dark blue for header text
    listHeaderSecondaryText: '#5c6bc0', // Light grey-blue for secondary text
    workoutBackground: '#ffffff',   // White background for workouts
    exerciseBackground: '#f5f5f5',  // Light grey for exercise items
    exerciseBackgroundSelected: '#c8e6c9', // Light green for selected items
    header: '#1e88e5',              // Vibrant blue for the header
    footer: 'white',              // Dark grey for the footer
    footerText: 'gray',          // White text for the footer
};


const theme = createTheme({
    colors,
    palette: {
        // primary: {
        //     main: '#1976d2', // Customize the primary color
        // },
        // secondary: {
        //     main: '#dc004e', // Customize the secondary color
        // },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
    components: {
        MuiBottomNavigationAction: {
            styleOverrides: {
                root: {
                    color: colors.footerText,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                },
            },
        },

    },
});

// const theme2 = createTheme({
//     colors: colors2,
//     palette: {
//         primary: {
//             main: '#1e88e5', // Vibrant blue for primary actions
//         },
//         secondary: {
//             main: '#ff4081', // Soft pink for secondary actions
//         },
//         background: {
//             default: '#f5f5f5', // Light grey background
//         },
//         text: {
//             primary: '#333333', // Dark grey text
//             secondary: '#757575', // Lighter grey text
//         },
//         // action: {
//         //     active: '#ff4081', // Secondary color for active states
//         // },
//     },
//     typography: {
//         fontFamily: 'Roboto, Arial, sans-serif',
//         h6: {
//             fontWeight: 600,
//         },
//         body1: {
//             fontSize: '1rem',
//             lineHeight: 1.5,
//         },
//     },
//     components: {
//         MuiButton: {
//             styleOverrides: {
//                 root: {
//                 },
//             },
//         },
//         MuiCard: {
//             styleOverrides: {
//                 root: {
//                 },
//             },
//         },

//     },
// });

export default theme;

