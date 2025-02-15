import React from 'react';
import { ListItem, Button, Alert, Drawer, IconButton, List, Paper, Snackbar, ListItemButton, ListItemIcon, ListItemText, Box, Divider } from "@mui/material";
import { Assistant, Home, People, Timeline, TrendingUp, Bookmark } from '@mui/icons-material'; // Add Bookmark import

export const Menu = ({ menuOpen, toggleDrawer, onRouteChanged }) => {
    const menuItems = [
        { text: 'Home', Icon: <Home />, route: '' },
        { text: 'Bookmarks', Icon: <Bookmark />, route: 'bookmark-list' } // Add new menu item
    ];

    return (
        <div>
            <React.Fragment>
                <Drawer
                    anchor={'left'}
                    open={menuOpen}
                    onClose={() => toggleDrawer()}
                >
                    <Box
                        sx={{ width: 250 }}
                        role="presentation"
                        onClick={() => toggleDrawer()}
                        onKeyDown={() => toggleDrawer()}
                    >
                        <List>
                            {menuItems.map(({ text, Icon, route }) => (
                                <ListItem key={text} disablePadding onClick={() => onRouteChanged(route)}>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            {Icon}
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>
            </React.Fragment>
        </div>
    );
};
