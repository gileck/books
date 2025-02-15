import React, { useContext, useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, IconButton, Typography, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { AppContext } from '../AppContext';

export function BookmarkList() {
    const { setRoute, bookmarks: { bookmarks, addBookmark, removeBookmark, isBookmarked, updateBookmarkName } } = useContext(AppContext);
    const [selectedBookmark, setSelectedBookmark] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleBookmarkClick = (bookmark) => {
        setSelectedBookmark(bookmark);
        setIsEditing(false);
    };

    const handleClose = () => {
        setSelectedBookmark(null);
        setIsEditing(false);
    };

    const handleNameChange = (e) => {
        if (selectedBookmark) {
            setSelectedBookmark({ ...selectedBookmark, name: e.target.value });
        }
    };

    const handleSave = () => {
        if (selectedBookmark) {
            updateBookmarkName(selectedBookmark.id, selectedBookmark.name);
            setIsEditing(false);
        }
    };

    function jumpToBookmark() {
        setRoute('', {
            chapterIndex: selectedBookmark.chapterIndex,
            chunkIndex: selectedBookmark.chunkIndex
        });
    }

    return (
        <Box>
            {bookmarks.length === 0 ? (
                <Typography color="textSecondary">
                    No bookmarks yet
                </Typography>
            ) : (
                <List>
                    {bookmarks.map((bookmark) => (
                        <ListItem
                            key={bookmark.id}
                            button
                            onClick={() => handleBookmarkClick(bookmark)}
                            secondaryAction={
                                <>
                                    <IconButton
                                        edge="end"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedBookmark(bookmark);
                                            setIsEditing(true);
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeBookmark(bookmark.id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemText
                                primary={bookmark.name || bookmark.chapterName}
                                secondary={
                                    <>
                                        <Typography variant="caption" display="block">
                                            Chapter {bookmark.chapterIndex}
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            {new Date(bookmark.timestamp).toLocaleString()}
                                        </Typography>
                                        {bookmark.sentence?.slice(0, 50)}...
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            )}
            <Dialog open={!!selectedBookmark} onClose={handleClose}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ flex: 1 }}>
                        {isEditing ? (
                            <TextField
                                label="Bookmark Name"
                                value={selectedBookmark?.name || ''}
                                onChange={handleNameChange}
                                fullWidth
                            />
                        ) : (
                            <Typography>{selectedBookmark?.name || 'Bookmark'}</Typography>
                        )}
                    </Box>
                    {!isEditing && (
                        <Box>
                            <IconButton onClick={() => setIsEditing(true)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => removeBookmark(selectedBookmark.id) && handleClose()}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    )}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="caption" display="block" gutterBottom>
                        {selectedBookmark?.timestamp && new Date(selectedBookmark.timestamp).toLocaleString()}
                    </Typography>
                    <Typography gutterBottom>{selectedBookmark?.sentence}</Typography>
                </DialogContent>
                <DialogActions>
                    {isEditing ? (
                        <>
                            <Button onClick={handleSave} color="primary">
                                Save
                            </Button>
                            <Button onClick={() => setIsEditing(false)} color="primary">
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant='contained'
                            onClick={jumpToBookmark}
                            color="primary">
                            Jump To Bookmark
                        </Button>
                    )}
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
