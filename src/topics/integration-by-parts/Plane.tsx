import type { PointerEvent as ReactPointerEvent } from 'react'
import type { Choice } from './examples'

const WIDTH = 640
const HEIGHT = 460
const PAD = { left: 52, right: 18, top: 16, bottom: 40 }

type Sample = { x: number; u: number; v: number }

type PlaneProps = {
  choice: Choice
  a: number
  b: number
  x: number
  mode: 'puzzle' | 'strips'
  onScrub: (x: number) => void
}

function niceStep(span: number) {
  const raw = span / 4
  const mag = 10 ** Math.floor(Math.log10(Math.max(raw, 1e-9)))
  const residual = raw / mag
  if (residual >= 5) return 5 * mag
  if (residual >= 2) return 2 * mag
  return mag
}

function ticks(min: number, max: number) {
  const step = niceStep(max - min)
  const start = Math.ceil(min / step) * step
  const values: number[] = []
  for (let t = start; t <= max + step * 0.001; t += step) values.push(Number(t.toPrecision(8)))
  return values
}

function tickLabel(value: number) {
  if (Math.abs(value) < 1e-8) return '0'
  return String(Number(value.toPrecision(3)))
}

export function Plane({ choice, a, b, x, mode, onScrub }: PlaneProps) {
  const n = 80
  const samples: Sample[] = []
  for (let i = 0; i <= n; i++) {
    const t = a + ((b - a) * i) / n
    samples.push({ x: t, u: choice.u(t), v: choice.v(t) })
  }
  const us = samples.flatMap((p) => [p.u, 0])
  const vs = samples.flatMap((p) => [p.v, 0])
  const uMin = Math.min(...us)
  const uMax = Math.max(...us)
  const vMin = Math.min(...vs)
  const vMax = Math.max(...vs)
  const uPad = Math.max((uMax - uMin) * 0.12, 0.4)
  const vPad = Math.max((vMax - vMin) * 0.12, 0.4)
  const left = uMin - uPad
  const right = uMax + uPad
  const bottom = vMin - vPad
  const top = vMax + vPad
  const plotW = WIDTH - PAD.left - PAD.right
  const plotH = HEIGHT - PAD.top - PAD.bottom
  const mapX = (u: number) => PAD.left + ((u - left) / (right - left)) * plotW
  const mapY = (v: number) => PAD.top + ((top - v) / (top - bottom)) * plotH

  const first = samples[0]
  const last = samples[samples.length - 1]
  let under = `M ${mapX(first.u)} ${mapY(0)} `
  let beside = `M ${mapX(0)} ${mapY(first.v)} `
  let curve = ''
  samples.forEach((p, i) => {
    const cmd = `${mapX(p.u)} ${mapY(p.v)} `
    under += `L ${cmd}`
    beside += `L ${cmd}`
    curve += `${i === 0 ? 'M' : 'L'} ${cmd}`
  })
  under += `L ${mapX(last.u)} ${mapY(0)} Z`
  beside += `L ${mapX(0)} ${mapY(last.v)} Z`

  const span = Math.max(b - a, 1e-3)
  const dx = span / 18
  const x2 = Math.min(b, x + dx)
  const u0 = choice.u(x)
  const v0 = choice.v(x)
  const du = choice.u(x2) - u0
  const dv = choice.v(x2) - v0
  const strip = (x0: number, y0: number, x1: number, y1: number) => {
    const leftX = mapX(Math.min(x0, x1))
    const rightX = mapX(Math.max(x0, x1))
    const topY = mapY(Math.max(y0, y1))
    const botY = mapY(Math.min(y0, y1))
    return { x: leftX, y: topY, width: Math.max(rightX - leftX, 1.5), height: Math.max(botY - topY, 1.5) }
  }

  const onPointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const px = ((event.clientX - rect.left) / rect.width) * WIDTH
    const py = ((event.clientY - rect.top) / rect.height) * HEIGHT
    let best = samples[0]
    let bestD = Infinity
    for (const p of samples) {
      const d = (mapX(p.u) - px) ** 2 + (mapY(p.v) - py) ** 2
      if (d < bestD) {
        best = p
        bestD = d
      }
    }
    onScrub(best.x)
  }

  const frame = (u: number, v: number) => {
    const x0 = mapX(Math.min(0, u))
    const y0 = mapY(Math.max(0, v))
    return {
      x: x0,
      y: y0,
      width: Math.abs(mapX(u) - mapX(0)),
      height: Math.abs(mapY(v) - mapY(0)),
    }
  }

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="ibp-plane"
      role="img"
      aria-label="u v plane for integration by parts"
      onPointerDown={onPointer}
      onPointerMove={(event) => {
        if (event.buttons === 1) onPointer(event)
      }}
    >
      {ticks(left, right).map((tick) => (
        <g key={`u-${tick}`}>
          <line x1={mapX(tick)} x2={mapX(tick)} y1={PAD.top} y2={HEIGHT - PAD.bottom} className="ibp-grid" />
          <text x={mapX(tick)} y={HEIGHT - 14} className="ibp-tick">
            {tickLabel(tick)}
          </text>
        </g>
      ))}
      {ticks(bottom, top).map((tick) => (
        <g key={`v-${tick}`}>
          <line x1={PAD.left} x2={WIDTH - PAD.right} y1={mapY(tick)} y2={mapY(tick)} className="ibp-grid" />
          <text x={PAD.left - 8} y={mapY(tick) + 4} className="ibp-tick ibp-tick-y">
            {tickLabel(tick)}
          </text>
        </g>
      ))}
      <line x1={PAD.left} x2={WIDTH - PAD.right} y1={mapY(0)} y2={mapY(0)} className="ibp-axis" />
      <line x1={mapX(0)} x2={mapX(0)} y1={PAD.top} y2={HEIGHT - PAD.bottom} className="ibp-axis" />
      <text x={WIDTH - PAD.right} y={mapY(0) - 8} className="ibp-axis-name">
        u
      </text>
      <text x={mapX(0) + 8} y={PAD.top + 12} className="ibp-axis-name">
        v
      </text>
      {(['a', 'b'] as const).map((end) => {
        const box = frame(end === 'a' ? first.u : last.u, end === 'a' ? first.v : last.v)
        return <rect key={end} {...box} className={`ibp-corner is-${end}`} />
      })}
      <path d={under} className={`ibp-region is-blue${mode === 'strips' ? ' is-faded' : ''}`} />
      <path d={beside} className={`ibp-region is-coral${mode === 'strips' ? ' is-faded' : ''}`} />
      {mode === 'strips' ? (
        <>
          <rect {...strip(u0, 0, u0 + du, v0)} className="ibp-strip is-blue" />
          <rect {...strip(0, v0, u0, v0 + dv)} className="ibp-strip is-coral" />
        </>
      ) : null}
      <path d={curve} className="ibp-curve" />
      <circle cx={mapX(first.u)} cy={mapY(first.v)} r={4} className="ibp-end" />
      <circle cx={mapX(last.u)} cy={mapY(last.v)} r={4} className="ibp-end" />
      <circle cx={mapX(u0)} cy={mapY(v0)} r={6} className="ibp-scrub" />
    </svg>
  )
}
