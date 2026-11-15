export type Choice = {
  uTex: string
  dvTex: string
  duTex: string
  vTex: string
  leftoverTex: string
  easy: boolean
  u: (x: number) => number
  v: (x: number) => number
  up: (x: number) => number
  vp: (x: number) => number
}

export type PartsExample = {
  id: string
  label: string
  integralTex: string
  a: number
  b: number
  aMin: number
  aMax: number
  bMin: number
  bMax: number
  good: Choice
  swapped: Choice
}

export const partsExamples: PartsExample[] = [
  {
    id: 'xexp',
    label: 'x e^x',
    integralTex: 'x e^{x}',
    a: 0,
    b: 2,
    aMin: -1,
    aMax: 1.5,
    bMin: 0.5,
    bMax: 3,
    good: {
      uTex: 'x',
      dvTex: 'e^{x}\\,dx',
      duTex: 'dx',
      vTex: 'e^{x}',
      leftoverTex: 'e^{x}',
      easy: true,
      u: (x) => x,
      v: (x) => Math.exp(x),
      up: () => 1,
      vp: (x) => Math.exp(x),
    },
    swapped: {
      uTex: 'e^{x}',
      dvTex: 'x\\,dx',
      duTex: 'e^{x}\\,dx',
      vTex: '\\tfrac{1}{2}x^{2}',
      leftoverTex: '\\tfrac{1}{2}x^{2} e^{x}',
      easy: false,
      u: (x) => Math.exp(x),
      v: (x) => (x * x) / 2,
      up: (x) => Math.exp(x),
      vp: (x) => x,
    },
  },
  {
    id: 'xsin',
    label: 'x sin x',
    integralTex: 'x\\sin x',
    a: 0,
    b: Math.PI,
    aMin: 0,
    aMax: 2,
    bMin: 1,
    bMax: 2 * Math.PI,
    good: {
      uTex: 'x',
      dvTex: '\\sin x\\,dx',
      duTex: 'dx',
      vTex: '-\\cos x',
      leftoverTex: '-\\cos x',
      easy: true,
      u: (x) => x,
      v: (x) => -Math.cos(x),
      up: () => 1,
      vp: (x) => Math.sin(x),
    },
    swapped: {
      uTex: '\\sin x',
      dvTex: 'x\\,dx',
      duTex: '\\cos x\\,dx',
      vTex: '\\tfrac{1}{2}x^{2}',
      leftoverTex: '\\tfrac{1}{2}x^{2}\\cos x',
      easy: false,
      u: (x) => Math.sin(x),
      v: (x) => (x * x) / 2,
      up: (x) => Math.cos(x),
      vp: (x) => x,
    },
  },
  {
    id: 'ln',
    label: 'ln x',
    integralTex: '\\ln x',
    a: 1,
    b: Math.E,
    aMin: 0.4,
    aMax: 2,
    bMin: 1,
    bMax: 4,
    good: {
      uTex: '\\ln x',
      dvTex: 'dx',
      duTex: '\\tfrac{1}{x}\\,dx',
      vTex: 'x',
      leftoverTex: '1',
      easy: true,
      u: (x) => Math.log(x),
      v: (x) => x,
      up: (x) => 1 / x,
      vp: () => 1,
    },
    swapped: {
      uTex: '1',
      dvTex: '\\ln x\\,dx',
      duTex: '0',
      vTex: 'x\\ln x - x',
      leftoverTex: '0',
      easy: false,
      u: () => 1,
      v: (x) => x * Math.log(x) - x,
      up: () => 0,
      vp: (x) => Math.log(x),
    },
  },
  {
    id: 'x2cos',
    label: 'x² cos x',
    integralTex: 'x^{2}\\cos x',
    a: 0,
    b: Math.PI / 2,
    aMin: 0,
    aMax: 1.2,
    bMin: 0.4,
    bMax: Math.PI,
    good: {
      uTex: 'x^{2}',
      dvTex: '\\cos x\\,dx',
      duTex: '2x\\,dx',
      vTex: '\\sin x',
      leftoverTex: '2x\\sin x',
      easy: true,
      u: (x) => x * x,
      v: (x) => Math.sin(x),
      up: (x) => 2 * x,
      vp: (x) => Math.cos(x),
    },
    swapped: {
      uTex: '\\cos x',
      dvTex: 'x^{2}\\,dx',
      duTex: '-\\sin x\\,dx',
      vTex: '\\tfrac{1}{3}x^{3}',
      leftoverTex: '-\\tfrac{1}{3}x^{3}\\sin x',
      easy: false,
      u: (x) => Math.cos(x),
      v: (x) => (x * x * x) / 3,
      up: (x) => -Math.sin(x),
      vp: (x) => x * x,
    },
  },
]

export function integrate(a: number, b: number, fn: (x: number) => number) {
  const n = 240
  const h = (b - a) / n
  let sum = 0
  for (let i = 0; i < n; i++) sum += fn(a + (i + 0.5) * h)
  return sum * h
}

export function fmt(value: number) {
  if (!Number.isFinite(value)) return '—'
  const fixed = value.toFixed(2)
  return fixed === '-0.00' ? '0.00' : fixed
}
