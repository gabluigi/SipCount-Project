import { useState } from 'react';
import NavBar from '../components/organisms/NavBar';
import TogglePill from '../components/molecules/TogglePill';
import EmptyState from '../components/molecules/EmptyState';
import Button from '../components/atoms/Button';
import { usePresets } from '../context/PresetsContext';
import { CATEGORIES } from '../data/builtInPresets';
import './Drinks.css';

const FILTER_OPTIONS = [{ value: 'all', label: 'All' }, ...CATEGORIES.map((c) => ({ value: c, label: c[0].toUpperCase() + c.slice(1) }))];

const BLANK_FORM = { name: '', calories: '', abv: '', category: 'other' };

function Drinks() {
  const { presets, addPreset, updatePreset, deletePreset } = usePresets();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK_FORM);

  const filtered = presets.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || p.category === filter;
    return matchesSearch && matchesFilter;
  });

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function startEdit(preset) {
    setEditingId(preset.id);
    setForm({ name: preset.name, calories: preset.calories, abv: preset.abv ?? '', category: preset.category });
    setShowForm(true);
  }

  function resetForm() {
    setForm(BLANK_FORM);
    setEditingId(null);
    setShowForm(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || form.calories === '') return;

    const payload = {
      name: form.name,
      calories: Number(form.calories),
      abv: form.abv === '' ? null : Number(form.abv),
      category: form.category,
    };

    if (editingId) {
      updatePreset(editingId, payload);
    } else {
      addPreset(payload);
    }
    resetForm();
  }

  return (
    <>
      <NavBar />
      <main className="drinks-main">
        <div className="drinks-head">
          <h1>Drink presets</h1>
          <Button variant="primary" onClick={() => { setShowForm((v) => !v); setEditingId(null); setForm(BLANK_FORM); }}>
            {showForm ? 'Close' : '+ Add preset'}
          </Button>
        </div>

        {showForm && (
          <form className="preset-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input value={form.name} onChange={(e) => setField('name', e.target.value)} required />
            </label>
            <label>
              Calories
              <input type="number" value={form.calories} onChange={(e) => setField('calories', e.target.value)} required />
            </label>
            <label>
              ABV % (optional)
              <input type="number" step="0.1" value={form.abv} onChange={(e) => setField('abv', e.target.value)} />
            </label>
            <label>
              Category
              <select value={form.category} onChange={(e) => setField('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <div className="preset-form-actions">
              <Button variant="ghost" onClick={resetForm}>Cancel</Button>
              <Button variant="primary" type="submit">{editingId ? 'Save changes' : 'Add preset'}</Button>
            </div>
          </form>
        )}

        <input
          className="drinks-search"
          type="text"
          placeholder="Search presets…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="drinks-filter">
          <TogglePill options={FILTER_OPTIONS} active={filter} onChange={setFilter} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState message="No presets match your search." />
        ) : (
          <div className="preset-grid">
            {filtered.map((p) => (
              <div className="preset-card" key={p.id}>
                <div className="preset-card-top">
                  <span className="preset-card-name">{p.name}</span>
                  <span className="preset-card-cat">{p.category}</span>
                </div>
                <div className="preset-card-meta">
                  {p.calories} kcal{p.abv ? ` · ${p.abv}% ABV` : ''}
                </div>
                {p.isCustom && (
                  <div className="preset-card-actions">
                    <button type="button" className="link-btn" onClick={() => startEdit(p)}>edit</button>
                    <button type="button" className="link-btn" onClick={() => deletePreset(p.id)}>delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default Drinks;
