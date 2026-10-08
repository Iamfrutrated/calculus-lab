import { Link } from 'react-router-dom'
import { topics } from '../topics/registry'

const DESCRIPTION =
  'Slope, area, putting them back together — then polynomials that hug a curve, and whether two approaching orbs can meet on the graph.'

export function HomePage() {
  return (
    <div className="page home-page">
      <header className="hero">
        <h1>Calculus Lab</h1>
        <p>{DESCRIPTION}</p>
      </header>
      <div className="card-stack">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            to={`/topic/${topic.slug}`}
            className={`image-card course-art-${topic.art}`}
          >
            <h2>{topic.title}</h2>
            <p>{topic.summary}</p>
            <span>Click to learn more</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
