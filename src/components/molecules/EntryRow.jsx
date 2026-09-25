import { useState } from 'react';
import Button from '../atoms/Button';
import './EntryRow.css';

/**
 * EntryRow — molecule
 * Appears on: Home (selected day panel), Monitoring (breakdown list)
 * Props: entry, onEdit(id, changes), onDelete(id)
 */
function EntryRow({ entry, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(entry);

  function handleField(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  function save() {
    onEdit(entry.id, draft);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="entry-row entry-row-editing">
        <div className="entry-edit-grid">
          <label>
            Name
            <input
              value={draft.name}
              onChange={(e) => handleField('name', e.target.value)}
            />
          </label>
          <label>
            Size
            <input value={draft.size} onChange={(e) => handleField('size', e.target.value)} />
          </label>
          <label>
            ABV %
            <input
              type="number"
              value={draft.abv ?? ''}
              onChange={(e) => handleField('abv', e.target.value === '' ? null : Number(e.target.value))}
            />
          </label>
          <label>
            Calories
            <input
              type="number"
              value={draft.calories}
              onChange={(e) => handleField('calories', Number(e.target.value))}
            />
          </label>
        </div>
        <div className="entry-row-actions">
          <Button variant="ghost" onClick={() => { setIsEditing(false); setDraft(entry); }}>Cancel</Button>
          <Button variant="primary" onClick={save}>Save</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="entry-row">
      <div className="entry-row-main">
        <span className="entry-name">{entry.name}</span>
        <span className="entry-size">{entry.size}{entry.abv ? ` · ${entry.abv}% ABV` : ''}</span>
      </div>
      <div className="entry-row-side">
        <span className="entry-cal">{entry.calories} kcal</span>
        <div className="entry-row-actions">
          <button type="button" className="link-btn" onClick={() => setIsEditing(true)}>edit</button>
          <button type="button" className="link-btn" onClick={() => onDelete(entry.id)}>delete</button>
        </div>
      </div>
    </div>
  );
}

export default EntryRow;
