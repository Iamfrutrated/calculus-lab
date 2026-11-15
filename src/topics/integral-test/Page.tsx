import { useState } from 'react'
import { FunctionSelect } from '../../components/FunctionSelect'
import { MathTex } from '../../components/Math'
import { SimPanel } from '../../components/SimPanel'

type Kind = 'descending' | 'ascending'

type IntegralCase = {
  id: string
  label: string
  tex: string
  kind: Kind
  n0: number
  fn: (x: number) => number
  F: (x: number) => number
}

const cases: IntegralCase[] = [
  {
    id: 'inv',
    label: '1/x',
    tex: '1/x',
    kind: 'descending',
    n0: 1,
    fn: (x) => 1 / x,
    F: (x) => Math.log(x),
  },
  {
    id: 'inv2',
    label: '1/x²',
    tex: '1/x^2',
    kind: 'descending',
    n0: 1,
    fn: (x) => 1 / (x * x),
    F: (x) => -1 / x,
  },
  {
    id: 'exp',
    label: 'e^{−x}',
    tex: 'e^{-x}',
    kind: 'descending',
    n0: 0,
    fn: (x) => Math.exp(-x),
    F: (x) => -Math.exp(-x),
  },
  {
    id: 'x',
    label: 'x',
    tex: 'x',
    kind: 'ascending',
    n0: 0,
    fn: (x) => x,
    F: (x) => (x * x) / 2,
  },
  {
    id: 'sqrt',
    label: '√x',
    tex: '\\sqrt{x}',
    kind: 'ascending',
    n0: 0,
    fn: (x) => Math.sqrt(x),
    F: (x) => (2 / 3) * Math.pow(x, 1.5),
  },
]

const WIDTH = 680
const HEIGHT = 380
const PAD = { left: 46, right: 16, top: 16, bottom: 36 }

function fmt(value: number) {
  const fixed = value.toFixed(2)
  return fixed === '-0.00' ? '0.00' : fixed
}

export default function IntegralTestPage() {
  const [selected, setSelected] = useState(cases[0].id)
  const [bars, setBars] = useState(5)
  const current = cases.find((item) => item.id === selected) ?? cases[0]
  const start = current.n0
  const end = start + bars
  const heights = Array.from({ length: bars }, (_, i) => {
    const left = start + i
    return { left, height: current.fn(left + 1) }
  })
  const series = heights.reduce((sum, bar) => sum + bar.height, 0)
  const integral = current.F(end) - current.F(start)
  const yMax = Math.max(...heights.map((bar) => bar.height), current.fn(start), current.fn(end)) * 1.18
  const xMin = start - 0.45
  const xMax = end + 0.45
  const plotW = WIDTH - PAD.left - PAD.right
  const plotH = HEIGHT - PAD.top - PAD.bottom
  const mapX = (x: number) => PAD.left + ((x - xMin) / (xMax - xMin)) * plotW
  const mapY = (y: number) => PAD.top + ((yMax - y) / yMax) * plotH

  let area = `M ${mapX(start)} ${mapY(0)} `
  const steps = 140
  for (let i = 0; i <= steps; i++) {
    const x = start + ((end - start) * i) / steps
    area += `L ${mapX(x)} ${mapY(current.fn(x))} `
  }
  area += `L ${mapX(end)} ${mapY(0)} Z`

  const curveStart = current.id === 'sqrt' ? Math.max(xMin, 0) : xMin
  let curve = ''
  for (let i = 0; i <= steps; i++) {
    const x = curveStart + ((xMax - curveStart) * i) / steps
    const y = current.fn(x)
    if (!Number.isFinite(y)) continue
    curve += `${curve ? 'L' : 'M'} ${mapX(x)} ${mapY(y)} `
  }

  const xTicks: number[] = []
  for (let t = Math.ceil(xMin); t <= Math.floor(xMax); t++) xTicks.push(t)

  const sumFrom = start + 1
  const sumTo = end

  return (
    <div className="lesson-stack">
      <section className="lesson-copy">
        <p>
          Each series term is a bar one unit wide. Its height stays fixed
          across that unit, taken from the right end, while the integral is
          the smooth curve.
        </p>
        <MathTex
          display
          expr="\sum f(n) \ge \int f(x)\,dx"
        />
      </section>
      <SimPanel label="Integral test">
        <FunctionSelect
          label="f(x)"
          value={selected}
          options={cases.map((item) => ({ id: item.id, label: item.label }))}
          onChange={(id) => {
            setSelected(id)
            setBars(5)
          }}
        />
        <p className="plot-caption">
          Each bar keeps the value at its right end.
        </p>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="itest-chart" role="img" aria-label="Series bars above the integral">
          {xTicks.map((tick) => (
            <g key={`x-${tick}`}>
              <line x1={mapX(tick)} x2={mapX(tick)} y1={PAD.top} y2={HEIGHT - PAD.bottom} className="itest-grid" />
              <text x={mapX(tick)} y={HEIGHT - 12} className="itest-tick">
                {tick}
              </text>
            </g>
          ))}
          <line x1={PAD.left} x2={WIDTH - PAD.right} y1={mapY(0)} y2={mapY(0)} className="itest-axis" />
          {heights.map((bar) => (
            <g key={bar.left}>
              <rect
                x={mapX(bar.left)}
                y={mapY(bar.height)}
                width={Math.max(mapX(bar.left + 1) - mapX(bar.left), 0)}
                height={Math.max(mapY(0) - mapY(bar.height), 0)}
                className="itest-bar"
              />
              <circle
                cx={mapX(bar.left + 1)}
                cy={mapY(bar.height)}
                r={4.5}
                className="itest-corner"
              />
            </g>
          ))}
          <path d={area} className="itest-area" />
          <path d={curve} className="itest-curve" />
        </svg>
        <div className="itest-readouts">
          <div className="itest-readout is-series">
            <small>Series</small>
            <strong>{fmt(series)}</strong>
          </div>
          <div className="itest-readout is-integral">
            <small>Integral</small>
            <strong>{fmt(integral)}</strong>
          </div>
          <div className="itest-readout is-gap">
            <small>Series − integral</small>
            <strong>{fmt(series - integral)}</strong>
          </div>
        </div>
        <p className="compare-readout">
          <MathTex expr={`\\sum_{n=${sumFrom}}^{${sumTo}} ${current.tex}`} /> = {fmt(series)}
          {' · '}
          <MathTex expr={`\\int_{${start}}^{${end}} ${current.tex}\\,dx`} /> = {fmt(integral)}
          {series + 1e-6 >= integral
            ? '. The integral sits under the bars.'
            : '. The curve stays above the bars.'}
        </p>
        <label className="slider-block">
          bars = {bars}
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={bars}
            onChange={(event) => setBars(Number(event.target.value))}
          />
        </label>
      </SimPanel>
    </div>
  )
}
