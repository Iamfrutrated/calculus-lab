const ALLOWED = /^[0-9+\-*/().,x\s^a-z]+$/i

export function compileFunction(input: string): ((x: number) => number) | null {
  const raw = input.trim().toLowerCase()
  if (!raw || !ALLOWED.test(raw)) return null

  let expr = raw.replace(/\^/g, '**')
  expr = expr.replace(/\bln\b/g, 'log')
  expr = expr.replace(/\b(sin|cos|tan|exp|abs|sqrt|log)\b/g, 'Math.$1')
  expr = expr.replace(/\bpi\b/g, 'Math.PI')
  expr = expr.replace(/(?<![.\w])e(?![.\w])/g, 'Math.E')

  try {
    const compiled = new Function('x', `"use strict"; return (${expr});`) as (
      x: number,
    ) => number
    compiled(0.7)
    compiled(1)
    return (x: number) => {
      const y = compiled(x)
      return typeof y === 'number' && Number.isFinite(y) ? y : NaN
    }
  } catch {
    return null
  }
}
