import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import { List, ListItem, ListItemText, ListItemButton, Typography, Paper, Divider } from '@mui/material';

export function History() {
    const { goToSentence, readingHistory } = useContext(AppContext);
    const historyItems = readingHistory.getHistory();

    // Group consecutive history items (assumed sorted descending: newest first)
    const groupedHistory = [];
    let group = null;
    historyItems.forEach((item, index) => {
        if (!group) {
            group = { 
                ...item, 
                sentences: [item.sentence], 
                startDate: item.date, 
                endDate: item.date,
                minChunkIndex: item.chunkIndex, // oldest in group
                maxChunkIndex: item.chunkIndex  // newest in group
            };
        } else {
            const prev = historyItems[index - 1];
            if (
                item.chapterIndex === prev.chapterIndex &&
                (prev.chunkIndex - item.chunkIndex === 1)
            ) {
                group.sentences.push(item.sentence);
                group.endDate = item.date;
                group.minChunkIndex = item.chunkIndex; // update to lower value
            } else {
                groupedHistory.push(group);
                group = { 
                    ...item, 
                    sentences: [item.sentence], 
                    startDate: item.date, 
                    endDate: item.date,
                    minChunkIndex: item.chunkIndex,
                    maxChunkIndex: item.chunkIndex
                };
            }
        }
    });
    if (group) groupedHistory.push(group);

    // Helper to compute time range text with duration in seconds or minutes
    const formatTimeRange = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const durationMs = startDate - endDate;
        const durationSec = Math.round(durationMs / 1000);
        const durationText = durationSec < 60 
            ? `${durationSec} sec`
            : `${Math.floor(durationSec / 60)} min ${durationSec % 60} sec`;
        return `from ${startDate.toLocaleTimeString()} to ${endDate.toLocaleTimeString()} (${durationText})`;
    };

    // Click a group to navigate to its oldest sentence (minChunkIndex)
    const jumpToSentence = (groupItem) => {
        goToSentence(groupItem.chapterIndex, groupItem.minChunkIndex);
    };

    return (
        <Paper sx={{ m: 2, p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Reading History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {groupedHistory.length === 0 ? (
                <Typography variant="body1">No history available.</Typography>
            ) : (
                <List>
                    {groupedHistory.map((groupItem, idx) => (
                        <ListItem key={idx} disablePadding>
                            <ListItemButton onClick={() => jumpToSentence(groupItem)}>
                                <ListItemText
                                    primary={
                                        <>
                                            Chapter {groupItem.chapterIndex} – Sentences {groupItem.sentences.length > 1 
                                                ? `${groupItem.minChunkIndex} to ${groupItem.maxChunkIndex}` 
                                                : groupItem.maxChunkIndex}
                                        </>
                                    }
                                    secondary={formatTimeRange(groupItem.startDate, groupItem.endDate)}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
}
