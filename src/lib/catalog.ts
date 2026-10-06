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
