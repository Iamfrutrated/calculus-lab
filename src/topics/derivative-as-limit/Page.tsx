import { useState } from 'react'
import { FunctionPlot } from '../../components/FunctionPlot'
import { LessonShell } from '../../components/LessonShell'
import { MathTex } from '../../components/Math'
import { derivativeFunctions } from '../../lib/catalog'
import { getTopicBySlug } from '../registry'

const topic = getTopicBySlug('derivative-as-limit')!

export default function DerivativeAsLimitPage() {
  const [selected, setSelected] = useState(derivativeFunctions[0].id)
  const [xInput, setXInput] = useState(String(derivativeFunctions[0].defaultX ?? 1))
  const [h, setH] = useState(1.4)
  const current =
    derivativeFunctions.find((item) => item.id === selected) ??
    derivativeFunctions[0]
  const fn = current.fn
  const view = current.view
  const x0 = Number(xInput)
  const xValid = Number.isFinite(x0)
  const y0 = xValid ? fn(x0) : null
  const y1 = xValid ? fn(x0 + h) : null
  const y0n = y0 == null ? NaN : y0
  const y1n = y1 == null ? NaN : y1
  const slope =
    h === 0
      ? xValid
        ? ((fn(x0 + 1e-5) ?? NaN) - (fn(x0) ?? NaN)) / 1e-5
        : NaN
      : Number.isFinite(y0n) && Number.isFinite(y1n)
        ? (y1n - y0n) / h
        : NaN
  const ready = xValid && Number.isFinite(y0n)

  function pick(id: string) {
    setSelected(id)
    const next = derivativeFunctions.find((item) => item.id === id)
    if (next?.defaultX != null) setXInput(String(next.defaultX))
  }

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
            <MathTex expr="(x+h, f(x+h))" />. Slide <MathTex expr="h" /> to 0
            and they merge into the tangent. Scroll the graph to zoom, drag to
            pan.
          </p>
        </section>
        <section className="lesson-interactive">
          <div className="example-toggle wrap">
            {derivativeFunctions.map((item) => (
              <button
                key={item.id}
                type="button"
                className={selected === item.id ? 'is-active' : ''}
                onClick={() => pick(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="field-row">
            <label>
              f(x)
              <input value={current.expr} readOnly />
            </label>
            <label>
              x
              <input
                value={xInput}
                onChange={(event) => setXInput(event.target.value)}
              />
            </label>
          </div>
          {ready ? (
            <FunctionPlot
              fn={fn}
              viewKey={selected}
              xMin={view.xMin}
              xMax={view.xMax}
              yMin={view.yMin}
              yMax={view.yMax}
              filledPoints={
                h === 0
                  ? [{ x: x0, y: y0n }]
                  : Number.isFinite(y1n)
                    ? [
                        { x: x0, y: y0n },
                        { x: x0 + h, y: y1n },
                      ]
                    : [{ x: x0, y: y0n }]
              }
              lineThrough={
                h !== 0 && Number.isFinite(y1n)
                  ? { x1: x0, y1: y0n, x2: x0 + h, y2: y1n }
                  : undefined
              }
              tangent={
                h === 0 && Number.isFinite(slope)
                  ? { x: x0, y: y0n, slope }
                  : undefined
              }
            />
          ) : (
            <p className="lesson-placeholder">Enter a usable x.</p>
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
