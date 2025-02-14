// import React from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';

// export function BookmarksDialog({ open, onClose, bookmarks, onBookmarkSelect, onRemoveBookmark }) {
//     return (
//         <Dialog
//             open={open}
//             onClose={onClose}
//             maxWidth="sm"
//             fullWidth
//         >
//             <DialogTitle>Bookmarks</DialogTitle>
//             <DialogContent>
//                 {bookmarks.length === 0 ? (
//                     <Typography color="textSecondary">
//                         No bookmarks yet
//                     </Typography>
//                 ) : (
//                     <List>
//                         {bookmarks.map((bookmark) => (
//                             <ListItem
//                                 key={bookmark.id}
//                                 button
//                                 onClick={() => {
//                                     onBookmarkSelect(bookmark);
//                                     onClose();
//                                 }}
//                                 secondaryAction={
//                                     <IconButton
//                                         edge="end"
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             onRemoveBookmark(bookmark.id);
//                                         }}
//                                     >
//                                         <DeleteIcon />
//                                     </IconButton>
//                                 }
//                             >
//                                 <ListItemText
//                                     primary={bookmark.name || bookmark.chapterName}
//                                     secondary={
//                                         <>
//                                             <Typography variant="caption" display="block">
//                                                 {new Date(bookmark.timestamp).toLocaleString()}
//                                             </Typography>
//                                             {bookmark.previewText}
//                                         </>
//                                     }
//                                 />
//                             </ListItem>
//                         ))}
//                     </List>
//                 )}
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={onClose}>Close</Button>
//             </DialogActions>
//         </Dialog>
//     );
// }
