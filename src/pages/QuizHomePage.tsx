import { Link } from 'react-router-dom'
import { ModeTabs } from '../components/ModeTabs'
import { quizTopics } from '../quizzes/catalog'

const DESCRIPTION =
  'Check-ins for every main Calculus BC topic. Starter questions for now — the full bank comes later.'

export function QuizHomePage() {
  return (
    <div className="page home-page">
      <header className="hero">
        <ModeTabs />
        <h1>Quizzes</h1>
        <p>{DESCRIPTION}</p>
      </header>
      <div className="card-stack">
        {quizTopics.map((topic) => (
          <Link
            key={topic.id}
            to={`/quiz/${topic.slug}`}
            className={`image-card course-art-${topic.art}`}
          >
            <h2>{topic.title}</h2>
            <p>{topic.summary}</p>
            <span>Start check-in</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
