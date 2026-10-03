import { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import NavBar from '../components/organisms/NavBar';
import TogglePill from '../components/molecules/TogglePill';
import EmptyState from '../components/molecules/EmptyState';
import { useEntries } from '../context/EntriesContext';
import { weekDatesFor, weeksInMonth, todayISO, formatDateLabel, MONTH_LABELS } from '../utils/date';
import './Monitoring.css';

const VIEW_OPTIONS = [
  { value: 'chart', label: 'Chart' },
  { value: 'numbers', label: 'Numbers' },
];

function totalsFor(dates, entries) {
  const dayEntries = dates.flatMap((iso) => entries[iso] || []);
  return {
    drinks: dayEntries.length,
    calories: dayEntries.reduce((sum, e) => sum + Number(e.calories || 0), 0),
  };
}

function Monitoring() {
  const { entries, loading, error } = useEntries();
  const [view, setView] = useState('chart');
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const year = now.getFullYear();

  if (loading) {
    return (
      <>
        <NavBar />
        <main className="mon-main">
          <p className="state state--loading">Loading your drinks…</p>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <main className="mon-main">
          <p className="state state--error">{error}</p>
        </main>
      </>
    );
  }

  // for weekly monitoring
  const week = weekDatesFor(todayISO());
  const weekRows = week.map((iso) => {
    const dayEntries = entries[iso] || [];
    return {
      date: iso,
      label: formatDateLabel(iso).split(',')[0],
      drinks: dayEntries.length,
      calories: dayEntries.reduce((sum, e) => sum + Number(e.calories || 0), 0),
    };
  });
  const weekDrinks = weekRows.reduce((sum, r) => sum + r.drinks, 0);
  const weekCalories = weekRows.reduce((sum, r) => sum + r.calories, 0);
  const hasWeekEntries = weekDrinks > 0;
  const rangeLabel = `${formatDateLabel(week[0])} – ${formatDateLabel(week[6])}`;

  // for monthly monitoring
  const weeksOfSelectedMonth = weeksInMonth(year, selectedMonth);
  const monthRows = weeksOfSelectedMonth.map((w, i) => ({
    label: `Week ${i + 1}`,
    ...totalsFor(w.dates, entries),
  }));
  const monthDrinks = monthRows.reduce((sum, r) => sum + r.drinks, 0);
  const monthCalories = monthRows.reduce((sum, r) => sum + r.calories, 0);
  const hasMonthEntries = monthDrinks > 0;

  return (
    <>
      <NavBar />
      <main className="mon-main">
        <div className="mon-head">
          <h1>{rangeLabel}</h1>
          <p className="mon-totals">{weekDrinks} drinks · {weekCalories} kcal this week</p>
        </div>

        <div className="mon-toggle">
          <TogglePill options={VIEW_OPTIONS} active={view} onChange={setView} />
        </div>

        {!hasWeekEntries ? (
          <EmptyState message="Nothing logged this week." />
        ) : view === 'chart' ? (
          <div className="mon-chart">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weekRows}>
                <CartesianGrid strokeDasharray="3 3" stroke="#C96E12" opacity={0.3} />
                <XAxis dataKey="label" fontSize={12} stroke="#241502" />
                <YAxis fontSize={12} stroke="#241502" />
                <Tooltip formatter={(value, name) => [value, name === 'calories' ? 'kcal' : 'drinks']} />
                <Bar dataKey="calories" fill="#DF8D03" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <ul className="mon-numbers">
            {weekRows.map((r) => (
              <li key={r.date} className={r.drinks === 0 ? 'empty-day' : ''}>
                <span className="mon-day-label">{r.label}</span>
                <span>{r.drinks} drink{r.drinks === 1 ? '' : 's'}</span>
                <span>{r.calories} kcal</span>
              </li>
            ))}
          </ul>
        )}

        <section className="mon-section">
          <h2>{MONTH_LABELS[selectedMonth]} {year} · {monthDrinks} drinks · {monthCalories} kcal</h2>

          <div className="mon-month-grid">
            {MONTH_LABELS.map((label, i) => (
              <button
                type="button"
                key={label}
                className={`mon-month-tile ${i === selectedMonth ? 'selected' : ''}`}
                onClick={() => setSelectedMonth(i)}
              >
                {label.slice(0, 3)}
              </button>
            ))}
          </div>

          {!hasMonthEntries ? (
            <EmptyState message={`Nothing logged in ${MONTH_LABELS[selectedMonth]}.`} />
          ) : (
            <div className="mon-chart">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthRows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#C96E12" opacity={0.3} />
                  <XAxis dataKey="label" fontSize={12} stroke="#241502" />
                  <YAxis fontSize={12} stroke="#241502" />
                  <Tooltip formatter={(value, name) => [value, name === 'calories' ? 'kcal' : 'drinks']} />
                  <Bar dataKey="calories" fill="#DF8D03" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default Monitoring;