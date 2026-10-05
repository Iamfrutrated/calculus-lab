import { useMemo, useState } from 'react'
import { FunctionPlot } from '../../components/FunctionPlot'
import { LessonShell } from '../../components/LessonShell'
import { MathTex } from '../../components/Math'
import { compileFunction } from '../../lib/compileFunction'
import { getTopicBySlug } from '../registry'

const topic = getTopicBySlug('derivative-as-limit')!

export default function DerivativeAsLimitPage() {
  const [expr, setExpr] = useState('x^2')
  const [xInput, setXInput] = useState('1')
  const [h, setH] = useState(1.4)
  const fn = useMemo(() => compileFunction(expr), [expr])
  const x0 = Number(xInput)
  const xValid = Number.isFinite(x0)
  const y0 = fn && xValid ? fn(x0) : NaN
  const y1 = fn && xValid ? fn(x0 + h) : NaN
  const slope =
    h === 0
      ? fn && xValid
        ? (fn(x0 + 1e-5) - fn(x0)) / 1e-5
        : NaN
      : y0 === y0 && y1 === y1
        ? (y1 - y0) / h
        : NaN

  const ready = Boolean(fn) && xValid && Number.isFinite(y0)

  return (
    <LessonShell topic={topic}>
      <div className="lesson-grid">
        <section className="lesson-copy">
          <p>
            The derivative is the ordinary slope formula, written between a
            point and a nearby point, then sending the run to zero:
          </p>
          <MathTex
            display
            expr="\dfrac{f(x+h)-f(x)}{h} = \dfrac{\text{rise}}{\text{run}}"
          />
          <p>
            The two dots are <MathTex expr="(x, f(x))" /> and{' '}
            <MathTex expr="(x+h, f(x+h))" />. The line through them is a
            secant. Slide <MathTex expr="h" /> to 0 and the dots merge into the
            tangent line — that slope is <MathTex expr="f'(x)" />.
          </p>
          <p>
            Try <MathTex expr="x^2" />, <MathTex expr="\sin(x)" />, or{' '}
            <MathTex expr="0.2x^3 - x" />.
          </p>
        </section>
        <section className="lesson-interactive">
          <div className="field-row">
            <label>
              f(x)
              <input
                value={expr}
                onChange={(event) => setExpr(event.target.value)}
                spellCheck={false}
              />
            </label>
            <label>
              x
              <input
                value={xInput}
                onChange={(event) => setXInput(event.target.value)}
              />
            </label>
          </div>
          {ready && fn ? (
            <FunctionPlot
              fn={fn}
              xMin={x0 - 4}
              xMax={x0 + 4}
              yMin={y0 - 6}
              yMax={y0 + 6}
              filledPoints={
                h === 0
                  ? [{ x: x0, y: y0 }]
                  : Number.isFinite(y1)
                    ? [
                        { x: x0, y: y0 },
                        { x: x0 + h, y: y1 },
                      ]
                    : [{ x: x0, y: y0 }]
              }
              lineThrough={
                h !== 0 && Number.isFinite(y1)
                  ? { x1: x0, y1: y0, x2: x0 + h, y2: y1 }
                  : undefined
              }
              tangent={
                h === 0 && Number.isFinite(slope)
                  ? { x: x0, y: y0, slope }
                  : undefined
              }
            />
          ) : (
            <p className="lesson-placeholder">Enter a usable f(x) and x.</p>
          )}
          <label className="slider-block">
            h = {h.toFixed(2)}
            {Number.isFinite(slope) ? ` · slope = ${slope.toFixed(3)}` : ''}
            <input
              type="range"
              min={0}
              max={2.5}
              step={0.01}
              value={h}
              onChange={(event) => setH(Number(event.target.value))}
            />
          </label>
        </section>
      </div>
    </LessonShell>
  )
}
