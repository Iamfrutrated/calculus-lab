import { Link, useLocation } from 'react-router-dom'

export function ModeTabs() {
  const { pathname } = useLocation()
  const simActive = pathname === '/' || pathname.startsWith('/topic')
  const quizActive = pathname.startsWith('/quiz')

  return (
    <nav className="mode-tabs" aria-label="Main sections">
      <Link to="/" className={simActive ? 'is-active' : ''}>
        Simulations
      </Link>
      <Link to="/quizzes" className={quizActive ? 'is-active' : ''}>
        Quizzes
      </Link>
    </nav>
  )
}
