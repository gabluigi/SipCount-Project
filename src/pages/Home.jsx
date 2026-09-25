import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/organisms/NavBar';
import CalendarHeader from '../components/organisms/CalendarHeader';
import CalendarGrid from '../components/organisms/CalendarGrid';
import SelectedDayPanel from '../components/organisms/SelectedDayPanel';
import { useEntries } from '../context/EntriesContext';
import { todayISO } from '../utils/date';
import './Home.css';

const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function Home() {
  const navigate = useNavigate();
  const { entries, updateEntry, deleteEntry } = useEntries();
  const today = todayISO();

  const [selectedDate, setSelectedDate] = useState(today);
  const now = new Date();
  const [visibleMonth, setVisibleMonth] = useState({ year: now.getFullYear(), month: now.getMonth() });

  function goToMonth(delta) {
    setVisibleMonth((prev) => {
      let { year, month } = prev;
      month += delta;
      if (month < 0) { month = 11; year -= 1; }
      if (month > 11) { month = 0; year += 1; }
      return { year, month };
    });
  }

  const dayEntries = entries[selectedDate] || [];

  return (
    <>
      <NavBar />
      <main className="home-main">
        <CalendarHeader
          label={`${MONTH_LABELS[visibleMonth.month]} ${visibleMonth.year}`}
          onPrev={() => goToMonth(-1)}
          onNext={() => goToMonth(1)}
        />
        <CalendarGrid
          year={visibleMonth.year}
          month={visibleMonth.month}
          entries={entries}
          selectedDate={selectedDate}
          todayISO={today}
          onSelectDate={setSelectedDate}
        />
        <SelectedDayPanel
          date={selectedDate}
          dayEntries={dayEntries}
          onEdit={updateEntry}
          onDelete={deleteEntry}
          onAddClick={() => navigate('/add', { state: { date: selectedDate } })}
        />
      </main>
    </>
  );
}

export default Home;
