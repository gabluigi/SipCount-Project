import { useState, useRef, useEffect } from 'react';
import Button from '../atoms/Button';
import TogglePill from '../molecules/TogglePill';
import { CATEGORIES, SCENARIOS } from '../../data/scenarios';
import './ScenarioPicker.css';

function ScenarioPicker() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [scenario, setScenario] = useState(null);
  const [browsing, setBrowsing] = useState(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  const categoryOptions = CATEGORIES.map((c) => ({ value: c, label: c }));

  function pickScenario() {
    const pool = SCENARIOS.filter((s) => s.category === category);
    if (pool.length === 0) return;

    cancelledRef.current = false;
    setBrowsing(true);
    setScenario(null);

    let tick = 0;
    const totalTicks = 16;

    function step() {
      if (cancelledRef.current) return;

      const isLastTick = tick >= totalTicks;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      setScenario(pick.text);

      if (isLastTick) {
        setBrowsing(false);
        return;
      }

      tick += 1;
      const delay = 35 + tick * 14; // speeds up slow, then eases out like a slot reel
      setTimeout(step, delay);
    }

    step();
  }

  return (
    <div className="scenario-picker">
      <TogglePill
        options={categoryOptions}
        active={category}
        onChange={(c) => { setCategory(c); setScenario(null); }}
      />

      {scenario && (
        <p className={`scenario-text ${browsing ? 'browsing' : 'settled'}`}>{scenario}</p>
      )}

      <Button variant="primary" onClick={pickScenario}>
        {browsing ? 'Picking…' : 'Pick a scenario'}
      </Button>
    </div>
  );
}

export default ScenarioPicker;