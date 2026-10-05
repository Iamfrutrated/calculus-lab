import { useMemo, useState } from 'react'
import { FunctionPlot, type RiemannRect } from '../../components/FunctionPlot'
import { LessonShell } from '../../components/LessonShell'
import { MathTex } from '../../components/Math'
import { getTopicBySlug } from '../registry'

const topic = getTopicBySlug('integrals-ftc')!

const A = 0
const B = 4

function f(x: number) {
  return 0.22 * x * x + 0.55
}

function rightRects(dx: number): RiemannRect[] {
  if (dx <= 0) return []
  const rects: RiemannRect[] = []
  for (let left = A; left < B - 1e-9; left += dx) {
    const width = Math.min(dx, B - left)
    const right = left + width
    rects.push({ x: left, width, height: f(right) })
    if (rects.length > 220) break
  }
  return rects
}

export default function FtcPage() {
  const [dx, setDx] = useState(1)
  const rectangles = useMemo(() => rightRects(dx), [dx])
  const fillExact = dx === 0

  return (
    <LessonShell topic={topic}>
      <div className="lesson-grid">
        <section className="lesson-copy">
          <p>
            The <MathTex expr="dx" /> in{' '}
            <MathTex expr="\int_a^b f(x)\,dx" /> is a dummy width — a slice of
            the input axis, not a special number the function cares about. You
            choose how wide the slices are, add{' '}
            <MathTex expr="f(\text{right})\,dx" /> for each one (a right
            Riemann sum), and then let that width vanish.
          </p>
          <p>
            Gray is the true region under the curve. Each yellow panel is one{' '}
            <MathTex expr="dx" /> slice. Slide <MathTex expr="dx" /> toward 0
            and the yellow fills the gray: that covering is the integral.
          </p>
        </section>
        <section className="lesson-interactive">
          <FunctionPlot
            fn={f}
            xMin={-0.4}
            xMax={4.6}
            yMin={-0.4}
            yMax={4.6}
            areaFrom={A}
            areaTo={B}
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
