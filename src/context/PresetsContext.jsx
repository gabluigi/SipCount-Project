import { createContext, useContext, useEffect, useState } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/date';
import { BUILT_IN_PRESETS } from '../data/builtInPresets';

const STORAGE_KEY = 'sipcount-custom-presets';
const PresetsContext = createContext(null);

export function PresetsProvider({ children }) {
  const [customPresets, setCustomPresets] = useState(() => loadFromStorage(STORAGE_KEY, []));

  useEffect(() => {
    saveToStorage(STORAGE_KEY, customPresets);
  }, [customPresets]);

  const presets = [...BUILT_IN_PRESETS, ...customPresets];

  function addPreset(preset) {
    const id = crypto.randomUUID();
    setCustomPresets((prev) => [...prev, { ...preset, id, isCustom: true }]);
  }

  function updatePreset(id, changes) {
    setCustomPresets((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));
  }

  function deletePreset(id) {
    setCustomPresets((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <PresetsContext.Provider value={{ presets, addPreset, updatePreset, deletePreset }}>
      {children}
    </PresetsContext.Provider>
  );
}

export function usePresets() {
  const ctx = useContext(PresetsContext);
  if (!ctx) throw new Error('usePresets must be used inside PresetsProvider');
  return ctx;
}
