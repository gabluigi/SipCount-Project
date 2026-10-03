import { useState } from 'react';
import './PosseRow.css';

/**
 * PosseRow — molecule
 * Appears on: Games (posse table)
 * Props: person {id, name, drinks}, onRename, onSetDrinks, onRemove
 */
function PosseRow({ person, onRename, onSetDrinks, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(person.name);

  function saveName() {
    if (draftName.trim()) onRename(person.id, draftName.trim());
    setEditing(false);
  }

  return (
    <div className="posse-row">
      {editing ? (
        <input
          className="posse-name-input"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          onBlur={saveName}
          onKeyDown={(e) => e.key === 'Enter' && saveName()}
          autoFocus
        />
      ) : (
        <span className="posse-name" onClick={() => setEditing(true)}>
          {person.name}
        </span>
      )}

      <div className="posse-counter">
        <button type="button" onClick={() => onSetDrinks(person.id, person.drinks - 1)}>−</button>
        <span className="posse-count">{person.drinks}</span>
        <button type="button" onClick={() => onSetDrinks(person.id, person.drinks + 1)}>+</button>
      </div>

      <button type="button" className="link-btn" onClick={() => onRemove(person.id)}>remove</button>
    </div>
  );
}

export default PosseRow;