import { useState, useEffect } from 'react';
import { localStorageAPI } from '../app/localStorageAPI';
const { getConfig, saveConfig } = localStorageAPI();

export function useReadingHistory() {
	// Initialize history from localStorageAPI
	const [history, setHistory] = useState([]);
  
	useEffect(() => {
		const stored = getConfig('readingHistory');
		if (stored) setHistory(stored);
	}, []);

	const addHistory = (entry) => {
		const newEntry = { ...entry, date: new Date().toISOString() };
		setHistory(prev => {
			const updated = [newEntry, ...prev];
			saveConfig('readingHistory', updated);
			return updated;
		});
	};

	const getHistory = () => history;

	return { history, addHistory, getHistory };
}
