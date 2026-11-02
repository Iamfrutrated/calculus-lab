import type { ReactNode } from 'react'
import { MathTex } from '../../components/Math'

export const g = 9.81

export function fmt(value: number, digits = 3) {
  if (!Number.isFinite(value)) return '—'
  const fixed = value.toFixed(digits)
  return fixed === `-${(0).toFixed(digits)}` ? (0).toFixed(digits) : fixed
}

type PlaybackProps = {
  playing: boolean
  finished: boolean
  speed: number
  speeds: number[]
  onToggle: () => void
  onReset: () => void
  onSpeed: (speed: number) => void
}

export function Playback({
  playing,
  finished,
  speed,
  speeds,
  onToggle,
  onReset,
  onSpeed,
}: PlaybackProps) {
  return (
    <div className="sim-playback">
      <button type="button" onClick={onToggle} disabled={finished}>
        {playing ? 'Pause' : 'Play'}
      </button>
      <button type="button" onClick={onReset}>
        Reset
      </button>
      <label className="fn-select speed-select">
        <span>speed</span>
        <select value={speed} onChange={(event) => onSpeed(Number(event.target.value))}>
          {speeds.map((item) => (
            <option key={item} value={item}>
              {item}×
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

type ParamProps = {
  label: ReactNode
  value: number
  min: number
  max: number
  step: number
  unit?: string
  digits?: number
  disabled?: boolean
  onChange: (value: number) => void
}

export function Param({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  digits = 2,
  disabled,
  onChange,
}: ParamProps) {
  return (
    <label className="slider-block">
      <span>
        {label} = {fmt(value, digits)}
        {unit}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}

export type Rate = {
  tex: string
  value: number
  unit: string
  note?: string
  digits?: number
}

export function RateTable({ rates }: { rates: Rate[] }) {
  return (
    <div className="rate-table">
      {rates.map((rate) => (
        <div key={rate.tex} className="rate-row">
          <MathTex expr={rate.tex} />
          <strong>
            {fmt(rate.value, rate.digits ?? 3)} <small>{rate.unit}</small>
          </strong>
          {rate.note ? <span className="rate-note">{rate.note}</span> : null}
        </div>
      ))}
    </div>
  )
}

export function EquationNotes({
  title = 'Equations',
  children,
}: {
  title?: string
  children: ReactNode
}) {
  return (
    <aside className="sim-panel notes-panel">
      <div className="sim-panel-head">{title}</div>
      {children}
    </aside>
  )
}
