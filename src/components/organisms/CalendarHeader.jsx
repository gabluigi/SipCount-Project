import './CalendarHeader.css';

/** CalendarHeader — organism. Appears on: Home only. Props: label, onPrev, onNext */
function CalendarHeader({ label, onPrev, onNext }) {
  return (
    <div className="cal-header">
      <button type="button" onClick={onPrev} aria-label="Previous month">&lt;</button>
      <span className="cal-header-label">{label}</span>
      <button type="button" onClick={onNext} aria-label="Next month">&gt;</button>
    </div>
  );
}

export default CalendarHeader;
