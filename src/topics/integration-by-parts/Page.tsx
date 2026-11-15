import { useMemo, useState } from 'react'
import { FunctionSelect } from '../../components/FunctionSelect'
import { MathTex } from '../../components/Math'
import { SimPanel } from '../../components/SimPanel'
import { Plane } from './Plane'
import { fmt, integrate, partsExamples, type Choice } from './examples'

type Mode = 'puzzle' | 'strips'

export default function IntegrationByPartsPage() {
  const [selected, setSelected] = useState(partsExamples[0].id)
  const [swapped, setSwapped] = useState(false)
  const [mode, setMode] = useState<Mode>('puzzle')
  const example = partsExamples.find((item) => item.id === selected) ?? partsExamples[0]
  const choice: Choice = swapped ? example.swapped : example.good
  const [a, setA] = useState(example.a)
  const [b, setB] = useState(example.b)
  const [x, setX] = useState((example.a + example.b) / 2)

  const intUdv = useMemo(
    () => integrate(a, b, (t) => choice.u(t) * choice.vp(t)),
    [a, b, choice],
  )
  const intVdu = useMemo(
    () => integrate(a, b, (t) => choice.v(t) * choice.up(t)),
    [a, b, choice],
  )
  const corner = choice.u(b) * choice.v(b) - choice.u(a) * choice.v(a)

  const span = Math.max(b - a, 1e-3)
  const x2 = Math.min(b, x + span / 18)
  const du = choice.u(x2) - choice.u(x)
  const dv = choice.v(x2) - choice.v(x)
  const stripU = choice.u(x) * dv
  const stripV = choice.v(x) * du

  function pick(id: string) {
    const next = partsExamples.find((item) => item.id === id)
    if (!next) return
    setSelected(id)
    setSwapped(false)
    setA(next.a)
    setB(next.b)
    setX((next.a + next.b) / 2)
  }

  return (
    <div className="lesson-stack">
      <section className="lesson-copy">
        <p>
          Plot <MathTex expr="u(x)" /> across and <MathTex expr="v(x)" /> up.
          From <MathTex expr="x=a" /> to <MathTex expr="x=b" />, the sky-blue
          region is <MathTex expr="\int v\,du" /> and the coral region is{' '}
          <MathTex expr="\int u\,dv" />. They lock together into the difference
          of the two corner rectangles:
        </p>
        <MathTex display expr="\big[uv\big]_{a}^{b}=\int_{a}^{b} u\,dv+\int_{a}^{b} v\,du" />
      </section>
      <SimPanel label="Integration by parts">
        <div className="sim-controls">
          <FunctionSelect
            label="example"
            value={selected}
            options={partsExamples.map((item) => ({ id: item.id, label: item.label }))}
            onChange={pick}
          />
          <button
            type="button"
            className={`ibp-swap${swapped ? ' is-on' : ''}`}
            onClick={() => setSwapped((value) => !value)}
          >
            Swap u & dv
          </button>
          <div className="ibp-modes" role="tablist">
            <button
              type="button"
              className={mode === 'puzzle' ? 'is-active' : ''}
              onClick={() => setMode('puzzle')}
            >
              Area puzzle
            </button>
            <button
              type="button"
              className={mode === 'strips' ? 'is-active' : ''}
              onClick={() => setMode('strips')}
            >
              Differential strips
            </button>
          </div>
        </div>
        <div className="ibp-formula">
          <MathTex
            display
            expr={`\\int_{${fmt(a)}}^{${fmt(b)}} ${example.integralTex}\\,dx = \\Big[${choice.uTex}\\cdot ${choice.vTex}\\Big]_{${fmt(a)}}^{${fmt(b)}} - \\int_{${fmt(a)}}^{${fmt(b)}} ${choice.leftoverTex}\\,dx`}
          />
          <p>
            <span className="is-coral">∫ u dv = {fmt(intUdv)}</span>
            <span className="is-gold">[uv] = {fmt(corner)}</span>
            <span className="is-blue">∫ v du = {fmt(intVdu)}</span>
            <span>[uv] − ∫ v du = {fmt(corner - intVdu)}</span>
          </p>
          <p className="ibp-choice">
            u = <MathTex expr={choice.uTex} />, dv = <MathTex expr={choice.dvTex} />,
            so du = <MathTex expr={choice.duTex} /> and v = <MathTex expr={choice.vTex} />.
            {choice.easy
              ? ' The leftover integral is the easier one.'
              : ' Swapped, the leftover integral is the harder one.'}
          </p>
        </div>
        <Plane choice={choice} a={a} b={b} x={x} mode={mode} onScrub={setX} />
        <div className="ibp-legend">
          <span><i className="is-coral" /> ∫ u dv</span>
          <span><i className="is-blue" /> ∫ v du</span>
          <span><i className="is-gold" /> corner rectangles</span>
        </div>
        <div className="ibp-scrub-block">
          <div className="ibp-readouts">
            <div className="ibp-readout is-x">
              <small>x</small>
              <strong>{fmt(x)}</strong>
            </div>
            <div className="ibp-readout is-udv">
              <small>u dv</small>
              <strong>{fmt(stripU)}</strong>
            </div>
            <div className="ibp-readout is-vdu">
              <small>v du</small>
              <strong>{fmt(stripV)}</strong>
            </div>
          </div>
          <label className="slider-block">
            slide x along the curve
            <input
              type="range"
              min={a}
              max={b}
              step={0.01}
              value={x}
              onChange={(event) => setX(Number(event.target.value))}
            />
          </label>
          <p className="ibp-strip-sum">
            u dv + v du = {fmt(stripU + stripV)}, the change in the corner product
          </p>
        </div>
        <div className="ibp-bounds">
          <label className="slider-block">
            a = {fmt(a)}
            <input
              type="range"
              min={example.aMin}
              max={Math.min(example.aMax, b - 0.05)}
              step={0.01}
              value={a}
              onChange={(event) => {
                const next = Number(event.target.value)
                setA(next)
                setX((value) => Math.min(Math.max(value, next), b))
              }}
            />
          </label>
          <label className="slider-block">
            b = {fmt(b)}
            <input
              type="range"
              min={Math.max(example.bMin, a + 0.05)}
              max={example.bMax}
              step={0.01}
              value={b}
              onChange={(event) => {
                const next = Number(event.target.value)
                setB(next)
                setX((value) => Math.min(Math.max(value, a), next))
              }}
            />
          </label>
        </div>
      </SimPanel>
    </div>
  )
}
