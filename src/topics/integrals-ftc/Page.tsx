import { useMemo, useState } from 'react'
import { FunctionPlot, type RiemannRect } from '../../components/FunctionPlot'
import { LessonShell } from '../../components/LessonShell'
import { MathTex } from '../../components/Math'
import { ftcFunctions } from '../../lib/catalog'
import { getTopicBySlug } from '../registry'

const topic = getTopicBySlug('integrals-ftc')!

function rightRects(
  fn: (x: number) => number | null,
  a: number,
  b: number,
  dx: number,
): RiemannRect[] {
  if (dx <= 0) return []
  const rects: RiemannRect[] = []
  for (let left = a; left < b - 1e-9; left += dx) {
    const width = Math.min(dx, b - left)
    const right = left + width
    const height = fn(right)
    if (height == null || !Number.isFinite(height)) continue
    rects.push({ x: left, width, height })
    if (rects.length > 220) break
  }
  return rects
}

export default function FtcPage() {
  const [selected, setSelected] = useState(ftcFunctions[0].id)
  const [dx, setDx] = useState(1)
  const current = ftcFunctions.find((item) => item.id === selected) ?? ftcFunctions[0]
  const a = current.areaFrom ?? 0
  const b = current.areaTo ?? 4
  const rectangles = useMemo(
    () => rightRects(current.fn, a, b, dx),
    [current, a, b, dx],
  )
  const fillExact = dx === 0

  return (
    <LessonShell topic={topic}>
      <div className="lesson-grid">
        <section className="lesson-copy">
          <p>
            The <MathTex expr="dx" /> in{' '}
            <MathTex expr="\int_a^b f(x)\,dx" /> is a dummy width — a slice of
            the input axis. You choose how wide the slices are, add{' '}
            <MathTex expr="f(\text{right})\,dx" /> for each one (a right
            Riemann sum), then let that width vanish.
          </p>
          <p>
            Gray is the true region under the curve. Each yellow panel is one{' '}
            <MathTex expr="dx" /> slice. Slide <MathTex expr="dx" /> toward 0
            and the yellow fills the gray. Scroll to zoom, drag to pan.
          </p>
        </section>
        <section className="lesson-interactive">
          <div className="example-toggle wrap">
            {ftcFunctions.map((item) => (
              <button
                key={item.id}
                type="button"
                className={selected === item.id ? 'is-active' : ''}
                onClick={() => {
                  setSelected(item.id)
                  setDx(1)
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <FunctionPlot
            fn={current.fn}
            viewKey={selected}
            xMin={current.view.xMin}
            xMax={current.view.xMax}
            yMin={current.view.yMin}
            yMax={current.view.yMax}
            areaFrom={a}
            areaTo={b}
            coverArea={fillExact}
            rectangles={fillExact ? [] : rectangles}
          />
          <label className="slider-block">
            dx = {dx.toFixed(2)}
            {fillExact ? ' · slices fill the gray region' : ''}
            <input
              type="range"
              min={0}
              max={1.6}
              step={0.02}
              value={dx}
              onChange={(event) => setDx(Number(event.target.value))}
            />
          </label>
        </section>
      </div>
    </LessonShell>
  )
}
