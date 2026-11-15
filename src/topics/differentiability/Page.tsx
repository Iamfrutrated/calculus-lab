import { useMemo, useState } from 'react'
import { FunctionPlot, PLOT_EQUAL_SCALE } from '../../components/FunctionPlot'
import { FunctionSelect } from '../../components/FunctionSelect'
import { SimPanel } from '../../components/SimPanel'
import { MathTex } from '../../components/Math'
import {
  differentiabilityFunctions,
  type DifferentiabilityFn,
  type PlotView,
} from '../../lib/catalog'

const CLOSE = 0.02

function valueAt(fn: DifferentiabilityFn['fn'], x: number) {
  const y = fn(x)
  if (y == null || !Number.isFinite(y)) return null
  return y
}

function sideSlope(fn: DifferentiabilityFn['fn'], c: number, h: number, side: 'left' | 'right') {
  if (!(h > 0)) return null
  const y0 = valueAt(fn, c)
  const y1 = valueAt(fn, side === 'left' ? c - h : c + h)
  if (y0 == null || y1 == null) return null
  return side === 'left' ? (y0 - y1) / h : (y1 - y0) / h
}

type SideLimit =
  | { kind: 'missing' }
  | { kind: 'unsettled' }
  | { kind: 'value'; value: number }

function limitSlope(fn: DifferentiabilityFn['fn'], c: number, side: 'left' | 'right'): SideLimit {
  const samples = [0.04, 0.01, 0.002].map((h) => sideSlope(fn, c, h, side))
  if (samples.some((slope) => slope == null)) return { kind: 'missing' }
  const slopes = samples as number[]
  if (slopes.some((slope) => Math.abs(slope) > 200)) return { kind: 'unsettled' }
  const spread = Math.max(...slopes) - Math.min(...slopes)
  const scale = Math.max(Math.abs(slopes[1]), 1)
  if (spread > 0.4 && spread > 0.25 * scale) return { kind: 'unsettled' }
  return { kind: 'value', value: slopes[2] }
}

function formatSlope(slope: number | null) {
  if (slope == null || !Number.isFinite(slope)) return '—'
  if (Math.abs(slope) > 999) return slope > 0 ? 'huge' : 'huge, negative'
  return slope.toFixed(2)
}

function zoomWindow(current: DifferentiabilityFn, c: number, dx: number): PlotView {
  const full = current.view
  const t = current.dxMax > 0 ? dx / current.dxMax : 0
  const fullHalf = (full.xMax - full.xMin) / 2
  const tight = Math.min(fullHalf, Math.max(0.45, dx * 4))
  let xHalf = t * fullHalf + (1 - t) * tight
  let lo = 0
  let hi = 0
  for (let pass = 0; pass < 4; pass++) {
    const ys: number[] = []
    for (let i = 0; i <= 48; i++) {
      const y = valueAt(current.fn, c - xHalf + (i / 48) * (2 * xHalf))
      if (y != null && Math.abs(y) < 40) ys.push(y)
    }
    const anchor = valueAt(current.fn, c)
    if (anchor != null) ys.push(anchor)
    lo = ys.length ? Math.min(...ys) : 0
    hi = ys.length ? Math.max(...ys) : 0
    const neededHalf = Math.max((hi - lo) * 0.62, 0.3)
    const next = Math.max(xHalf, neededHalf / PLOT_EQUAL_SCALE)
    if (next <= xHalf * 1.02) {
      xHalf = next
      break
    }
    xHalf = next
  }
  const yHalf = xHalf * PLOT_EQUAL_SCALE
  const mid = (lo + hi) / 2
  return { xMin: c - xHalf, xMax: c + xHalf, yMin: mid - yHalf, yMax: mid + yHalf }
}

