import { useState, useEffect } from 'react';
import { localStorageAPI } from '../localStorageAPI';

const { getConfig, saveConfig } = localStorageAPI();

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState(getConfig('bookmarks') || []);

    const addBookmark = (chapterIndex, chunkIndex, chapterName, sentence, name) => {
        const newBookmark = {
            sentence,
            id: Date.now(),
            chapterIndex,
            chunkIndex,
            chapterName,
            name,
            timestamp: new Date().toISOString()
        };
        setBookmarks(prev => [...prev, newBookmark]);
    };

    const removeBookmark = (id) => {
        if (confirm('Are you sure you want to delete this bookmark?')) {
            setBookmarks(prev => prev.filter(b => b.id !== id));
            return true;
        }
        return false;
    };

    const toggleBookmark = (chapterIndex, chunkIndex, chapterName, previewText, name) => {
        const existingBookmark = bookmarks.find(
            b => b.chapterIndex === chapterIndex && b.chunkIndex === chunkIndex
        );

        if (existingBookmark) {
            removeBookmark(existingBookmark.id);
            return false;
        } else {
            addBookmark(chapterIndex, chunkIndex, chapterName, previewText, name);
            return true;
        }
    };

    const isBookmarked = (chapterIndex, chunkIndex) => {
        return bookmarks.some(b => b.chapterIndex === chapterIndex && b.chunkIndex === chunkIndex);
    };

    const updateBookmarkName = (id, newName) => {
        setBookmarks(prev => prev.map(bookmark =>
            bookmark.id === id ? { ...bookmark, name: newName } : bookmark
        ));
    };

    useEffect(() => {
        saveConfig('bookmarks', bookmarks);
    }, [bookmarks]);

    return { bookmarks, addBookmark, removeBookmark, isBookmarked, toggleBookmark, updateBookmarkName };
}
