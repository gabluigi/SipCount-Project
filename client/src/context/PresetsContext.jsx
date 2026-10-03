import { createContext, useContext, useEffect, useState } from 'react';
import * as presetsRepo from '../lib/presetsRepo';

const PresetsContext = createContext(null);

export function PresetsProvider({ children }) {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPresets() {
      setLoading(true);
      try {
        const data = await presetsRepo.getAll();
        setPresets(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPresets();
  }, []);

  async function addPreset(preset) {
    try {
      const data = await presetsRepo.create(preset);
      setPresets((prev) => [...prev, data]);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  async function updatePreset(id, changes) {
    try {
      const data = await presetsRepo.update(id, changes);
      setPresets((prev) => prev.map((p) => (p.id === id ? data : p)));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  async function deletePreset(id) {
    try {
      await presetsRepo.remove(id);
      setPresets((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  return (
    <PresetsContext.Provider value={{ presets, loading, error, addPreset, updatePreset, deletePreset }}>
      {children}
    </PresetsContext.Provider>
  );
}

export function usePresets() {
  const ctx = useContext(PresetsContext);
  if (!ctx) throw new Error('usePresets must be used inside PresetsProvider');
  return ctx;
}