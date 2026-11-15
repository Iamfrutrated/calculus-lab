import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import { quizTopics, type QuizTopic } from '../quizzes/catalog'

export type LearnTopic = QuizTopic & {
  simulation: LazyExoticComponent<ComponentType> | null
}

const simulations: Record<string, LazyExoticComponent<ComponentType>> = {
  continuity: lazy(() => import('../topics/continuity/Page')),
  limits: lazy(() => import('../topics/limits/Page')),
  differentiability: lazy(() => import('../topics/differentiability/Page')),
  derivatives: lazy(() => import('../topics/derivative-as-limit/Page')),
  'definite-integrals': lazy(() => import('../topics/integrals-ftc/Page')),
  'indefinite-integrals': lazy(() => import('../topics/connection/Page')),
  'integration-by-parts': lazy(() => import('../topics/integration-by-parts/Page')),
  'rate-in-rate-out': lazy(() => import('../topics/rate-in-out/Page')),
  'rate-of-change': lazy(() => import('../topics/related-rates/Page')),
  'taylor-polynomials': lazy(() => import('../topics/maclaurin/Page')),
  'series-tests': lazy(() => import('../topics/integral-test/Page')),
}

export const learnTopics: LearnTopic[] = quizTopics.map((topic) => ({
  ...topic,
  simulation: simulations[topic.slug] ?? null,
}))

export const simulationSlugToLearn: Record<string, string> = {
  'derivative-as-limit': 'derivatives',
  'integrals-ftc': 'definite-integrals',
  connection: 'indefinite-integrals',
  maclaurin: 'taylor-polynomials',
  continuity: 'continuity',
  'related-rates': 'rate-of-change',
}

export function getLearnTopic(slug: string): LearnTopic | undefined {
  return learnTopics.find((topic) => topic.slug === slug)
}
