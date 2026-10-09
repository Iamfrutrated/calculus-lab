import { Navigate, useParams } from 'react-router-dom'
import { Quiz } from '../components/Quiz'
import { QuizShell } from '../components/QuizShell'
import { getQuizTopicBySlug } from '../quizzes/catalog'

export function QuizTopicPage() {
  const { slug } = useParams()
  const topic = slug ? getQuizTopicBySlug(slug) : undefined

  if (!topic) {
    return <Navigate to="/quizzes" replace />
  }

  return (
    <QuizShell topic={topic}>
      <div className="lesson-stack">
        <section className="lesson-copy">
          <p>{topic.summary}</p>
        </section>
        <Quiz key={topic.slug} questions={topic.questions} />
      </div>
    </QuizShell>
  )
}
