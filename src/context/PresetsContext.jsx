import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const PresetsContext = createContext(null);

export function PresetsProvider({ children }) {
  const [presets, setPresets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPresets() {
      const { data, error } = await supabase.from('presets').select('*');
      if (error) {
        console.error('Failed to load presets:', error.message);
        setError(error.message);
        return;
      }
      setPresets(data.map((p) => ({ ...p, isCustom: p.is_custom })));
    }
    loadPresets();
  }, []);
  
  async function addPreset(preset) {
    const { data, error } = await supabase
      .from('presets')
      .insert({
        name: preset.name,
        category: preset.category,
        calories: preset.calories,
        abv: preset.abv,
        is_custom: true,
      })
      .select()
      .single();

    if (error) { console.error(error.message); setError(error.message); return; }
    setPresets((prev) => [...prev, { ...data, isCustom: data.is_custom }]);
  }

  async function updatePreset(id, changes) {
    const { data, error } = await supabase.from('presets').update(changes).eq('id', id).select().single();
    if (error) { console.error(error.message); setError(error.message); return; }
    setPresets((prev) => prev.map((p) => (p.id === id ? { ...data, isCustom: data.is_custom } : p)));
  }

  async function deletePreset(id) {
    const { error } = await supabase.from('presets').delete().eq('id', id);
    if (error) { console.error(error.message); setError(error.message); return; }
    setPresets((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <PresetsContext.Provider value={{ presets, error, addPreset, updatePreset, deletePreset }}>
      {children}
    </PresetsContext.Provider>
  );
}

export function usePresets() {
  const ctx = useContext(PresetsContext);
  if (!ctx) throw new Error('usePresets must be used inside PresetsProvider');
  return ctx;
}
