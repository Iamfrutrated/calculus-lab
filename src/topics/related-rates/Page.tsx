import { useSearchParams } from 'react-router-dom'
import { ConeToCylinder } from './ConeToCylinder'
import { SlidingLadder } from './SlidingLadder'

const scenarios = [
  {
    id: 'cone',
    title: 'Cone draining into a cylinder',
    blurb: 'One volume leaves, the other arrives. Two levels move at different speeds.',
    Component: ConeToCylinder,
  },
  {
    id: 'ladder',
    title: 'Ladder sliding down a wall',
    blurb: 'A fixed length links the top, the bottom, and the angle between them.',
    Component: SlidingLadder,
  },
] as const

type ScenarioId = (typeof scenarios)[number]['id']

export default function RelatedRatesPage() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('sim')
  const active =
    scenarios.find((item) => item.id === requested) ?? scenarios[0]

  const choose = (id: ScenarioId) => {
    const next = new URLSearchParams(params)
    next.set('sim', id)
    setParams(next, { replace: true })
  }

  return (
    <div className="lesson-stack">
      <section className="lesson-copy">
        <p>
          A related-rates problem is solved by "relating" the different rates.
          In mathematical terms, it means representing one variable, or rate,
          using the other(s).
        </p>
      </section>
      <div className="scenario-tabs" role="tablist" aria-label="Related rates scenarios">
        {scenarios.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === active.id}
            className={item.id === active.id ? 'is-active' : ''}
            onClick={() => choose(item.id)}
          >
            <strong>{item.title}</strong>
            <span>{item.blurb}</span>
          </button>
        ))}
      </div>
      <active.Component key={active.id} />
    </div>
  )
}
