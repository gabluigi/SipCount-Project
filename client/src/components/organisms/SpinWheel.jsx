import { useState, useRef } from 'react';
import Button from '../atoms/Button';
import './SpinWheel.css';

const SEGMENT_COLORS = ['#E84855', '#3185FC', '#F9C80E', '#44AF69', '#9B5DE5', '#00BBF9', '#F77F00', '#EF476F'];

function SpinWheel({ names }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const timeoutRef = useRef(null);

  const n = names.length;
  const segmentAngle = n > 0 ? 360 / n : 360;

  const gradient = n > 0
    ? names
        .map((_, i) => {
          const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
          const start = (i * segmentAngle).toFixed(2);
          const end = ((i + 1) * segmentAngle).toFixed(2);
          return `${color} ${start}deg ${end}deg`;
        })
        .join(', ')
    : '#e5ddce 0deg 360deg';

  function spin() {
    if (n === 0 || spinning) return;
    clearTimeout(timeoutRef.current);
    setResult(null);
    setSpinning(true);

    const winnerIndex = Math.floor(Math.random() * n);
    const winnerCenterAngle = winnerIndex * segmentAngle + segmentAngle / 2;
    const extraSpins = 5 + Math.floor(Math.random() * 3); // 5-7 full turns
    const deltaMod = (((-winnerCenterAngle - rotation) % 360) + 360) % 360;
    const newRotation = rotation + extraSpins * 360 + deltaMod;

    setRotation(newRotation);

    timeoutRef.current = setTimeout(() => {
      setResult(names[winnerIndex]);
      setSpinning(false);
    }, 3600);
  }

  return (
    <div className="spin-wheel">
      <div className="spin-wheel-frame">
        <div className="spin-wheel-pointer" />
        <div
          className="spin-wheel-disc"
          style={{
            background: `conic-gradient(from 0deg, ${gradient})`,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {names.map((name, i) => {
            const angle = i * segmentAngle + segmentAngle / 2 - 90;
            return (
                <span
                key={`${name}-${i}`}
                className="spin-wheel-label"
                style={{ transform: `rotate(${angle}deg)` }}
                >
                <span className="spin-wheel-label-text">{name}</span>
                </span>
            );
            })}
        </div>
      </div>

      <div className="spin-wheel-result">
        {spinning ? 'Spinning…' : result || '\u00A0'}
      </div>

      <Button variant="primary" onClick={spin}>
        {n === 0 ? 'Add people first' : spinning ? 'Spinning…' : 'Spin the wheel'}
      </Button>
    </div>
  );
}

export default SpinWheel;