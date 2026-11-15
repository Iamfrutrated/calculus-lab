import { T_MAX, T_MIN, Y_MAX, Y_MIN, fmt, netRate, rateIn, rateOut } from './model'

export function TimeSlider({ t, onChange }: { t: number; onChange: (t: number) => void }) {
  return (
    <label className="slider-block">
      t = {fmt(t)} h
      <input
        type="range"
        min={T_MIN}
        max={T_MAX}
        step={0.1}
        value={t}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}

function barBox(value: number, height: number) {
  const span = Y_MAX - Y_MIN
  const zero = ((0 - Y_MIN) / span) * height
  const top = ((Math.max(value, 0) - Y_MIN) / span) * height
  const bottom = ((Math.min(value, 0) - Y_MIN) / span) * height
  return { y: height - top, h: Math.max(top - bottom, value === 0 ? 0 : 2), zero: height - zero }
}

export function Bars({ t, compact = false }: { t: number; compact?: boolean }) {
  const height = compact ? 140 : 210
  const rows = [
    { name: 'Rate in', value: rateIn(t), tone: 'in' },
    { name: 'Rate out', value: rateOut(t), tone: 'out' },
    { name: 'Net', value: netRate(t), tone: 'net' },
  ]
  return (
    <div className={`rio-bars${compact ? ' is-compact' : ''}`} role="img" aria-label="Rate in, rate out, and net">
      {rows.map((row) => {
        const box = barBox(row.value, height)
        return (
          <div key={row.name} className="rio-bar">
            <strong className={`is-${row.tone}`}>
              {fmt(row.value)}
              <small> gal/h</small>
            </strong>
            <svg viewBox={`0 0 48 ${height}`} className="rio-bar-svg">
              <line x1={4} x2={44} y1={box.zero} y2={box.zero} className="rio-zero" />
              <rect x={12} y={box.y} width={24} height={box.h} rx={4} className={`rio-fill is-${row.tone}`} />
            </svg>
            <span>{row.name}</span>
          </div>
        )
      })}
    </div>
  )
}

