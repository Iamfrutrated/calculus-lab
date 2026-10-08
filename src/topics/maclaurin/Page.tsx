import { useState } from 'react'
import { FunctionPlot } from '../../components/FunctionPlot'
import { LessonShell } from '../../components/LessonShell'
import { MathTex } from '../../components/Math'
import { maclaurinFunctions } from '../../lib/catalog'
import { getTopicBySlug } from '../registry'

const topic = getTopicBySlug('maclaurin')!

export default function MaclaurinPage() {
  const [selected, setSelected] = useState(maclaurinFunctions[0].id)
  const [n, setN] = useState(2)
  const current =
    maclaurinFunctions.find((item) => item.id === selected) ??
    maclaurinFunctions[0]
  const degree = Math.min(n, current.maxDegree)

  return (
    <LessonShell topic={topic}>
      <div className="lesson-stack">
        <section className="lesson-copy">
          <p>
            A Maclaurin polynomial is the Taylor polynomial centered at 0. Blue
            is the true function. Gold is the polynomial built from the first
            derivatives at 0:
          </p>
          <MathTex
            display
            expr="P_n(x)=\sum_{k=0}^{n}\dfrac{f^{(k)}(0)}{k!}\,x^k"
          />
          <p>
            Add terms and watch gold sit closer and closer on blue near zero.
            Farther out, extra terms may still wander — that is the remainder
            talking.
          </p>
        </section>
        <div className="example-toggle wrap">
          {maclaurinFunctions.map((item) => (
            <button
              key={item.id}
              type="button"
              className={selected === item.id ? 'is-active' : ''}
              onClick={() => {
                setSelected(item.id)
                setN(2)
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <MathTex display expr={`P_{${degree}}(x)=${current.tex(degree)}`} />
        <FunctionPlot
          fn={current.fn}
          viewKey={selected}
          xMin={current.view.xMin}
          xMax={current.view.xMax}
          yMin={current.view.yMin}
          yMax={current.view.yMax}
          overlayFn={(x) => current.poly(x, degree)}
          overlayStep={false}
          verticalAsymptotes={selected === 'geom' ? [1] : []}
        />
        <label className="slider-block">
          degree n = {degree}
          {degree === 0 ? ' · just the constant f(0)' : ''}
          <input
            type="range"
            min={0}
            max={current.maxDegree}
            step={1}
            value={degree}
            onChange={(event) => setN(Number(event.target.value))}
          />
        </label>
        <p className="compare-readout">
          Gold is the degree-{degree} Maclaurin polynomial for {current.label}.
          Near x = 0 they share the value and the first {degree} derivatives.
        </p>
      </div>
    </LessonShell>
  )
}
