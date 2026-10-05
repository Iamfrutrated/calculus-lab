import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

export type CourseId = '1' | '2' | '3' | '4'
export type TopicStatus = 'ready' | 'coming-soon'
export type TopicPage = LazyExoticComponent<ComponentType>

export type Course = {
  id: CourseId
  title: string
  roman: string
  laterNote?: string
}

export type Topic = {
  id: string
  slug: string
  course: CourseId
  title: string
  cardLabel: string
  summary: string
  order: number
  prerequisites: string[]
  status: TopicStatus
  page?: TopicPage
}

export const courses: Course[] = [
  { id: '1', title: 'Calculus 1', roman: 'I' },
  {
    id: '2',
    title: 'Calculus 2',
    roman: 'II',
    laterNote: 'More topics will be added here.',
  },
  {
    id: '3',
    title: 'Calculus 3',
    roman: 'III',
    laterNote: 'More topics will be added here.',
  },
  {
    id: '4',
    title: 'Calculus 4',
    roman: 'IV',
    laterNote: 'More topics will be added here.',
  },
]

export const topics: Topic[] = [
  {
    id: 'limits-intuition',
    slug: 'limits-intuition',
    course: '1',
    title: 'Limits',
    cardLabel: 'limits',
    summary: 'What nearby outputs settle on, in three pictures: smooth, jump, and hole.',
    order: 1,
    prerequisites: [],
    status: 'ready',
    page: lazy(() => import('./limits-intuition/Page')),
  },
  {
    id: 'one-sided-limits',
    slug: 'one-sided-limits',
    course: '1',
    title: 'One-sided limits',
    cardLabel: 'one-sided limits',
    summary: 'On a jump, the two sides of a point can settle at different heights.',
    order: 2,
    prerequisites: ['limits-intuition'],
    status: 'ready',
    page: lazy(() => import('./one-sided-limits/Page')),
  },
  {
    id: 'continuity',
    slug: 'continuity',
    course: '1',
    title: 'Continuity',
    cardLabel: 'continuity',
    summary: 'A moving point can travel the graph without a sudden break.',
    order: 3,
    prerequisites: ['one-sided-limits'],
    status: 'ready',
    page: lazy(() => import('./continuity/Page')),
  },
  {
    id: 'derivative-as-limit',
    slug: 'derivative-as-limit',
    course: '1',
    title: 'The derivative as a limit',
    cardLabel: 'the derivative as a limit',
    summary: 'The slope formula, with h sliding to zero until the secant becomes a tangent.',
    order: 4,
    prerequisites: ['continuity'],
    status: 'ready',
    page: lazy(() => import('./derivative-as-limit/Page')),
  },
  {
    id: 'integrals-ftc',
    slug: 'integrals-ftc',
    course: '1',
    title: 'The FTC and dx',
    cardLabel: 'the FTC',
    summary: 'dx is the slice width. Shrink it and a Riemann sum fills the area.',
    order: 5,
    prerequisites: ['derivative-as-limit'],
    status: 'ready',
    page: lazy(() => import('./integrals-ftc/Page')),
  },
]

export function getCourse(id: string): Course | undefined {
  return courses.find((course) => course.id === id)
}

export function getTopicsForCourse(courseId: CourseId): Topic[] {
  return topics
    .filter((topic) => topic.course === courseId)
    .sort((a, b) => a.order - b.order)
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((topic) => topic.slug === slug)
}

export function courseBlurb(courseId: CourseId): string {
  const listed = getTopicsForCourse(courseId)
    .map((topic) => topic.cardLabel)
    .join(', ')
  if (listed) return listed
  return getCourse(courseId)?.laterNote ?? 'More topics will be added here.'
}

export function topicNeighbors(slug: string): { prev?: Topic; next?: Topic } {
  const index = topics.findIndex((topic) => topic.slug === slug)
  if (index === -1) return {}
  return {
    prev: topics[index - 1],
    next: topics[index + 1],
  }
}
