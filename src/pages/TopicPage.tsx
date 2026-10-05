import { Suspense } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { getTopicBySlug } from '../topics/registry'

export function TopicPage() {
  const { slug } = useParams()
  const topic = slug ? getTopicBySlug(slug) : undefined

  if (!topic || topic.status !== 'ready' || !topic.page) {
    return <Navigate to="/" replace />
  }

  const Page = topic.page
  return (
    <Suspense fallback={<div className="page loading-page">Loading lesson…</div>}>
      <Page />
    </Suspense>
  )
}
