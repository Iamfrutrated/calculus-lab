import { Suspense } from 'react'
import { Link, Navigate, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { Quiz } from './Quiz'
import { getLearnTopic, learnTopics, simulationSlugToLearn } from '../learn/topics'
import { ThemeProvider, useTheme } from '../theme/ThemeContext'

type View = 'simulation' | 'quiz'

function SimPlaceholder({ title }: { title: string }) {
  return (
    <section className="sim-panel sim-placeholder">
      <div className="sim-panel-head">Interactive lab</div>
      <svg viewBox="0 0 640 280" className="placeholder-art" role="img" aria-label="Placeholder graph">
        <rect x="1" y="1" width="638" height="278" rx="12" className="placeholder-frame" />
        <line x1="48" y1="36" x2="48" y2="236" className="placeholder-axis" />
        <line x1="48" y1="236" x2="600" y2="236" className="placeholder-axis" />
        <path d="M48 200 C 140 190, 180 80, 280 120 S 460 40, 600 70" className="placeholder-curve" />
        <circle cx="280" cy="120" r="5" className="placeholder-dot" />
      </svg>
      <p>
        The {title} simulation is not drawn yet. The quiz for this topic is ready
        on the other tab.
      </p>
    </section>
  )
}

function WorkspaceFrame() {
  const { theme, toggle } = useTheme()
  const { slug: routeSlug } = useParams()
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  const slug = pathname.startsWith('/topic/')
    ? routeSlug
      ? simulationSlugToLearn[routeSlug]
      : undefined
    : routeSlug
  const view: View = pathname.startsWith('/topic/')
    ? 'simulation'
    : pathname.startsWith('/quiz/')
      ? 'quiz'
      : params.get('view') === 'quiz'
        ? 'quiz'
        : 'simulation'
  const topic = slug ? getLearnTopic(slug) : undefined

  if (!topic) {
    return <Navigate to="/" replace />
  }

  const tabHref = (next: View) => {
    if (pathname.startsWith('/learn/')) {
      const nextParams = new URLSearchParams(params)
      nextParams.set('view', next)
      return `/learn/${topic.slug}?${nextParams.toString()}`
    }
    return `/learn/${topic.slug}?view=${next}`
  }

  const Simulation = topic.simulation

  return (
    <div className="workspace" data-theme={theme}>
      <aside className="workspace-side">
        <Link to="/" className="workspace-brand">
          Calculus Lab
        </Link>
        <p className="workspace-side-label">Topics</p>
        <nav className="workspace-topics" aria-label="Topics">
          {learnTopics.map((item) => (
            <Link
              key={item.id}
              to={`/learn/${item.slug}?view=${view}`}
              className={item.slug === topic.slug ? 'is-active' : ''}
            >
              <span>{item.order}</span>
              {item.title}
            </Link>
          ))}
        </nav>
        <button type="button" className="theme-toggle" onClick={toggle}>
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
      </aside>
      <main className="workspace-main">
        <header className="workspace-title">
          <p>
            {topic.order} / Calculus BC
          </p>
          <h1>{topic.title}</h1>
        </header>
        <div className="view-tabs" role="tablist">
          <Link
            to={tabHref('simulation')}
            role="tab"
            aria-selected={view === 'simulation'}
            className={view === 'simulation' ? 'is-active' : ''}
          >
            Simulation
          </Link>
          <Link
            to={tabHref('quiz')}
            role="tab"
            aria-selected={view === 'quiz'}
            className={view === 'quiz' ? 'is-active' : ''}
          >
            Quiz
          </Link>
        </div>
        {view === 'quiz' ? (
          <div className="sim-panel quiz-panel">
            <div className="sim-panel-head">Check-in</div>
            <Quiz key={topic.slug} questions={topic.questions} />
          </div>
        ) : Simulation ? (
          <Suspense fallback={<p className="lesson-placeholder">Loading simulation…</p>}>
            <Simulation />
          </Suspense>
        ) : (
          <SimPlaceholder title={topic.title} />
        )}
      </main>
    </div>
  )
}

export function Workspace() {
  return (
    <ThemeProvider>
      <WorkspaceFrame />
    </ThemeProvider>
  )
}
