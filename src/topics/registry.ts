import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

export type TopicPage = LazyExoticComponent<ComponentType>

export type Topic = {
  id: string
  slug: string
  title: string
  summary: string
  order: number
  status: 'ready'
  art: '1' | '2' | '3'
  page: TopicPage
}

export const topics: Topic[] = [
  {
    id: 'derivative-as-limit',
    slug: 'derivative-as-limit',
    title: 'The derivative simulation',
    summary:
      'Watch a secant become a tangent as h slides to zero. Pick a function, then zoom and drag the graph.',
    order: 1,
    status: 'ready',
    art: '1',
    page: lazy(() => import('./derivative-as-limit/Page')),
  },
  {
    id: 'integrals-ftc',
    slug: 'integrals-ftc',
    title: 'The FTC simulation',
    summary:
      'dx is the slice width. Shrink it until yellow covers the gray area. Pick a function, then zoom and drag.',
    order: 2,
    status: 'ready',
    art: '2',
    page: lazy(() => import('./integrals-ftc/Page')),
  },
  {
    id: 'connection',
    slug: 'connection',
    title: 'Connecting them',
    summary:
      'Riemann-sum the derivative and watch those totals rebuild the original graph as dx goes to zero.',
    order: 3,
    status: 'ready',
    art: '3',
    page: lazy(() => import('./connection/Page')),
  },
]

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((topic) => topic.slug === slug)
}

export function topicNeighbors(slug: string): { prev?: Topic; next?: Topic } {
  const index = topics.findIndex((topic) => topic.slug === slug)
  if (index === -1) return {}
  return {
    prev: topics[index - 1],
    next: topics[index + 1],
  }
}
