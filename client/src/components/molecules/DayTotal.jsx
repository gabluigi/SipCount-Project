import './DayTotal.css';

/** DayTotal — molecule. Appears on: Home (selected day panel). Props: count, calories */
function DayTotal({ count, calories }) {
  return (
    <div className="day-total">
      <strong>{count}</strong> drink{count === 1 ? '' : 's'} · <strong>{calories}</strong> kcal today
    </div>
  );
}

export default DayTotal;
