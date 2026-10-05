import { Link, Navigate, useParams } from 'react-router-dom'
import { getCourse, getTopicsForCourse, type CourseId } from '../topics/registry'

function isCourseId(value: string | undefined): value is CourseId {
  return value === '1' || value === '2' || value === '3' || value === '4'
}

export function CoursePage() {
  const { courseId } = useParams()
  if (!isCourseId(courseId)) return <Navigate to="/" replace />

  const course = getCourse(courseId)
  const topics = getTopicsForCourse(courseId)
  if (!course) return <Navigate to="/" replace />

  return (
    <div className="page course-page">
      <header className="hero">
        <Link to="/" className="back-link">
          Calculus Lab
        </Link>
        <h1>{course.title}</h1>
        <p>
          {topics.length > 0
            ? 'Each card is one picture to build intuition.'
            : course.laterNote}
        </p>
      </header>
      <div className="card-stack">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            to={`/topic/${topic.slug}`}
            className={`image-card course-art-${course.id}`}
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
