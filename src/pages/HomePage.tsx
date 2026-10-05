import { Link } from 'react-router-dom'
import { courseBlurb, courses, getTopicsForCourse } from '../topics/registry'

const DESCRIPTION =
  'Visual intuition for the ideas that start calculus — not a full course. These first topics are limits, one-sided limits, continuity, the derivative, and the integral. More will be added later.'

export function HomePage() {
  return (
    <div className="page home-page">
      <header className="hero">
        <h1>Calculus Lab</h1>
        <p>{DESCRIPTION}</p>
      </header>
      <div className="card-stack">
        {courses.map((course) => {
          const hasTopics = getTopicsForCourse(course.id).length > 0
          const className = `image-card course-art-${course.id}${hasTopics ? '' : ' is-disabled'}`
          const body = (
            <>
              <h2>{course.title}</h2>
              <p>{hasTopics ? `Learn ${courseBlurb(course.id)}.` : courseBlurb(course.id)}</p>
              <span>{hasTopics ? 'Click to learn more' : 'Coming later'}</span>
            </>
          )
          if (!hasTopics) {
            return (
              <div key={course.id} className={className} aria-disabled="true">
                {body}
              </div>
            )
          }
          return (
            <Link key={course.id} to={`/course/${course.id}`} className={className}>
              {body}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
