import { createContext, useContext, useEffect, useState } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/date';

const STORAGE_KEY = 'sipcount-entries';
const EntriesContext = createContext(null);

export function EntriesProvider({ children }) {
  const [entries, setEntries] = useState(() => loadFromStorage(STORAGE_KEY, {}));

  useEffect(() => {
    saveToStorage(STORAGE_KEY, entries);
  }, [entries]);

  function addEntry(entry) {
    const id = crypto.randomUUID();
    setEntries((prev) => ({
      ...prev,
      [entry.date]: [...(prev[entry.date] || []), { ...entry, id }],
    }));
  }

  function updateEntry(date, id, changes) {
    setEntries((prev) => ({
      ...prev,
      [date]: (prev[date] || []).map((e) => (e.id === id ? { ...e, ...changes } : e)),
    }));
  }

  function deleteEntry(date, id) {
    setEntries((prev) => ({
      ...prev,
      [date]: (prev[date] || []).filter((e) => e.id !== id),
    }));
  }

  return (
    <EntriesContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry }}>
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntries() {
  const ctx = useContext(EntriesContext);
  if (!ctx) throw new Error('useEntries must be used inside EntriesProvider');
  return ctx;
}
