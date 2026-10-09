import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ModeTabs } from './ModeTabs'
import { quizNeighbors, type QuizTopic } from '../quizzes/catalog'

type QuizShellProps = {
  topic: QuizTopic
  children: ReactNode
}

export function QuizShell({ topic, children }: QuizShellProps) {
  const { prev, next } = quizNeighbors(topic.slug)

  return (
    <div className="page lesson-page">
      <ModeTabs />
      <header className="lesson-bar">
        <Link to="/quizzes" className="back-link">
          Quizzes
        </Link>
        <h1>{topic.title}</h1>
        <nav className="lesson-nav">
          {prev ? (
            <Link to={`/quiz/${prev.slug}`}>Prev</Link>
          ) : (
            <span className="nav-disabled">Prev</span>
          )}
          {next ? (
            <Link to={`/quiz/${next.slug}`}>Next</Link>
          ) : (
            <span className="nav-disabled">Next</span>
          )}
        </nav>
      </header>
      <div className="lesson-body">{children}</div>
      <Link to="/quizzes" className="home-button">
        Home
      </Link>
    </div>
  )
}
