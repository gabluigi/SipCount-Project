import { supabase } from './supabaseClient';

function toPreset(row) {
  return { ...row, isCustom: row.is_custom };
}

export async function getAll() {
  const { data, error } = await supabase.from('presets').select('*');
  if (error) throw new Error(error.message);
  return data.map(toPreset);
}

export async function create(preset) {
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
  if (error) throw new Error(error.message);
  return toPreset(data);
}

export async function update(id, changes) {
  const { data, error } = await supabase
    .from('presets')
    .update(changes)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return toPreset(data);
}

export async function remove(id) {
  const { error } = await supabase.from('presets').delete().eq('id', id);
  if (error) throw new Error(error.message);
}