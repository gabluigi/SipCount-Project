import { createContext, useContext, useEffect, useState } from 'react';
import * as entriesRepo from '../lib/entriesRepo';

const EntriesContext = createContext(null);

function groupByDate(rows) {
  return rows.reduce((acc, row) => {
    acc[row.date] = [...(acc[row.date] || []), row];
    return acc;
  }, {});
}

export function EntriesProvider({ children }) {
  const [entries, setEntries] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEntries() {
      setLoading(true);
      try {
        const data = await entriesRepo.getAll();
        setEntries(groupByDate(data));
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadEntries();
  }, []);

  async function addEntry(entry) {
    try {
      const data = await entriesRepo.create({
        date: entry.date,
        name: entry.name,
        size: entry.size,
        abv: entry.abv,
        calories: entry.calories,
        volume_ml: entry.volume_ml,
        note: entry.note,
      });
      setEntries((prev) => ({
        ...prev,
        [data.date]: [...(prev[data.date] || []), data],
      }));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  async function updateEntry(date, id, changes) {
    try {
      const data = await entriesRepo.update(id, changes);
      setEntries((prev) => ({
        ...prev,
        [date]: (prev[date] || []).map((e) => (e.id === id ? data : e)),
      }));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  async function deleteEntry(date, id) {
    try {
      await entriesRepo.remove(id);
      setEntries((prev) => ({
        ...prev,
        [date]: (prev[date] || []).filter((e) => e.id !== id),
      }));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  return (
    <EntriesContext.Provider value={{ entries, loading, error, addEntry, updateEntry, deleteEntry }}>
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntries() {
  const ctx = useContext(EntriesContext);
  if (!ctx) throw new Error('useEntries must be used inside EntriesProvider');
  return ctx;
}