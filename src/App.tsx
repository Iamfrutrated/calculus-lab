import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { QuizHomePage } from './pages/QuizHomePage'
import { QuizTopicPage } from './pages/QuizTopicPage'
import { TopicPage } from './pages/TopicPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quizzes" element={<QuizHomePage />} />
      <Route path="/quiz/:slug" element={<QuizTopicPage />} />
      <Route path="/topic/:slug" element={<TopicPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
