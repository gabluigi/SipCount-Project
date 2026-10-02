import './TogglePill.css';

/**
 * TogglePill — molecule
 * Appears on: Add (preset/custom), Monitoring (chart/numbers), Drinks (category filter)
 * Props: options (array of {value, label}), active (value), onChange
 */
function TogglePill({ options, active, onChange }) {
  return (
    <div className="pill-row" role="group">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`pill ${active === opt.value ? 'active' : ''}`}
          aria-pressed={active === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default TogglePill;
