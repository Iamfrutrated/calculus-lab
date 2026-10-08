import { useMemo, useState } from 'react'
import { FunctionPlot } from '../../components/FunctionPlot'
import { LessonShell } from '../../components/LessonShell'
import { MathTex } from '../../components/Math'
import { continuityFunctions } from '../../lib/catalog'
import { getTopicBySlug } from '../registry'

const topic = getTopicBySlug('continuity')!

function formatY(y: number | null) {
  if (y == null || !Number.isFinite(y)) return '—'
  return y.toFixed(3)
}

export default function ContinuityPage() {
  const [selected, setSelected] = useState(continuityFunctions[0].id)
  const current =
    continuityFunctions.find((item) => item.id === selected) ??
    continuityFunctions[0]
  const [t, setT] = useState(current.approach)
  const c = current.probe
  const arrived = t <= 1e-6
  const sampleT = arrived ? 1e-4 : t
  const leftX = c - sampleT
  const rightX = c + sampleT
  const leftY = current.fn(leftX)
  const rightY = current.fn(rightX)
  const defined = current.filled?.find((point) => Math.abs(point.x - c) < 1e-8)
  const midY = defined?.y ?? current.fn(c)
  const meet =
    leftY != null &&
    rightY != null &&
    Number.isFinite(leftY) &&
    Number.isFinite(rightY) &&
    Math.abs(leftY - rightY) < 0.08
  const hitsValue =
    meet &&
    midY != null &&
    Number.isFinite(midY) &&
    Math.abs(midY - (leftY! + rightY!) / 2) < 0.08
  const orbs = useMemo(() => {
    const next: Array<{ x: number; y: number; side: 'left' | 'right' }> = []
    if (leftY != null && Number.isFinite(leftY)) {
      next.push({ x: arrived ? c : leftX, y: leftY, side: 'left' })
    }
    if (rightY != null && Number.isFinite(rightY)) {
      next.push({ x: arrived ? c : rightX, y: rightY, side: 'right' })
    }
    return next
  }, [arrived, c, leftX, leftY, rightX, rightY])

  let verdict = 'Keep sliding. Watch whether the two orbs head for the same height.'
  if (arrived) {
    if (hitsValue) {
      verdict = 'They meet on the graph. Left and right agree with f(c) — continuous there.'
    } else if (meet && current.kind === 'hole') {
      verdict =
        'The orbs meet each other, but the graph is missing that height (or the plotted point sits somewhere else). Not continuous there.'
    } else if (current.kind === 'infinite') {
      verdict = 'The orbs fly apart along the asymptote. No single height — not continuous there.'
    } else {
      verdict = 'The orbs stop at different heights. A jump — not continuous there.'
    }
  }

  return (
    <LessonShell topic={topic}>
      <div className="lesson-stack">
        <section className="lesson-copy">
          <p>
            Continuity at a point is a two-sided meeting. An orb rides the
            graph in from the left, another from the right. If they arrive at
            the same height, and that height is the value of the function, the
            graph can be crossed without a break:
          </p>
          <MathTex
            display
            expr="\lim_{x\to c^-}f(x)=\lim_{x\to c^+}f(x)=f(c)"
          />
        </section>
        <div className="example-toggle wrap">
          {continuityFunctions.map((item) => (
            <button
              key={item.id}
              type="button"
              className={selected === item.id ? 'is-active' : ''}
              onClick={() => {
                setSelected(item.id)
                setT(item.approach)
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="plot-caption">
          Left orb (coral) and right orb (mint), approaching x = {c}
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
          verticalAsymptotes={current.verticalAsymptotes}
          breakJump={current.breakJump ?? 0.85}
          probeX={c}
          orbs={orbs}
        />
        <label className="slider-block">
          distance to x = {c} is {t.toFixed(2)}
          {arrived ? ' · they have arrived' : ''}
          <input
            type="range"
            min={0}
            max={current.approach}
            step={0.02}
            value={t}
            onChange={(event) => setT(Number(event.target.value))}
          />
        </label>
        <p className="compare-readout">
          Left height {formatY(leftY)} · right height {formatY(rightY)} · f({c}){' '}
          = {formatY(midY)}
        </p>
        <p className="compare-readout">{verdict}</p>
      </div>
    </LessonShell>
  )
}
