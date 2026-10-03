import { supabase } from './supabaseClient';

export async function getAll() {
  const { data, error } = await supabase.from('entries').select('*');
  if (error) throw new Error(error.message);
  return data;
}

export async function create(entry) {
  const { data, error } = await supabase
    .from('entries')
    .insert(entry)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function update(id, changes) {
  const { data, error } = await supabase
    .from('entries')
    .update(changes)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function remove(id) {
  const { error } = await supabase.from('entries').delete().eq('id', id);
  if (error) throw new Error(error.message);
}