import EntryRow from '../molecules/EntryRow';
import DayTotal from '../molecules/DayTotal';
import EmptyState from '../molecules/EmptyState';
import Button from '../atoms/Button';
import { formatDateLabel } from '../../utils/date';
import './SelectedDayPanel.css';

/**
 * SelectedDayPanel — organism
 * Appears on: Home only
 * Props: date, dayEntries, onEdit, onDelete, onAddClick
 */
function SelectedDayPanel({ date, dayEntries, onEdit, onDelete, onAddClick }) {
  const calories = dayEntries.reduce((sum, e) => sum + Number(e.calories || 0), 0);

  return (
    <div className="day-panel">
      <div className="day-panel-head">
        <h2>{formatDateLabel(date)}</h2>
        <Button variant="primary" onClick={onAddClick}>+ Add drink</Button>
      </div>

      {dayEntries.length === 0 ? (
        <EmptyState message="No drinks logged this day." />
      ) : (
        <>
          {dayEntries.map((entry) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              onEdit={(id, changes) => onEdit(date, id, changes)}
              onDelete={(id) => onDelete(date, id)}
            />
          ))}
          <DayTotal count={dayEntries.length} calories={calories} />
        </>
      )}
    </div>
  );
}

export default SelectedDayPanel;
