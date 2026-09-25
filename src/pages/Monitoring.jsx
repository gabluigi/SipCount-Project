import { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import NavBar from '../components/organisms/NavBar';
import TogglePill from '../components/molecules/TogglePill';
import EmptyState from '../components/molecules/EmptyState';
import { useEntries } from '../context/EntriesContext';
import { weekDatesFor, todayISO, formatDateLabel } from '../utils/date';
import './Monitoring.css';

const VIEW_OPTIONS = [
  { value: 'chart', label: 'Chart' },
  { value: 'numbers', label: 'Numbers' },
];

function Monitoring() {
  const { entries } = useEntries();
  const [view, setView] = useState('chart');

  const week = weekDatesFor(todayISO());
  const rows = week.map((iso) => {
    const dayEntries = entries[iso] || [];
    return {
      date: iso,
      label: formatDateLabel(iso).split(',')[0], // "Mon", "Tue", etc.
      drinks: dayEntries.length,
      calories: dayEntries.reduce((sum, e) => sum + Number(e.calories || 0), 0),
      entries: dayEntries,
    };
  });

  const weekDrinks = rows.reduce((sum, r) => sum + r.drinks, 0);
  const weekCalories = rows.reduce((sum, r) => sum + r.calories, 0);
  const hasAnyEntries = weekDrinks > 0;

  const rangeLabel = `${formatDateLabel(week[0])} – ${formatDateLabel(week[6])}`;

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

        {!hasAnyEntries ? (
          <EmptyState message="Nothing logged this week." />
        ) : view === 'chart' ? (
          <div className="mon-chart">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" stroke="#C96E12" opacity={0.3} />
                <XAxis dataKey="label" fontSize={12} stroke="#241502" />
                <YAxis fontSize={12} stroke="#241502" />
                <Tooltip
                  formatter={(value, name) => [value, name === 'calories' ? 'kcal' : 'drinks']}
                />
                <Bar dataKey="calories" fill="#DF8D03" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <ul className="mon-numbers">
            {rows.map((r) => (
              <li key={r.date} className={r.drinks === 0 ? 'empty-day' : ''}>
                <span className="mon-day-label">{r.label}</span>
                <span>{r.drinks} drink{r.drinks === 1 ? '' : 's'}</span>
                <span>{r.calories} kcal</span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}

export default Monitoring;
