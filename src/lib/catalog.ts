export type PlotView = {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

export type CatalogFn = {
  id: string
  label: string
  expr: string
  fn: (x: number) => number | null
  dfn?: (x: number) => number | null
  dLabel?: string
  defaultX?: number
  view: PlotView
  areaFrom?: number
  areaTo?: number
  recoverFrom?: number
  recoverTo?: number
  recoverView?: PlotView
}

function finite(y: number): number | null {
  return Number.isFinite(y) ? y : null
}

export const derivativeFunctions: CatalogFn[] = [
  {
    id: 'x2',
    label: 'x²',
    expr: 'x^2',
    fn: (x) => x * x,
    dfn: (x) => 2 * x,
    dLabel: '2x',
    defaultX: 1,
    view: { xMin: -4, xMax: 4, yMin: -1, yMax: 10 },
    recoverFrom: 0,
    recoverTo: 2.4,
    recoverView: { xMin: -0.4, xMax: 3, yMin: -0.6, yMax: 7 },
  },
  {
    id: 'x3',
    label: 'x³',
    expr: 'x^3',
    fn: (x) => x * x * x,
    dfn: (x) => 3 * x * x,
    dLabel: '3x²',
    defaultX: 1,
    view: { xMin: -2.5, xMax: 2.5, yMin: -8, yMax: 8 },
    recoverFrom: 0,
    recoverTo: 1.8,
    recoverView: { xMin: -0.3, xMax: 2.2, yMin: -0.6, yMax: 9 },
  },
  {
    id: 'sin',
    label: 'sin(x)',
    expr: 'sin(x)',
    fn: (x) => Math.sin(x),
    dfn: (x) => Math.cos(x),
    dLabel: 'cos(x)',
    defaultX: 0.8,
    view: { xMin: -6.5, xMax: 6.5, yMin: -2.2, yMax: 2.2 },
    recoverFrom: 0,
    recoverTo: 3.14,
    recoverView: { xMin: -0.4, xMax: 4, yMin: -1.4, yMax: 1.4 },
  },
  {
    id: 'cos',
    label: 'cos(x)',
    expr: 'cos(x)',
    fn: (x) => Math.cos(x),
    dfn: (x) => -Math.sin(x),
    dLabel: '−sin(x)',
    defaultX: 0.6,
    view: { xMin: -6.5, xMax: 6.5, yMin: -2.2, yMax: 2.2 },
    recoverFrom: 0,
    recoverTo: 3.14,
    recoverView: { xMin: -0.4, xMax: 4, yMin: -1.4, yMax: 1.4 },
  },
  {
    id: 'exp',
    label: 'eˣ',
    expr: 'exp(x)',
    fn: (x) => finite(Math.exp(x)),
    dfn: (x) => finite(Math.exp(x)),
    dLabel: 'eˣ',
    defaultX: 0.4,
    view: { xMin: -3, xMax: 2.4, yMin: -0.5, yMax: 8 },
    recoverFrom: 0,
    recoverTo: 1.6,
    recoverView: { xMin: -0.3, xMax: 2, yMin: -0.4, yMax: 7 },
  },
  {
    id: 'ln',
    label: 'ln(x)',
    expr: 'ln(x)',
    fn: (x) => (x > 0 ? finite(Math.log(x)) : null),
    dfn: (x) => (x > 0 ? finite(1 / x) : null),
    dLabel: '1/x',
    defaultX: 1.5,
    view: { xMin: -0.4, xMax: 6, yMin: -3, yMax: 3 },
    recoverFrom: 0.5,
    recoverTo: 3.2,
    recoverView: { xMin: 0.2, xMax: 4, yMin: -1.2, yMax: 1.6 },
  },
  {
    id: 'inv',
    label: '1/x',
    expr: '1/x',
    fn: (x) => (Math.abs(x) < 1e-6 ? null : finite(1 / x)),
    dfn: (x) => (Math.abs(x) < 1e-6 ? null : finite(-1 / (x * x))),
    dLabel: '−1/x²',
    defaultX: 1.2,
    view: { xMin: -4, xMax: 4, yMin: -4, yMax: 4 },
    recoverFrom: 0.6,
    recoverTo: 3,
    recoverView: { xMin: 0.4, xMax: 3.4, yMin: -0.2, yMax: 2.2 },
  },
  {
    id: 'sqrt',
    label: '√x',
    expr: 'sqrt(x)',
    fn: (x) => (x >= 0 ? finite(Math.sqrt(x)) : null),
    dfn: (x) => (x > 0 ? finite(1 / (2 * Math.sqrt(x))) : null),
    dLabel: '1/(2√x)',
    defaultX: 1.2,
    view: { xMin: -0.5, xMax: 8, yMin: -0.5, yMax: 3.5 },
    recoverFrom: 0.25,
    recoverTo: 4,
    recoverView: { xMin: 0, xMax: 4.5, yMin: -0.3, yMax: 2.4 },
  },
  {
    id: 'abs',
    label: '|x|',
    expr: 'abs(x)',
    fn: (x) => Math.abs(x),
    dfn: (x) => (x === 0 ? null : x > 0 ? 1 : -1),
    dLabel: 'sign(x)',
    defaultX: 1,
    view: { xMin: -4, xMax: 4, yMin: -0.5, yMax: 4 },
    recoverFrom: 0,
    recoverTo: 2.5,
    recoverView: { xMin: -0.3, xMax: 3, yMin: -0.3, yMax: 3.2 },
  },
  {
    id: 'cubic',
    label: '0.2x³ − x',
    expr: '0.2x^3 - x',
    fn: (x) => 0.2 * x * x * x - x,
    dfn: (x) => 0.6 * x * x - 1,
    dLabel: '0.6x² − 1',
    defaultX: 1.2,
    view: { xMin: -4, xMax: 4, yMin: -4, yMax: 4 },
    recoverFrom: 0,
    recoverTo: 2,
    recoverView: { xMin: -0.3, xMax: 2.4, yMin: -1.6, yMax: 2.2 },
  },
]

export const ftcFunctions: CatalogFn[] = [
  {
    id: 'quad',
    label: '0.22x² + 0.55',
    expr: '0.22x^2 + 0.55',
    fn: (x) => 0.22 * x * x + 0.55,
    view: { xMin: -0.5, xMax: 5, yMin: -0.4, yMax: 5 },
    areaFrom: 0,
    areaTo: 4,
  },
  {
    id: 'line',
    label: '0.5x + 0.8',
    expr: '0.5x + 0.8',
    fn: (x) => 0.5 * x + 0.8,
    view: { xMin: -0.5, xMax: 5, yMin: -0.4, yMax: 4 },
    areaFrom: 0,
    areaTo: 4,
  },
  {
    id: 'sin-shift',
    label: 'sin(x) + 1.4',
    expr: 'sin(x) + 1.4',
    fn: (x) => Math.sin(x) + 1.4,
    view: { xMin: -0.5, xMax: 7, yMin: -0.4, yMax: 3.2 },
    areaFrom: 0,
    areaTo: 6,
  },
  {
    id: 'cos-shift',
    label: 'cos(x) + 1.5',
    expr: 'cos(x) + 1.5',
    fn: (x) => Math.cos(x) + 1.5,
    view: { xMin: -0.5, xMax: 7, yMin: -0.4, yMax: 3.4 },
    areaFrom: 0,
    areaTo: 6,
  },
  {
    id: 'exp-decay',
    label: 'e^(−x/3)',
    expr: 'exp(-x/3)',
    fn: (x) => finite(Math.exp(-x / 3)),
    view: { xMin: -0.5, xMax: 6, yMin: -0.3, yMax: 1.5 },
    areaFrom: 0,
    areaTo: 5,
  },
  {
    id: 'hill',
    label: '2.2 − 0.12(x−2)²',
    expr: '2.2 - 0.12(x-2)^2',
    fn: (x) => 2.2 - 0.12 * (x - 2) * (x - 2),
    view: { xMin: -0.5, xMax: 5, yMin: -0.3, yMax: 3 },
    areaFrom: 0,
    areaTo: 4,
  },
  {
    id: 'mix',
    label: '0.35x + sin(x) + 1',
    expr: '0.35x + sin(x) + 1',
    fn: (x) => 0.35 * x + Math.sin(x) + 1,
    view: { xMin: -0.5, xMax: 7, yMin: -0.4, yMax: 5 },
    areaFrom: 0,
    areaTo: 6,
  },
]

export type MaclaurinFn = CatalogFn & {
  poly: (x: number, n: number) => number | null
  tex: (n: number) => string
  maxDegree: number
}

function expPoly(x: number, n: number) {
  let sum = 1
  let term = 1
  for (let k = 1; k <= n; k++) {
    term *= x / k
    sum += term
  }
  return finite(sum)
}

function sinPoly(x: number, n: number) {
  let sum = 0
  let term = x
  for (let k = 0; 2 * k + 1 <= n; k++) {
    sum += term
    term *= (-x * x) / ((2 * k + 2) * (2 * k + 3))
  }
  return finite(sum)
}

function cosPoly(x: number, n: number) {
  let sum = 1
  let term = 1
  for (let k = 0; 2 * k + 2 <= n; k++) {
    term *= (-x * x) / ((2 * k + 1) * (2 * k + 2))
    sum += term
  }
  return finite(sum)
}

function geomPoly(x: number, n: number) {
  if (x === 1) return n >= 0 ? finite(n + 1) : 0
  let sum = 0
  let term = 1
  for (let k = 0; k <= n; k++) {
    sum += term
    term *= x
  }
  return finite(sum)
}

function lnPoly(x: number, n: number) {
  let sum = 0
  let term = x
  for (let k = 1; k <= n; k++) {
    sum += term / k
    term *= -x
  }
  return finite(sum)
}

function arctanPoly(x: number, n: number) {
  let sum = 0
  let term = x
  for (let k = 0; 2 * k + 1 <= n; k++) {
    sum += term / (2 * k + 1)
    term *= -x * x
  }
  return finite(sum)
}

function polyTex(terms: string[]) {
  if (terms.length === 0) return '0'
  return terms.join('')
}

export const maclaurinFunctions: MaclaurinFn[] = [
  {
    id: 'exp',
    label: 'eˣ',
    expr: 'exp(x)',
    fn: (x) => finite(Math.exp(x)),
    poly: expPoly,
    tex: (n) => {
      const terms = ['1']
      if (n >= 1) terms.push('+x')
      for (let k = 2; k <= n; k++) terms.push(`+\\dfrac{x^{${k}}}{${k}!}`)
      return polyTex(terms)
    },
    maxDegree: 12,
    view: { xMin: -3.2, xMax: 3.2, yMin: -1, yMax: 8 },
  },
  {
    id: 'sin',
    label: 'sin(x)',
    expr: 'sin(x)',
    fn: (x) => Math.sin(x),
    poly: sinPoly,
    tex: (n) => {
      const terms: string[] = []
      const names = [
        'x',
        '-\\dfrac{x^3}{3!}',
        '+\\dfrac{x^5}{5!}',
        '-\\dfrac{x^7}{7!}',
        '+\\dfrac{x^9}{9!}',
        '-\\dfrac{x^{11}}{11!}',
      ]
      for (let k = 0; 2 * k + 1 <= n && k < names.length; k++) terms.push(names[k])
      return polyTex(terms)
    },
    maxDegree: 11,
    view: { xMin: -8, xMax: 8, yMin: -2.4, yMax: 2.4 },
  },
  {
    id: 'cos',
    label: 'cos(x)',
    expr: 'cos(x)',
    fn: (x) => Math.cos(x),
    poly: cosPoly,
    tex: (n) => {
      const terms = ['1']
      const names = [
        '-\\dfrac{x^2}{2!}',
        '+\\dfrac{x^4}{4!}',
        '-\\dfrac{x^6}{6!}',
        '+\\dfrac{x^8}{8!}',
        '-\\dfrac{x^{10}}{10!}',
        '+\\dfrac{x^{12}}{12!}',
      ]
      for (let k = 0; 2 * k + 2 <= n && k < names.length; k++) terms.push(names[k])
      return polyTex(terms)
    },
    maxDegree: 12,
    view: { xMin: -8, xMax: 8, yMin: -2.4, yMax: 2.4 },
  },
  {
    id: 'geom',
    label: '1/(1−x)',
    expr: '1/(1-x)',
    fn: (x) => (Math.abs(x - 1) < 1e-6 ? null : finite(1 / (1 - x))),
    poly: geomPoly,
    tex: (n) => {
      const terms = ['1']
      if (n >= 1) terms.push('+x')
      for (let k = 2; k <= n; k++) terms.push(`+x^{${k}}`)
      return polyTex(terms)
    },
    maxDegree: 10,
    view: { xMin: -1.6, xMax: 1.6, yMin: -2, yMax: 6 },
  },
  {
    id: 'ln1p',
    label: 'ln(1+x)',
    expr: 'ln(1+x)',
    fn: (x) => (x > -1 ? finite(Math.log(1 + x)) : null),
    poly: lnPoly,
    tex: (n) => {
      if (n < 1) return '0'
      const terms = ['x']
      for (let k = 2; k <= n; k++) {
        terms.push(k % 2 === 0 ? `-\\dfrac{x^{${k}}}{${k}}` : `+\\dfrac{x^{${k}}}{${k}}`)
      }
      return polyTex(terms)
    },
    maxDegree: 10,
    view: { xMin: -1.2, xMax: 2.2, yMin: -2.5, yMax: 1.6 },
  },
  {
    id: 'arctan',
    label: 'arctan(x)',
    expr: 'arctan(x)',
    fn: (x) => Math.atan(x),
    poly: arctanPoly,
    tex: (n) => {
      if (n < 1) return '0'
      const terms = ['x']
      const extras = [
        '-\\dfrac{x^3}{3}',
        '+\\dfrac{x^5}{5}',
        '-\\dfrac{x^7}{7}',
        '+\\dfrac{x^9}{9}',
        '-\\dfrac{x^{11}}{11}',
      ]
      for (let k = 0; 2 * k + 3 <= n && k < extras.length; k++) terms.push(extras[k])
      return polyTex(terms)
    },
    maxDegree: 11,
    view: { xMin: -3, xMax: 3, yMin: -2, yMax: 2 },
  },
]

export type ContinuityFn = CatalogFn & {
  probe: number
  approach: number
  holes?: Array<{ x: number; y: number }>
  filled?: Array<{ x: number; y: number }>
  verticalAsymptotes?: number[]
  breakJump?: number
  kind: 'continuous' | 'jump' | 'hole' | 'infinite'
}

export const continuityFunctions: ContinuityFn[] = [
  {
    id: 'x2',
    label: 'x²',
    expr: 'x^2',
    fn: (x) => x * x,
    probe: 1,
    approach: 2.2,
    kind: 'continuous',
    view: { xMin: -2, xMax: 3.2, yMin: -0.6, yMax: 8 },
  },
  {
    id: 'sin',
    label: 'sin(x)',
    expr: 'sin(x)',
    fn: (x) => Math.sin(x),
    probe: 0,
    approach: 2.4,
    kind: 'continuous',
    view: { xMin: -4, xMax: 4, yMin: -1.8, yMax: 1.8 },
  },
  {
    id: 'abs',
    label: '|x|',
    expr: 'abs(x)',
    fn: (x) => Math.abs(x),
    probe: 0,
    approach: 2.2,
    kind: 'continuous',
    view: { xMin: -3, xMax: 3, yMin: -0.4, yMax: 3.2 },
  },
  {
    id: 'exp',
    label: 'eˣ',
    expr: 'exp(x)',
    fn: (x) => finite(Math.exp(x)),
    probe: 0,
    approach: 1.8,
    kind: 'continuous',
    view: { xMin: -2.4, xMax: 2.4, yMin: -0.4, yMax: 6 },
  },
  {
    id: 'jump',
    label: 'jump',
    expr: 'piecewise',
    fn: (x) => (x < 0 ? -1.15 : 1.35),
    probe: 0,
    approach: 2.2,
    kind: 'jump',
    filled: [{ x: 0, y: 1.35 }],
    holes: [{ x: 0, y: -1.15 }],
    breakJump: 0.18,
    view: { xMin: -3, xMax: 3, yMin: -2.4, yMax: 2.6 },
  },
  {
    id: 'hole',
    label: 'hole',
    expr: '(x^2-1)/(x-1)',
    fn: (x) => (Math.abs(x - 1) < 1e-8 ? null : finite((x * x - 1) / (x - 1))),
    probe: 1,
    approach: 2,
    kind: 'hole',
    holes: [{ x: 1, y: 2 }],
    view: { xMin: -1.5, xMax: 3.2, yMin: -0.6, yMax: 4.2 },
  },
  {
    id: 'moved',
    label: 'moved point',
    expr: 'x, but f(0)=1.8',
    fn: (x) => (Math.abs(x) < 1e-8 ? null : x),
    probe: 0,
    approach: 2.2,
    kind: 'hole',
    holes: [{ x: 0, y: 0 }],
    filled: [{ x: 0, y: 1.8 }],
    view: { xMin: -3, xMax: 3, yMin: -2.2, yMax: 2.6 },
  },
  {
    id: 'inv',
    label: '1/x',
    expr: '1/x',
    fn: (x) => (Math.abs(x) < 1e-6 ? null : finite(1 / x)),
    probe: 0,
    approach: 2,
    kind: 'infinite',
    verticalAsymptotes: [0],
    view: { xMin: -3, xMax: 3, yMin: -4, yMax: 4 },
  },
]
