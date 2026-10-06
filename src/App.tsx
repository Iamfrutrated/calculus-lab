import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { TopicPage } from './pages/TopicPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/topic/:slug" element={<TopicPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
