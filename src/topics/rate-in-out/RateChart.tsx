import type { PointerEvent as ReactPointerEvent } from 'react'
import { T_MAX, T_MIN, fmt, netRate, rateIn, rateOut, turns, type Turn } from './model'

const WIDTH = 640
const HEIGHT = 340
const PAD = { left: 40, right: 16, top: 18, bottom: 32 }
const HALF = 2.5
const NEAR = 1.2

function windowFor(t: number) {
  return { xMin: t - HALF, xMax: t + HALF }
}

function yWindow(xMin: number, xMax: number) {
  let lo = 0
  let hi = 0
  for (let i = 0; i <= 48; i++) {
    const x = xMin + (i / 48) * (xMax - xMin)
    for (const y of [rateIn(x), rateOut(x), netRate(x)]) {
      lo = Math.min(lo, y)
      hi = Math.max(hi, y)
    }
  }
  const pad = Math.max((hi - lo) * 0.16, 1.2)
  return { yMin: lo - pad, yMax: hi + pad }
}

function approachNote(turn: Turn, t: number) {
  const which = turn.curve === 'in' ? 'Rate in' : 'Rate out'
  const place = turn.kind === 'max' ? 'high point' : 'low point'
  const ahead = turn.t - t
  const away = Math.abs(ahead)
  if (away < 0.15) return `${which} is at a ${place}`
  if (ahead > 0) return `${which} is approaching a ${place}, ${fmt(away)} h ahead`
  return `A ${place} of ${which.toLowerCase()} is ${fmt(away)} h behind`
}

type RateChartProps = {
  t: number
  onPick?: (t: number) => void
}

export function RateChart({ t, onPick }: RateChartProps) {
  const { xMin, xMax } = windowFor(t)
  const { yMin, yMax } = yWindow(xMin, xMax)
  const plotW = WIDTH - PAD.left - PAD.right
  const plotH = HEIGHT - PAD.top - PAD.bottom

  const xOf = (time: number) => PAD.left + ((time - xMin) / (xMax - xMin)) * plotW
  const yOf = (value: number) => PAD.top + ((yMax - value) / (yMax - yMin)) * plotH
  const timeOf = (px: number) => {
    const next = xMin + ((px - PAD.left) / plotW) * (xMax - xMin)
    const clamped = Math.min(T_MAX, Math.max(T_MIN, next))
    return Math.round(clamped * 10) / 10
  }

  const line = (fn: (time: number) => number) => {
    let d = ''
    for (let i = 0; i <= 80; i++) {
      const time = xMin + (i / 80) * (xMax - xMin)
      d += `${i === 0 ? 'M' : 'L'} ${xOf(time)} ${yOf(fn(time))} `
    }
    return d
  }

  const xTicks: number[] = []
  for (let tick = Math.ceil(xMin); tick <= Math.floor(xMax); tick++) xTicks.push(tick)
  const yTicks = [-5, 0, 5, 10].filter((tick) => tick > yMin + 0.4 && tick < yMax - 0.4)

  const nearby = turns.filter(
    (turn) => Math.abs(turn.t - t) <= NEAR && turn.t >= xMin && turn.t <= xMax,
  )

  const onPointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!onPick) return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = ((event.clientX - rect.left) / rect.width) * WIDTH
    onPick(timeOf(px))
  }

  return (
    <div className="rio-chart-wrap">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={`rio-chart${onPick ? ' is-pickable' : ''}`}
        role="img"
        aria-label="Rate in, rate out, and net rate near the current time"
        onPointerDown={onPointer}
        onPointerMove={(event) => {
          if (onPick && event.buttons === 1) onPointer(event)
        }}
      >
        {xTicks.map((tick) => (
          <g key={`x-${tick}`}>
            <line x1={xOf(tick)} x2={xOf(tick)} y1={PAD.top} y2={HEIGHT - PAD.bottom} className="rio-grid" />
            <text x={xOf(tick)} y={HEIGHT - 8} className="rio-tick">
              {tick}
            </text>
          </g>
        ))}
        {yTicks.map((tick) => (
          <g key={`y-${tick}`}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={yOf(tick)} y2={yOf(tick)} className="rio-grid" />
            <text x={PAD.left - 6} y={yOf(tick) + 4} className="rio-tick rio-tick-y">
              {tick}
            </text>
          </g>
        ))}
        <line x1={PAD.left} x2={WIDTH - PAD.right} y1={yOf(0)} y2={yOf(0)} className="rio-axis" />
        <path d={line(rateIn)} className="rio-curve is-in" />
        <path d={line(rateOut)} className="rio-curve is-out" />
        <path d={line(netRate)} className="rio-curve is-net" />
        {nearby.map((turn) => {
          const y = turn.curve === 'in' ? rateIn(turn.t) : rateOut(turn.t)
          const here = turn.curve === 'in' ? rateIn(t) : rateOut(t)
          return (
            <g key={`${turn.curve}-${turn.t}`}>
              <line
                x1={xOf(t)}
                y1={yOf(here)}
                x2={xOf(turn.t)}
                y2={yOf(y)}
                className={`rio-approach is-${turn.curve}`}
              />
              <circle cx={xOf(turn.t)} cy={yOf(y)} r={8} className={`rio-approach-ring is-${turn.curve}`} />
              <circle cx={xOf(turn.t)} cy={yOf(y)} r={3.5} className={`rio-turn is-${turn.curve}`} />
            </g>
          )
        })}
        <line x1={xOf(t)} x2={xOf(t)} y1={PAD.top} y2={HEIGHT - PAD.bottom} className="rio-cursor" />
        <circle cx={xOf(t)} cy={yOf(rateIn(t))} r={4} className="rio-now is-in" />
        <circle cx={xOf(t)} cy={yOf(rateOut(t))} r={4} className="rio-now is-out" />
        <circle cx={xOf(t)} cy={yOf(netRate(t))} r={4} className="rio-now is-net" />
      </svg>
      <div className="rio-legend">
        <span><i className="is-in" /> Rate in</span>
        <span><i className="is-out" /> Rate out</span>
        <span><i className="is-net" /> Net</span>
      </div>
      {nearby.length > 0 ? (
        <div className="rio-approach-note">
          {nearby.map((turn) => (
            <p key={`${turn.curve}-${turn.t}`}>{approachNote(turn, t)}</p>
          ))}
        </div>
      ) : null}
    </div>
  )
}
