import { useState } from 'react'
import { FunctionPlot } from '../../components/FunctionPlot'
import { LessonShell } from '../../components/LessonShell'
import { MathTex } from '../../components/Math'
import { getTopicBySlug } from '../registry'

const topic = getTopicBySlug('one-sided-limits')!

type Example = 'step' | 'uneven'

function step(x: number) {
  return x < 0 ? -1.2 : 1.2
}

function uneven(x: number) {
  return x < 1 ? 0.4 : 2.2
}

const examples: Record<
  Example,
  {
    label: string
    fn: (x: number) => number
    a: number
    left: number
    right: number
    holes: Array<{ x: number; y: number }>
    filledPoints: Array<{ x: number; y: number }>
  }
> = {
  step: {
    label: 'Jump at 0',
    fn: step,
    a: 0,
    left: -1.2,
    right: 1.2,
    holes: [{ x: 0, y: -1.2 }],
    filledPoints: [{ x: 0, y: 1.2 }],
  },
  uneven: {
    label: 'Jump at 1',
    fn: uneven,
    a: 1,
    left: 0.4,
    right: 2.2,
    holes: [{ x: 1, y: 0.4 }],
    filledPoints: [{ x: 1, y: 2.2 }],
  },
}

export default function OneSidedLimitsPage() {
  const [example, setExample] = useState<Example>('step')
  const current = examples[example]
  const [x, setX] = useState(current.a - 1.3)

  function choose(next: Example) {
    setExample(next)
    setX(examples[next].a - 1.3)
  }

  const side = x < current.a ? 'left' : 'right'
  const sideHeight = side === 'left' ? current.left : current.right

  return (
    <LessonShell topic={topic}>
      <div className="lesson-grid">
        <section className="lesson-copy">
          <p>
            Approach the break from one side at a time. The left-hand limit is
            the height you settle on as <MathTex expr="x" /> comes in from the
            left. The right-hand limit is the height from the right.
          </p>
          <p>
            On a jump those two heights are different, so there is not a single
            two-sided limit. You are watching that now:{' '}
            {side === 'left' ? 'from the left' : 'from the right'} the graph sits
            near <MathTex expr={`${sideHeight}`} />.
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
            yMin={-2.5}
            yMax={3.2}
            highlightX={x}
            showGuides
            holes={current.holes}
            filledPoints={current.filledPoints}
            breakJump={0.25}
          />
          <label className="slider-block">
            x = {x.toFixed(2)} · {side} height ≈ {sideHeight.toFixed(1)}
            <input
              type="range"
              min={-2.5}
              max={3.2}
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
