import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { topicNeighbors, type Topic } from '../topics/registry'

type LessonShellProps = {
  topic: Topic
  children: ReactNode
}

export function LessonShell({ topic, children }: LessonShellProps) {
  const { prev, next } = topicNeighbors(topic.slug)

  return (
    <div className="page lesson-page">
      <header className="lesson-bar">
        <Link to="/" className="back-link">
          Calculus Lab
        </Link>
        <h1>{topic.title}</h1>
        <nav className="lesson-nav">
          {prev ? (
            <Link to={`/topic/${prev.slug}`}>Prev</Link>
          ) : (
            <span className="nav-disabled">Prev</span>
          )}
          {next ? (
            <Link to={`/topic/${next.slug}`}>Next</Link>
          ) : (
            <span className="nav-disabled">Next</span>
          )}
        </nav>
      </header>
      <div className="lesson-body">{children}</div>
      <Link to="/" className="home-button">
        Home
      </Link>
    </div>
  )
}
