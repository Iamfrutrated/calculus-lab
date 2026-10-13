import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import { quizTopics, type QuizTopic } from '../quizzes/catalog'

export type LearnTopic = QuizTopic & {
  simulation: LazyExoticComponent<ComponentType> | null
}

const simulations: Record<string, LazyExoticComponent<ComponentType>> = {
  continuity: lazy(() => import('../topics/continuity/Page')),
  derivatives: lazy(() => import('../topics/derivative-as-limit/Page')),
  'definite-integrals': lazy(() => import('../topics/integrals-ftc/Page')),
  'indefinite-integrals': lazy(() => import('../topics/connection/Page')),
  'taylor-polynomials': lazy(() => import('../topics/maclaurin/Page')),
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
}

export function getLearnTopic(slug: string): LearnTopic | undefined {
  return learnTopics.find((topic) => topic.slug === slug)
}
