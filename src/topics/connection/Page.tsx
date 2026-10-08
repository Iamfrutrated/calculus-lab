import { useMemo, useState } from 'react'
import { FunctionPlot, type RiemannRect } from '../../components/FunctionPlot'
import { LessonShell } from '../../components/LessonShell'
import { MathTex } from '../../components/Math'
import { derivativeFunctions } from '../../lib/catalog'
import { getTopicBySlug } from '../registry'

const topic = getTopicBySlug('connection')!
const functions = derivativeFunctions.filter((item) => item.dfn)

type Approx = {
  points: Array<{ x: number; y: number }>
  rectangles: RiemannRect[]
  valueAtB: number | null
}

function accumulate(
  f: (x: number) => number | null,
  df: (x: number) => number | null,
  a: number,
  b: number,
  dx: number,
): Approx {
  const start = f(a)
  if (start == null || !Number.isFinite(start)) {
    return { points: [], rectangles: [], valueAtB: null }
  }
  if (dx <= 0) {
    return { points: [], rectangles: [], valueAtB: f(b) }
  }
  const points = [{ x: a, y: start }]
  const rectangles: RiemannRect[] = []
  let sum = start
  for (let left = a; left < b - 1e-9; left += dx) {
    const width = Math.min(dx, b - left)
    const right = left + width
    const height = df(right)
    if (height == null || !Number.isFinite(height)) {
      return { points, rectangles, valueAtB: null }
    }
    rectangles.push({ x: left, width, height })
    sum += height * width
    points.push({ x: right, y: sum })
    if (rectangles.length > 240) break
  }
  return { points, rectangles, valueAtB: sum }
}

export default function ConnectionPage() {
  const [selected, setSelected] = useState(functions[0].id)
  const [dx, setDx] = useState(0.8)
  const [c, setC] = useState(0)
  const current = functions.find((item) => item.id === selected) ?? functions[0]
  const a = current.recoverFrom ?? 0
  const b = current.recoverTo ?? 2
  const view = current.recoverView ?? current.view
  const df = current.dfn!
  const fillExact = dx === 0
  const approx = useMemo(
    () => accumulate(current.fn, df, a, b, dx),
    [current, df, a, b, dx],
  )
  const shifted = useMemo(
    () => ({
      points: approx.points.map((point) => ({ x: point.x, y: point.y + c })),
      valueAtB: approx.valueAtB == null ? null : approx.valueAtB + c,
    }),
    [approx, c],
  )
  const trueB = current.fn(b)
  const shiftedB = trueB == null ? null : trueB + c
  const matchesF = Math.abs(c) < 1e-9
  const merged =
    matchesF &&
    (fillExact ||
      (approx.valueAtB != null &&
        trueB != null &&
        Math.abs(approx.valueAtB - trueB) < 0.02))

  return (
    <LessonShell topic={topic}>
      <div className="lesson-stack">
        <section className="lesson-copy">
          <p>
            Mapping the slope of <MathTex expr="f" /> at every point gives{' '}
            <MathTex expr="f'" />. If you then add up those slopes as a Riemann
            sum — slices of width <MathTex expr="dx" /> — you are adding back
            the little changes that built <MathTex expr="f" /> in the first
            place:
          </p>
          <MathTex
            display
            expr="f(a)+C+\sum f'(x_i)\,dx \;\approx\; f(b)+C"
          />
          <p>
            Left: the original graph (blue) and the running Riemann total of{' '}
            <MathTex expr="f'" /> (gold). Right: <MathTex expr="f'" /> itself
            with the slices. Slide <MathTex expr="dx" /> to 0 and the gold
            reconstruction takes the shape of <MathTex expr="f" />. Slide{' '}
            <MathTex expr="C" /> and that same shape lifts or drops — one
            derivative, many antiderivatives.
          </p>
        </section>
        <div className="example-toggle wrap">
          {functions.map((item) => (
            <button
              key={item.id}
              type="button"
              className={selected === item.id ? 'is-active' : ''}
              onClick={() => {
                setSelected(item.id)
                setDx(0.8)
                setC(0)
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="compare-grid">
          <div>
            <p className="plot-caption">
              Original {current.label} (blue) vs reconstruction from {current.dLabel} (gold)
            </p>
            <FunctionPlot
              fn={current.fn}
              viewKey={`${selected}-f`}
              xMin={view.xMin}
              xMax={view.xMax}
              yMin={view.yMin}
              yMax={view.yMax}
              overlayFn={
                fillExact
                  ? (x) => {
                      const y = current.fn(x)
                      return y == null ? null : y + c
                    }
                  : undefined
              }
              overlayPoints={fillExact ? [] : shifted.points}
              overlayStep
            />
          </div>
          <div>
            <p className="plot-caption">
              Derivative {current.dLabel}, sliced by dx
            </p>
            <FunctionPlot
              fn={df}
              viewKey={`${selected}-df`}
              xMin={view.xMin}
              xMax={view.xMax}
              yMin={Math.min(view.yMin, -1)}
              yMax={Math.max(view.yMax, 3)}
              areaFrom={a}
              areaTo={b}
              coverArea={fillExact}
              rectangles={fillExact ? [] : approx.rectangles}
            />
          </div>
        </div>
        <label className="slider-block">
          dx = {dx.toFixed(2)}
          {fillExact
            ? matchesF
              ? ' · the reconstruction matches f'
              : ' · same shape as f, shifted by C'
            : ''}
          <input
            type="range"
            min={0}
            max={Math.max(0.4, (b - a) / 2)}
            step={0.02}
            value={dx}
            onChange={(event) => setDx(Number(event.target.value))}
          />
        </label>
        <label className="slider-block">
          C = {c.toFixed(1)}
          {Math.abs(c) < 1e-9
            ? ' · one particular antiderivative'
            : ' · a different function with the same derivative'}
          <input
            type="range"
            min={-2.5}
            max={2.5}
            step={0.1}
            value={c}
            onChange={(event) => setC(Number(event.target.value))}
          />
        </label>
        <p className="compare-readout">
          At x = {b.toFixed(2)}, f(x) ={' '}
          {trueB == null ? '—' : trueB.toFixed(3)}
          {fillExact
            ? ` · reconstruction = ${shiftedB == null ? '—' : shiftedB.toFixed(3)}`
            : ` · Riemann total = ${shifted.valueAtB == null ? '—' : shifted.valueAtB.toFixed(3)}`}
          {merged && !fillExact ? ' · almost merged' : ''}
        </p>
      </div>
    </LessonShell>
  )
}
