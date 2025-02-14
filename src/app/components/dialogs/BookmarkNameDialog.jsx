import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

export function BookmarkNameDialog({ open, onClose, onSave, defaultName }) {
    const [bookmarkName, setBookmarkName] = useState(defaultName || '');

    const handleSave = () => {
        onSave(bookmarkName);
        setBookmarkName('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Bookmark</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Bookmark Name"
                    fullWidth
                    value={bookmarkName}
                    onChange={(e) => setBookmarkName(e.target.value)}
                    placeholder="Enter a name for this bookmark"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
