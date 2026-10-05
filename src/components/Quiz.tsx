import { useState } from 'react'
import { MathTex } from './Math'

export type QuizQuestion = {
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
  const [answers, setAnswers] = useState<Array<number | null>>(
    () => questions.map(() => null),
  )

  return (
    <section className="quiz">
      <h3>Check your understanding</h3>
      {questions.map((question, qIndex) => {
        const chosen = answers[qIndex]
        const revealed = chosen != null
        return (
          <div key={question.prompt} className="quiz-item">
            <p>
              {qIndex + 1}. {question.prompt}{' '}
              {question.promptMath ? <MathTex expr={question.promptMath} /> : null}
            </p>
            <div className="quiz-options">
              {question.options.map((option, oIndex) => {
                const selected = chosen === oIndex
                const correct = oIndex === question.correctIndex
                const className = [
                  'quiz-option',
                  selected && correct ? 'is-correct' : '',
                  selected && !correct ? 'is-wrong' : '',
                ]
                  .filter(Boolean)
                  .join(' ')
                return (
                  <button
                    key={option}
                    type="button"
                    className={className}
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
    </section>
  )
}
