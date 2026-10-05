import { useState } from 'react'
import { FunctionPlot } from '../../components/FunctionPlot'
import { LessonShell } from '../../components/LessonShell'
import { MathTex } from '../../components/Math'
import { getTopicBySlug } from '../registry'

const topic = getTopicBySlug('limits-intuition')!

type Example = 'smooth' | 'jump' | 'hole'

function smooth(x: number) {
  return 0.18 * x * x - 0.2
}

function jump(x: number) {
  return x < 0 ? -1.2 : 1.2
}

function hole(x: number): number | null {
  if (Math.abs(x - 1) < 1e-8) return null
  return (x * x - 1) / (x - 1)
}

const examples: Record<
  Example,
  {
    label: string
    fn: (x: number) => number | null
    a: number
    holes?: Array<{ x: number; y: number }>
    filledPoints?: Array<{ x: number; y: number }>
    copy: string
    yMin: number
    yMax: number
    breakJump: number
  }
> = {
  smooth: {
    label: 'Smooth',
    fn: smooth,
    a: 1,
    copy: 'Nearby outputs settle on one height — the height of the curve itself.',
    yMin: -1,
    yMax: 4,
    breakJump: 0.85,
  },
  jump: {
    label: 'Jump',
    fn: jump,
    a: 0,
    filledPoints: [{ x: 0, y: 1.2 }],
    holes: [{ x: 0, y: -1.2 }],
    copy: 'The graph breaks. Nearby outputs do not settle on a single height, so there is not one number the function is approaching.',
    yMin: -2.5,
    yMax: 2.5,
    breakJump: 0.25,
  },
  hole: {
    label: 'Hole',
    fn: hole,
    a: 1,
    holes: [{ x: 1, y: 2 }],
    copy: 'A point can be missing and nearby outputs can still settle on one height. The limit is that height, even though the point is gone.',
    yMin: -1,
    yMax: 5,
    breakJump: 0.85,
  },
}

export default function LimitsPage() {
  const [example, setExample] = useState<Example>('smooth')
  const current = examples[example]
  const [x, setX] = useState(current.a + 1.4)

  function choose(next: Example) {
    setExample(next)
    setX(examples[next].a + 1.4)
  }

  const y = current.fn(x)

  return (
    <LessonShell topic={topic}>
      <div className="lesson-grid">
        <section className="lesson-copy">
          <p>
            A limit asks what height the graph settles on as{' '}
            <MathTex expr="x" /> gets close to a chosen input — not whether
            that exact input is on the graph.
          </p>
          <p>{current.copy}</p>
          <p>
            Drag <MathTex expr="x" /> toward{' '}
            <MathTex expr={`${current.a}`} /> and watch the moving point.
          </p>
        </section>
        <section className="lesson-interactive">
          <div className="example-toggle">
            {(Object.keys(examples) as Example[]).map((key) => (
              <button
                key={key}
                type="button"
                className={example === key ? 'is-active' : ''}
                onClick={() => choose(key)}
              >
                {examples[key].label}
              </button>
            ))}
          </div>
          <FunctionPlot
            fn={current.fn}
            xMin={-3}
            xMax={4}
            yMin={current.yMin}
            yMax={current.yMax}
            highlightX={x}
            showGuides
            holes={current.holes}
            filledPoints={current.filledPoints}
            breakJump={current.breakJump}
          />
          <label className="slider-block">
            x = {x.toFixed(2)}
            {y == null || !Number.isFinite(y)
              ? ' · f(x) is missing'
              : ` · f(x) = ${y.toFixed(2)}`}
            <input
              type="range"
              min={-2.5}
              max={3.5}
              step={0.01}
              value={x}
              onChange={(event) => setX(Number(event.target.value))}
            />
          </label>
        </section>
      </div>
    </LessonShell>
  )
}
