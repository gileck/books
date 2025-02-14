import { useState, useEffect } from 'react';
import { localStorageAPI } from '../localStorageAPI';

const { getConfig, saveConfig } = localStorageAPI();

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState(getConfig('bookmarks') || []);

    const addBookmark = (chapterIndex, chunkIndex, chapterName, previewText, name) => {
        const newBookmark = {
            id: Date.now(),
            chapterIndex,
            chunkIndex,
            chapterName,
            name,
            previewText: previewText.substring(0, 100) + '...',
            timestamp: new Date().toISOString()
        };
        setBookmarks(prev => [...prev, newBookmark]);
    };

    const removeBookmark = (id) => {
        setBookmarks(prev => prev.filter(b => b.id !== id));
    };

    const toggleBookmark = (chapterIndex, chunkIndex, chapterName, previewText, name) => {
        const existingBookmark = bookmarks.find(
            b => b.chapterIndex === chapterIndex && b.chunkIndex === chunkIndex
        );

        if (existingBookmark) {
            removeBookmark(existingBookmark.id);
            return false; // Returns false if bookmark was removed
        } else {
            addBookmark(chapterIndex, chunkIndex, chapterName, previewText, name);
            return true; // Returns true if bookmark was added
        }
    };

    const isBookmarked = (chapterIndex, chunkIndex) => {
        return bookmarks.some(b => b.chapterIndex === chapterIndex && b.chunkIndex === chunkIndex);
    };

    useEffect(() => {
        saveConfig('bookmarks', bookmarks);
    }, [bookmarks]);

    return { bookmarks, addBookmark, removeBookmark, isBookmarked, toggleBookmark };
}
