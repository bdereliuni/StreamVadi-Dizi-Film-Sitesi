import { useState, useEffect } from 'react';
import { WatchHistoryItem } from '../types/tmdb';

const WATCH_HISTORY_KEY = 'watch_history';
const MAX_HISTORY_ITEMS = 20;

export function useWatchHistory() {
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(WATCH_HISTORY_KEY);
    if (savedHistory) {
      setWatchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const addToHistory = (item: WatchHistoryItem) => {
    setWatchHistory(prevHistory => {
      // Aynı içeriğin eski kaydını kaldır
      const filteredHistory = prevHistory.filter(
        historyItem => !(historyItem.id === item.id && historyItem.type === item.type)
      );
      
      // Yeni içeriği başa ekle ve maksimum limit uygula
      const newHistory = [item, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
      
      // LocalStorage'a kaydet
      localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(newHistory));
      
      return newHistory;
    });
  };

  return { watchHistory, addToHistory };
} 