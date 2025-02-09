import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Card } from '@mui/material';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: '1px' }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export function AppTabs({ Comps, noCard, initialState }) {
    const [value, setValue] = React.useState(initialState || 0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const Wrapper = noCard ? Box : Card;
    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {
                        Comps.map(({ label }, index) => (
                            <Tab label={label} {...a11yProps(index)} />
                        ))
                    }
                </Tabs>
            </Box>
            {
                Comps.map(({ Comp }, index) => (
                    <CustomTabPanel value={value} index={index}>
                        <Wrapper sx={{ width: '100%', maxWidth: 660, padding: '5px' }}>
                            {Comp}
                        </Wrapper>

                    </CustomTabPanel>
                ))
            }
        </Box>
    );
}