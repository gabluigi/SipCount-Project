import CalendarCell from '../molecules/CalendarCell';
import { toISO } from '../../utils/date';
import './CalendarGrid.css';

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * CalendarGrid — organism
 * Appears on: Home only
 * Props: year, month (0-indexed), entries, selectedDate, todayISO, onSelectDate
 */
function CalendarGrid({ year, month, entries, selectedDate, todayISO: today, onSelectDate }) {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Monday-start leading blanks
  const jsWeekday = firstOfMonth.getDay(); // 0 = Sunday
  const leadingBlanks = jsWeekday === 0 ? 6 : jsWeekday - 1;

  const cells = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  return (
    <div className="cal-grid-wrap">
      <div className="cal-grid cal-grid-labels">
        {WEEKDAY_LABELS.map((w) => (
          <span key={w} className="cal-weekday-label">{w}</span>
        ))}
      </div>
      <div className="cal-grid">
        {cells.map((day, idx) => {
          if (day == null) return <CalendarCell key={`blank-${idx}`} day={null} />;
          const iso = toISO(new Date(year, month, day));
          return (
            <CalendarCell
              key={iso}
              day={day}
              isToday={iso === today}
              isSelected={iso === selectedDate}
              hasEntry={Boolean(entries[iso]?.length)}
              onClick={() => onSelectDate(iso)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CalendarGrid;
