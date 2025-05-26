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

    // Filter to only show groups with more than 3 sentences
    const filteredHistory = groupedHistory.filter(group => group.sentences.length > 3);

    // Helper to compute time range text with only start time (without seconds) and duration
    const formatTimeRange = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const durationMs = startDate - endDate;
        const durationSec = Math.round(durationMs / 1000);
        
        // Format start time without seconds
        const hours = startDate.getHours();
        const minutes = startDate.getMinutes();
        const formattedStartTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
        
        // Format duration
        const durationText = durationSec < 60 
            ? `${durationSec} sec`
            : `${Math.floor(durationSec / 60)} min ${durationSec % 60} sec`;
            
        return `${formattedStartTime} (${durationText})`;
    };

    // Helper to format duration in seconds to readable format
    const formatDuration = (seconds) => {
        if (seconds < 60) {
            return `${seconds} sec`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            const remainingSec = seconds % 60;
            return `${minutes} min${remainingSec > 0 ? ` ${remainingSec} sec` : ''}`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return `${hours} h${minutes > 0 ? ` ${minutes} min` : ''}`;
        }
    };

    // Helper to format date as "Sunday 24/1"
    const formatDateHeader = (dateString) => {
        const date = new Date(dateString);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[date.getDay()];
        const dayOfMonth = date.getDate();
        const month = date.getMonth() + 1; // getMonth() is zero-based
        
        return `${dayName} ${dayOfMonth}/${month}`;
    };

    // Group history items by day and calculate total reading time
    const groupByDay = (items) => {
        // First, group all items (unfiltered) by day to calculate total time
        const allItemsByDay = {};
        
        groupedHistory.forEach(item => {
            const date = new Date(item.startDate);
            const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            
            if (!allItemsByDay[dateKey]) {
                allItemsByDay[dateKey] = {
                    date: item.startDate,
                    items: [],
                    totalReadingTime: 0
                };
            }
            
            // Calculate duration for this item
            const startDate = new Date(item.startDate);
            const endDate = new Date(item.endDate);
            const durationSec = Math.round((startDate - endDate) / 1000);
            
            allItemsByDay[dateKey].totalReadingTime += durationSec;
        });
        
        // Now group filtered items by day for display
        const grouped = {};
        
        items.forEach(item => {
            const date = new Date(item.startDate);
            const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            
            if (!grouped[dateKey]) {
                grouped[dateKey] = {
                    date: item.startDate,
                    items: [],
                    totalReadingTime: allItemsByDay[dateKey]?.totalReadingTime || 0
                };
            }
            
            grouped[dateKey].items.push(item);
        });
        
        // Convert to array and sort by date (newest first)
        return Object.values(grouped).sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    // Click a group to navigate to its oldest sentence (minChunkIndex)
    const jumpToSentence = (groupItem) => {
        goToSentence(groupItem.chapterIndex, groupItem.minChunkIndex);
    };

    // Group history items by day
    const historyByDay = groupByDay(filteredHistory);

    return (
        <Paper sx={{ m: 2, p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Reading History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {historyByDay.length === 0 ? (
                <Typography variant="body1">No history items with more than 3 sentences available.</Typography>
            ) : (
                <List>
                    {historyByDay.map((dayGroup, dayIdx) => (
                        <React.Fragment key={dayIdx}>
                            <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                    fontWeight: 'bold', 
                                    mt: dayIdx > 0 ? 2 : 0,
                                    mb: 1,
                                    color: 'text.secondary',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <span>{formatDateHeader(dayGroup.date)}</span>
                                <span>{formatDuration(dayGroup.totalReadingTime)}</span>
                            </Typography>
                            {dayGroup.items.map((groupItem, idx) => (
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
                            {dayIdx < historyByDay.length - 1 && <Divider sx={{ my: 1 }} />}
                        </React.Fragment>
                    ))}
                </List>
            )}
        </Paper>
    );
}
