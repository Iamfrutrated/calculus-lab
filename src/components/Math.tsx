import katex from 'katex'
import 'katex/dist/katex.min.css'

type MathTexProps = {
  expr: string
  display?: boolean
}

export function MathTex({ expr, display = false }: MathTexProps) {
  const html = katex.renderToString(expr, {
    throwOnError: false,
    displayMode: display,
  })

  if (display) {
    return <div className="math-block" dangerouslySetInnerHTML={{ __html: html }} />
  }

  return <span className="math-inline" dangerouslySetInnerHTML={{ __html: html }} />
}
