import './CalendarCell.css';

/**
 * CalendarCell — molecule
 * Appears on: Home (calendar grid) only
 * Props: day (number|null), isToday, isSelected, hasEntry, onClick
 */
function CalendarCell({ day, isToday, isSelected, hasEntry, onClick }) {
  if (day == null) {
    return <div className="cal-cell cal-cell-blank" aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      className={`cal-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      aria-current={isToday ? 'date' : undefined}
      aria-pressed={isSelected}
    >
      {day}
      {hasEntry && <span className="cal-dot" aria-label="has logged entries" />}
    </button>
  );
}

export default CalendarCell;
