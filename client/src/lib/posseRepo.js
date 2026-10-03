import { supabase } from './supabaseClient';

export async function getAll() {
  const { data, error } = await supabase.from('posse').select('*').order('created_at');
  if (error) throw new Error(error.message);
  return data;
}

export async function create(name) {
  const { data, error } = await supabase
    .from('posse')
    .insert({ name, drinks: 0 })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function update(id, changes) {
  const { data, error } = await supabase
    .from('posse')
    .update(changes)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function remove(id) {
  const { error } = await supabase.from('posse').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function removeAll() {
  const { error } = await supabase.from('posse').delete().neq('id', 0);
  if (error) throw new Error(error.message);
}