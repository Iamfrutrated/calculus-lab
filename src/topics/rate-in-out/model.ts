export const T_MIN = 0
export const T_MAX = 12

/** Gallons per hour entering the tank. Ranges from 2 to 10. */
export function rateIn(t: number) {
  return 6 + 4 * Math.sin((Math.PI * t) / 4)
}

/** Gallons per hour leaving the tank. Ranges from 4 to 10. */
export function rateOut(t: number) {
  return 7 + 3 * Math.cos((Math.PI * t) / 6)
}

export const Y_MIN = -6
export const Y_MAX = 12

export function netRate(t: number) {
  return rateIn(t) - rateOut(t)
}

export type Turn = {
  t: number
  curve: 'in' | 'out'
  kind: 'max' | 'min'
  value: number
}

export const turns: Turn[] = [
  { t: 0, curve: 'out', kind: 'max', value: rateOut(0) },
  { t: 2, curve: 'in', kind: 'max', value: rateIn(2) },
  { t: 6, curve: 'in', kind: 'min', value: rateIn(6) },
  { t: 6, curve: 'out', kind: 'min', value: rateOut(6) },
  { t: 10, curve: 'in', kind: 'max', value: rateIn(10) },
  { t: 12, curve: 'out', kind: 'max', value: rateOut(12) },
]

export function fmt(value: number) {
  const fixed = value.toFixed(1)
  return fixed === '-0.0' ? '0.0' : fixed
}
