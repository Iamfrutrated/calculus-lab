import { Navigate, Route, Routes } from 'react-router-dom'
import { CoursePage } from './pages/CoursePage'
import { HomePage } from './pages/HomePage'
import { TopicPage } from './pages/TopicPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/course/:courseId" element={<CoursePage />} />
      <Route path="/topic/:slug" element={<TopicPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
