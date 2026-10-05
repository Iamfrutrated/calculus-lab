import { useEffect, useRef, useState } from 'react'
import { FunctionPlot } from '../../components/FunctionPlot'
import { LessonShell } from '../../components/LessonShell'
import { getTopicBySlug } from '../registry'

const topic = getTopicBySlug('continuity')!

type Example = 'smooth' | 'jump'

function smooth(x: number) {
  return 1.4 * Math.sin(x) + 0.2 * x
}

function jump(x: number) {
  return x < 0.4 ? 1.1 * Math.sin(x) : 1.1 * Math.sin(x) + 1.8
}

export default function ContinuityPage() {
  const [example, setExample] = useState<Example>('smooth')
  const [x, setX] = useState(-3)
  const playing = useRef(true)

  useEffect(() => {
    playing.current = true
    let frame = 0
    const tick = () => {
      if (!playing.current) return
      setX((prev) => {
        const next = prev + 0.03
        return next > 3.2 ? -3 : next
      })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      playing.current = false
      cancelAnimationFrame(frame)
    }
  }, [example])

  const fn = example === 'smooth' ? smooth : jump
  const y = fn(x)

  return (
    <LessonShell topic={topic}>
      <div className="lesson-grid">
        <section className="lesson-copy">
          <p>
            Watch the point travel along the graph. The visual test: if it can
            move smoothly — no sudden break, no sudden change of direction —
            the function is continuous.
          </p>
          {example === 'smooth' ? (
            <p>
              Here the point stays on the curve and the path never jerks. That
              is the picture of continuity.
            </p>
          ) : (
            <p>
              At the jump the point cannot keep going without a sudden break.
              That graph is not continuous there.
            </p>
          )}
        </section>
        <section className="lesson-interactive">
          <div className="example-toggle">
            <button
              type="button"
              className={example === 'smooth' ? 'is-active' : ''}
              onClick={() => {
                setExample('smooth')
                setX(-3)
              }}
            >
              Continuous
            </button>
            <button
              type="button"
              className={example === 'jump' ? 'is-active' : ''}
              onClick={() => {
                setExample('jump')
                setX(-3)
              }}
            >
              Jump
            </button>
          </div>
          <FunctionPlot
            fn={fn}
            xMin={-3.4}
            xMax={3.6}
            yMin={-3}
            yMax={4}
            highlightX={x}
            filledPoints={[{ x, y }]}
            breakJump={0.22}
          />
        </section>
      </div>
    </LessonShell>
  )
}