export default function DifferentiabilityPage() {
  const [selected, setSelected] = useState(differentiabilityFunctions[0].id)
  const current =
    differentiabilityFunctions.find((item) => item.id === selected) ??
    differentiabilityFunctions[0]
  const [c, setC] = useState(current.defaultC)
  const [dx, setDx] = useState(current.dxMax * 0.55)

  const center = valueAt(current.fn, c)
  const leftY = dx > 0 ? valueAt(current.fn, c - dx) : center
  const rightY = dx > 0 ? valueAt(current.fn, c + dx) : center
  const leftNow = sideSlope(current.fn, c, dx, 'left')
  const rightNow = sideSlope(current.fn, c, dx, 'right')
  const leftLimit = useMemo(() => limitSlope(current.fn, c, 'left'), [current, c])
  const rightLimit = useMemo(() => limitSlope(current.fn, c, 'right'), [current, c])
  const arrived = dx <= CLOSE
  const frame = zoomWindow(current, c, dx)

  const missingNow =
    center == null ? 'center' : leftY == null ? 'left' : rightY == null ? 'right' : null

  const slopeLabel = (side: 'left' | 'right') => {
    if (center == null) return 'no point'
    const live = side === 'left' ? leftNow : rightNow
    const liveY = side === 'left' ? leftY : rightY
    const limit = side === 'left' ? leftLimit : rightLimit
    if (!arrived) return liveY == null ? 'no point' : formatSlope(live)
    if (limit.kind === 'missing') return 'no point'
    if (limit.kind === 'unsettled') return 'no limit'
    return formatSlope(limit.value)
  }

  let status: { tone: 'yes' | 'no' | 'pending'; label: string }
  if (center == null) {
    status = { tone: 'no', label: 'No center point' }
  } else if (leftLimit.kind === 'missing' || rightLimit.kind === 'missing') {
    status = {
      tone: 'no',
      label:
        leftLimit.kind === 'missing' && rightLimit.kind === 'missing'
          ? 'No point on either side'
          : leftLimit.kind === 'missing'
            ? 'No left point'
            : 'No right point',
    }
  } else if (!arrived && missingNow) {
    status = { tone: 'pending', label: 'This dx leaves the graph' }
  } else if (!arrived) {
    status = { tone: 'pending', label: 'Slide dx to 0' }
  } else if (leftLimit.kind === 'unsettled' || rightLimit.kind === 'unsettled') {
    status = { tone: 'no', label: 'Slope does not settle' }
  } else if (Math.abs(leftLimit.value - rightLimit.value) > 0.15) {
    status = { tone: 'no', label: 'Two slopes' }
  } else {
    status = { tone: 'yes', label: 'One slope' }
  }

  const showLimit = arrived || center == null || leftLimit.kind === 'missing' || rightLimit.kind === 'missing'
  const secants =
    dx > CLOSE && center != null
      ? [
          leftY != null
            ? { x1: c - dx, y1: leftY, x2: c, y2: center, side: 'left' as const }
            : null,
          rightY != null
            ? { x1: c, y1: center, x2: c + dx, y2: rightY, side: 'right' as const }
            : null,
        ].filter((seg) => seg != null)
      : []

  const tangent =
    showLimit &&
    leftLimit.kind === 'value' &&
    rightLimit.kind === 'value' &&
    Math.abs(leftLimit.value - rightLimit.value) <= 0.15 &&
    center != null
      ? { x: c, y: center, slope: (leftLimit.value + rightLimit.value) / 2 }
      : undefined

  const cornerRays =
    showLimit &&
    tangent == null &&
    center != null &&
    leftLimit.kind === 'value' &&
    rightLimit.kind === 'value'
      ? [
          {
            x1: c,
            y1: center,
            x2: c - 0.35,
            y2: center - leftLimit.value * 0.35,
            side: 'left' as const,
          },
          {
            x1: c,
            y1: center,
            x2: c + 0.35,
            y2: center + rightLimit.value * 0.35,
            side: 'right' as const,
          },
        ]
      : []

  const orbs = [
    dx > CLOSE && leftY != null ? { x: c - dx, y: leftY, side: 'left' as const } : null,
    dx > CLOSE && rightY != null ? { x: c + dx, y: rightY, side: 'right' as const } : null,
  ].filter((orb) => orb != null)

  const filled = [
    ...(current.filled ?? []),
    ...(center != null ? [{ x: c, y: center }] : []),
  ]

  function pick(id: string) {
    const next = differentiabilityFunctions.find((item) => item.id === id)
    if (!next) return
    setSelected(id)
    setC(next.defaultC)
    setDx(next.dxMax * 0.55)
  }

  return (
    <div className="lesson-grid">
      <section className="lesson-copy">
        <p>
          Differentiable at a point means one slope, shared by the left and the
          right. Pick the point, then send <MathTex expr="dx" /> to 0. A coral
          point comes in from the left and a mint point from the right, and each
          one makes a slope with the center:
        </p>
        <MathTex
          display
          expr="\frac{f(c)-f(c-dx)}{dx} \quad\text{and}\quad \frac{f(c+dx)-f(c)}{dx}"
        />
        <p>
          If the center, the left point, or the right point is missing, there is
          nothing to connect, so the slope cannot be determined.
        </p>
      </section>
      <SimPanel>
        <FunctionSelect
          value={selected}
          options={differentiabilityFunctions.map((item) => ({
            id: item.id,
            label: item.label,
          }))}
          onChange={pick}
        />
        <p className="plot-caption">
          Center at x = {c.toFixed(2)}
          {dx > CLOSE
            ? ` · left x = ${(c - dx).toFixed(2)} · right x = ${(c + dx).toFixed(2)}`
            : ' · dx has reached the point'}
        </p>
        <FunctionPlot
          fn={current.fn}
          viewKey={`${selected}:${c.toFixed(2)}:${dx.toFixed(2)}`}
          xMin={frame.xMin}
          xMax={frame.xMax}
          yMin={frame.yMin}
          yMax={frame.yMax}
          holes={current.holes}
          filledPoints={filled}
          verticalAsymptotes={current.verticalAsymptotes}
          breakJump={current.breakJump ?? 0.85}
          probeX={c}
          orbs={orbs}
          secants={[...secants, ...cornerRays]}
          tangent={tangent}
        />
        <label className="slider-block">
          point c = {c.toFixed(2)}
          <input
            type="range"
            min={current.cMin}
            max={current.cMax}
            step={0.05}
            value={c}
            onChange={(event) => setC(Number(event.target.value))}
          />
        </label>
        <label className="slider-block">
          dx = {dx.toFixed(2)}
          <input
            type="range"
            min={0}
            max={current.dxMax}
            step={0.01}
            value={dx}
            onChange={(event) => setDx(Number(event.target.value))}
          />
        </label>
        <div className="diff-legend" aria-live="polite">
          <div className={`diff-status is-${status.tone}`}>{status.label}</div>
          <div className="diff-legend-item">
            <span className="diff-swatch is-left" />
            <span>
              <small>Left slope</small>
              <strong>{slopeLabel('left')}</strong>
            </span>
          </div>
          <div className="diff-legend-item">
            <span className="diff-swatch is-right" />
            <span>
              <small>Right slope</small>
              <strong>{slopeLabel('right')}</strong>
            </span>
          </div>
        </div>
      </SimPanel>
    </div>
  )
}
