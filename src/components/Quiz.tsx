import { useState } from 'react'
import { MathTex } from './Math'

export type QuizQuestion = {
  id: string
  prompt: string
  promptMath?: string
  options: string[]
  correctIndex: number
  explain: string
}

type QuizProps = {
  questions: QuizQuestion[]
}

export function Quiz({ questions }: QuizProps) {
  const [answers, setAnswers] = useState<Array<number | null>>(() =>
    questions.map(() => null),
  )
  const answered = answers.filter((value) => value != null).length
  const correctCount = questions.reduce((count, question, index) => {
    return count + (answers[index] === question.correctIndex ? 1 : 0)
  }, 0)
  const finished = questions.length > 0 && answered === questions.length

  if (questions.length === 0) {
    return (
      <section className="quiz">
        <p className="lesson-placeholder">Questions for this topic are coming soon.</p>
      </section>
    )
  }

  return (
    <section className="quiz">
      <h3>Check-in</h3>
      {questions.map((question, qIndex) => {
        const chosen = answers[qIndex]
        const revealed = chosen != null
        return (
          <div key={question.id} className="quiz-item">
            <p>
              {qIndex + 1}. {question.prompt}{' '}
              {question.promptMath ? <MathTex expr={question.promptMath} /> : null}
            </p>
            <div className="quiz-options">
              {question.options.map((option, oIndex) => {
                const selected = chosen === oIndex
                const isCorrect = oIndex === question.correctIndex
                const className = [
                  'quiz-option',
                  revealed && isCorrect ? 'is-correct' : '',
                  selected && !isCorrect ? 'is-wrong' : '',
                ]
                  .filter(Boolean)
                  .join(' ')
                return (
                  <button
                    key={`${question.id}-${oIndex}`}
                    type="button"
                    className={className}
                    disabled={revealed}
                    onClick={() => {
                      if (revealed) return
                      setAnswers((prev) => {
                        const next = [...prev]
                        next[qIndex] = oIndex
                        return next
                      })
                    }}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
            {revealed ? <p className="quiz-explain">{question.explain}</p> : null}
          </div>
        )
      })}
      {finished ? (
        <p className="compare-readout">
          {correctCount} of {questions.length} correct
        </p>
      ) : (
        <p className="compare-readout">
          {answered} of {questions.length} answered
        </p>
      )}
      <button
        type="button"
        className="quiz-reset"
        onClick={() => setAnswers(questions.map(() => null))}
      >
        Try again
      </button>
    </section>
  )
}
