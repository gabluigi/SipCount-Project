import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const EntriesContext = createContext(null);

function groupByDate(rows) {
  return rows.reduce((acc, row) => {
    acc[row.date] = [...(acc[row.date] || []), row];
    return acc;
  }, {});
}

export function EntriesProvider({ children }) {
  const [entries, setEntries] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEntries() {
      const { data, error } = await supabase.from('entries').select('*');
      if (error) {
        console.error('Failed to load entries:', error.message);
        setError(error.message);
        return;
      }
      setEntries(groupByDate(data));
    }
    loadEntries();
  }, []);

  async function addEntry(entry) {
    const { data, error } = await supabase
      .from('entries')
      .insert({
        date: entry.date,
        name: entry.name,
        size: entry.size,
        abv: entry.abv,
        calories: entry.calories,
        note: entry.note,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to add entry:', error.message);
      setError(error.message);
      return;
    }

    setEntries((prev) => ({
      ...prev,
      [data.date]: [...(prev[data.date] || []), data],
    }));
  }

  async function updateEntry(date, id, changes) {
    const { data, error } = await supabase
      .from('entries')
      .update(changes)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update entry:', error.message);
      setError(error.message);
      return;
    }

    setEntries((prev) => ({
      ...prev,
      [date]: (prev[date] || []).map((e) => (e.id === id ? data : e)),
    }));
  }

  async function deleteEntry(date, id) {
    const { error } = await supabase.from('entries').delete().eq('id', id);

    if (error) {
      console.error('Failed to delete entry:', error.message);
      setError(error.message);
      return;
    }

    setEntries((prev) => ({
      ...prev,
      [date]: (prev[date] || []).filter((e) => e.id !== id),
    }));
  }

  return (
    <EntriesContext.Provider value={{ entries, error, addEntry, updateEntry, deleteEntry }}>
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntries() {
  const ctx = useContext(EntriesContext);
  if (!ctx) throw new Error('useEntries must be used inside EntriesProvider');
  return ctx;
}