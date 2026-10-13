import { Navigate, Route, Routes } from 'react-router-dom'
import { Workspace } from './components/Workspace'
import { QuizHomePage } from './pages/QuizHomePage'

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/learn/derivatives?view=simulation" replace />}
      />
      <Route path="/quizzes" element={<QuizHomePage />} />
      <Route path="/learn/:slug" element={<Workspace />} />
      <Route path="/quiz/:slug" element={<Workspace />} />
      <Route path="/topic/:slug" element={<Workspace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
