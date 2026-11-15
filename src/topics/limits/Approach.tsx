import { useState } from 'react'
import { FunctionPlot } from '../../components/FunctionPlot'
import { FunctionSelect } from '../../components/FunctionSelect'
import { SimPanel } from '../../components/SimPanel'

type ApproachFn = {
  id: string
  label: string
  c: number
  hMax: number
  limit: number | null
  fn: (x: number) => number | null
  view: { xMin: number; xMax: number; yMin: number; yMax: number }
  holes?: Array<{ x: number; y: number }>
  filled?: Array<{ x: number; y: number }>
  breakJump?: number
}

const functions: ApproachFn[] = [
  {
    id: 'x2',
    label: 'x²',
    c: 1,
    hMax: 2,
    limit: 1,
    fn: (x) => x * x,
    view: { xMin: -1, xMax: 3, yMin: -0.5, yMax: 6 },
  },
  {
    id: 'sinc',
    label: 'sin(x)/x',
    c: 0,
    hMax: 2.5,
    limit: 1,
    fn: (x) => (Math.abs(x) < 1e-8 ? null : Math.sin(x) / x),
    holes: [{ x: 0, y: 1 }],
    view: { xMin: -8, xMax: 8, yMin: -0.4, yMax: 1.4 },
  },
  {
    id: 'hole',
    label: 'hole',
    c: 1,
    hMax: 2,
    limit: 2,
    fn: (x) => (Math.abs(x - 1) < 1e-8 ? null : (x * x - 1) / (x - 1)),
    holes: [{ x: 1, y: 2 }],
    view: { xMin: -1, xMax: 3.2, yMin: -0.4, yMax: 4.4 },
  },
  {
    id: 'jump',
    label: 'jump',
    c: 0,
    hMax: 2,
    limit: null,
    fn: (x) => (x < 0 ? -1 : 1),
    holes: [{ x: 0, y: -1 }],
    filled: [{ x: 0, y: 1 }],
    breakJump: 0.2,
    view: { xMin: -3, xMax: 3, yMin: -2, yMax: 2 },
  },
]

function fmt(value: number | null) {
  if (value == null || !Number.isFinite(value)) return '—'
  return value.toFixed(3)
}

export function Approach() {
  const [selected, setSelected] = useState(functions[0].id)
  const current = functions.find((item) => item.id === selected) ?? functions[0]
  const [h, setH] = useState(current.hMax * 0.6)
  const sample = h < 1e-6 ? 1e-4 : h
  const left = current.fn(current.c - sample)
  const right = current.fn(current.c + sample)
  const agree =
    left != null &&
    right != null &&
    Number.isFinite(left) &&
    Number.isFinite(right) &&
    Math.abs(left - right) < 0.04
  const arrived = h < 0.02

  return (
    <SimPanel label="Two-sided approach">
      <FunctionSelect
        label="f(x)"
        value={selected}
        options={functions.map((item) => ({ id: item.id, label: item.label }))}
        onChange={(id) => {
          const next = functions.find((item) => item.id === id)
          setSelected(id)
          setH((next?.hMax ?? 2) * 0.6)
        }}
      />
      <p className="plot-caption">
        Coral comes from the left of x = {current.c}, mint from the right. The limit is the height they share.
      </p>
      <FunctionPlot
        fn={current.fn}
        viewKey={selected}
        xMin={current.view.xMin}
        xMax={current.view.xMax}
        yMin={current.view.yMin}
        yMax={current.view.yMax}
        holes={current.holes}
        filledPoints={current.filled}
        breakJump={current.breakJump}
        probeX={current.c}
        orbs={[
          left != null && Number.isFinite(left)
            ? { x: current.c - (h < 1e-6 ? 0 : h), y: left, side: 'left' as const }
            : null,
          right != null && Number.isFinite(right)
            ? { x: current.c + (h < 1e-6 ? 0 : h), y: right, side: 'right' as const }
            : null,
        ].filter((orb) => orb != null)}
      />
      <div className="itest-readouts">
        <div className="ibp-readout is-udv">
          <small>Left height</small>
          <strong>{fmt(left)}</strong>
        </div>
        <div className="ibp-readout is-vdu">
          <small>Right height</small>
          <strong>{fmt(right)}</strong>
        </div>
      </div>
      <label className="slider-block">
        h = {h.toFixed(2)}
        <input
          type="range"
          min={0}
          max={current.hMax}
          step={0.01}
          value={h}
          onChange={(event) => setH(Number(event.target.value))}
        />
      </label>
      <p className="compare-readout">
        {!arrived
          ? 'Send h to 0 and watch the two heights.'
          : agree
            ? `Both sides settle on ${fmt(left)}. That number is the limit, whether or not the point itself is filled in.`
            : 'The two heights stay apart. There is no single limit here.'}
      </p>
    </SimPanel>
  )
}
