import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../components/organisms/NavBar';
import TogglePill from '../components/molecules/TogglePill';
import Button from '../components/atoms/Button';
import { useEntries } from '../context/EntriesContext';
import { usePresets } from '../context/PresetsContext';
import { todayISO } from '../utils/date';
import './Add.css';

const MODE_OPTIONS = [
  { value: 'preset', label: 'Choose preset' },
  { value: 'custom', label: 'Custom' },
];

function Add() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addEntry } = useEntries();
  const { presets } = usePresets();

  const [mode, setMode] = useState('preset');
  const [search, setSearch] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    size: '',
    abv: '',
    calories: '',
    note: '',
    date: location.state?.date || todayISO(),
  });

  const filteredPresets = presets.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  function pickPreset(preset) {
    setSelectedPresetId(preset.id);
    setForm((f) => ({
      ...f,
      name: preset.name,
      calories: preset.calories,
      abv: preset.abv ?? '',
    }));
  }

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleModeChange(nextMode) {
    setMode(nextMode);
    setSelectedPresetId(null);
    setForm((f) => ({ ...f, name: '', calories: '', abv: '' }));
  }

  function handleSave(e) {
    e.preventDefault();
    if (!form.name || form.calories === '') return;

    addEntry({
      name: form.name,
      size: form.size,
      abv: form.abv === '' ? null : Number(form.abv),
      calories: Number(form.calories),
      note: form.note,
      date: form.date,
    });
    navigate('/');
  }

  return (
    <>
      <NavBar />
      <main className="add-main">
        <h1>Add a drink</h1>

        <form onSubmit={handleSave}>
          <div className="add-field">
            <TogglePill options={MODE_OPTIONS} active={mode} onChange={handleModeChange} />
          </div>

          {mode === 'preset' ? (
            <div className="add-field">
              <label htmlFor="preset-search">Search presets</label>
              <input
                id="preset-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Lager, red wine, margarita…"
              />
              <div className="preset-list">
                {filteredPresets.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    className={`preset-option ${selectedPresetId === p.id ? 'selected' : ''}`}
                    onClick={() => pickPreset(p)}
                  >
                    <span>{p.name}</span>
                    <span className="preset-option-meta">
                      {p.calories} kcal{p.abv ? ` · ${p.abv}% ABV` : ''}
                    </span>
                  </button>
                ))}
                {filteredPresets.length === 0 && <p className="no-results">No presets match "{search}".</p>}
              </div>
            </div>
          ) : (
            <div className="add-field">
              <label htmlFor="custom-name">Drink name</label>
              <input
                id="custom-name"
                type="text"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                required
              />
            </div>
          )}

          <div className="add-field-grid">
            <label>
              Size
              <input
                type="text"
                value={form.size}
                onChange={(e) => setField('size', e.target.value)}
                placeholder="330ml, 1 glass…"
              />
            </label>
            <label>
              ABV % (optional)
              <input
                type="number"
                step="0.1"
                value={form.abv}
                onChange={(e) => setField('abv', e.target.value)}
              />
            </label>
            <label>
              Date
              <input
                type="date"
                value={form.date}
                onChange={(e) => setField('date', e.target.value)}
                required
              />
            </label>
            <label>
              Calories
              <input
                type="number"
                value={form.calories}
                onChange={(e) => setField('calories', e.target.value)}
                required
              />
            </label>
          </div>

          <label className="add-field">
            Note (optional)
            <input
              type="text"
              value={form.note}
              onChange={(e) => setField('note', e.target.value)}
            />
          </label>

          <div className="add-actions">
            <Button variant="ghost" onClick={() => navigate('/')}>Cancel</Button>
            <Button variant="primary" type="submit">Save</Button>
          </div>
        </form>
      </main>
    </>
  );
}

export default Add;
