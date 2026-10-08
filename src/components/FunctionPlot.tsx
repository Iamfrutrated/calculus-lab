import { useEffect, useId, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

type Point = { x: number; y: number }

export type RiemannRect = {
  x: number
  width: number
  height: number
}

export type PlotView = {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

type FunctionPlotProps = {
  fn: (x: number) => number | null
  xMin?: number
  xMax?: number
  yMin?: number
  yMax?: number
  viewKey?: string
  interactive?: boolean
  highlightX?: number
  holes?: Point[]
  filledPoints?: Point[]
  verticalAsymptotes?: number[]
  showGuides?: boolean
  breakJump?: number
  areaFrom?: number
  areaTo?: number
  coverArea?: boolean
  rectangles?: RiemannRect[]
  overlayFn?: (x: number) => number | null
  overlayPoints?: Point[]
  overlayStep?: boolean
  lineThrough?: { x1: number; y1: number; x2: number; y2: number }
  tangent?: { x: number; y: number; slope: number }
  probeX?: number
  orbs?: Array<{ x: number; y: number; side: 'left' | 'right' }>
}

const WIDTH = 640
const HEIGHT = 400
const PAD = { left: 48, right: 16, top: 16, bottom: 36 }
const PLOT_W = WIDTH - PAD.left - PAD.right
const PLOT_H = HEIGHT - PAD.top - PAD.bottom

function mapX(x: number, xMin: number, xMax: number) {
  return PAD.left + ((x - xMin) / (xMax - xMin)) * PLOT_W
}

function mapY(y: number, yMin: number, yMax: number) {
  return PAD.top + ((yMax - y) / (yMax - yMin)) * PLOT_H
}

function invertX(px: number, xMin: number, xMax: number) {
  return xMin + ((px - PAD.left) / PLOT_W) * (xMax - xMin)
}

function invertY(py: number, yMin: number, yMax: number) {
  return yMax - ((py - PAD.top) / PLOT_H) * (yMax - yMin)
}

function sample(fn: (x: number) => number | null, xMin: number, xMax: number) {
  const n = 560
  const points: Array<Point | null> = []
  for (let i = 0; i <= n; i++) {
    const x = xMin + (i / n) * (xMax - xMin)
    const y = fn(x)
    if (y == null || !Number.isFinite(y)) points.push(null)
    else points.push({ x, y })
  }
  return points
}

function toPaths(
  points: Array<Point | null>,
  view: PlotView,
  breakJump: number,
) {
  const paths: string[] = []
  let current = ''
  let last: Point | null = null
  const jump = (view.yMax - view.yMin) * breakJump

  for (const point of points) {
    if (!point) {
      if (current) paths.push(current)
      current = ''
      last = null
      continue
    }
    if (last && Math.abs(point.y - last.y) > jump) {
      if (current) paths.push(current)
      current = ''
      last = null
    }
    const sx = mapX(point.x, view.xMin, view.xMax)
    const sy = mapY(point.y, view.yMin, view.yMax)
    current += current ? ` L ${sx} ${sy}` : `M ${sx} ${sy}`
    last = point
  }
  if (current) paths.push(current)
  return paths
}

function areaPath(
  fn: (x: number) => number | null,
  from: number,
  to: number,
  view: PlotView,
) {
  const n = 240
  const yAxis = mapY(0, view.yMin, view.yMax)
  const start = Math.max(from, view.xMin)
  const end = Math.min(to, view.xMax)
  if (end <= start) return ''
  let d = `M ${mapX(start, view.xMin, view.xMax)} ${yAxis}`
  for (let i = 0; i <= n; i++) {
    const x = start + (i / n) * (end - start)
    const y = fn(x)
    if (y == null || !Number.isFinite(y)) continue
    d += ` L ${mapX(x, view.xMin, view.xMax)} ${mapY(y, view.yMin, view.yMax)}`
  }
  d += ` L ${mapX(end, view.xMin, view.xMax)} ${yAxis} Z`
  return d
}

function extendLine(
  x1: number,
  y1: number,
  slope: number,
  view: PlotView,
) {
  return {
    x1: view.xMin,
    y1: y1 + slope * (view.xMin - x1),
    x2: view.xMax,
    y2: y1 + slope * (view.xMax - x1),
  }
}

function niceStep(span: number, target = 6) {
  const raw = span / target
  const mag = 10 ** Math.floor(Math.log10(Math.max(raw, 1e-12)))
  const residual = raw / mag
  if (residual >= 5) return 5 * mag
  if (residual >= 2) return 2 * mag
  return mag
}

function ticks(min: number, max: number) {
  const step = niceStep(max - min)
  const start = Math.ceil(min / step) * step
  const values: number[] = []
  for (let t = start; t <= max + step * 0.001; t += step) {
    values.push(Number(t.toPrecision(8)))
  }
  return { values, step }
}

function formatTick(value: number, step: number) {
  const abs = Math.abs(value)
  if (abs < 1e-10) return '0'
  if (abs < 0.001) return value.toExponential(1)
  const digits = Math.max(0, -Math.floor(Math.log10(step)) + 1)
  return value.toFixed(Math.min(digits, 4)).replace(/\.?0+$/, '') || '0'
}

function overlayPolyline(
  points: Point[],
  view: PlotView,
  step: boolean,
) {
  if (points.length === 0) return ''
  const first = points[0]
  let d = `M ${mapX(first.x, view.xMin, view.xMax)} ${mapY(first.y, view.yMin, view.yMax)}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const point = points[i]
    if (step) {
      d += ` L ${mapX(point.x, view.xMin, view.xMax)} ${mapY(prev.y, view.yMin, view.yMax)}`
    }
    d += ` L ${mapX(point.x, view.xMin, view.xMax)} ${mapY(point.y, view.yMin, view.yMax)}`
  }
  return d
}

export function FunctionPlot({
  fn,
  xMin = -6,
  xMax = 6,
  yMin = -3,
  yMax = 3,
  viewKey,
  interactive = true,
  highlightX,
  holes = [],
  filledPoints = [],
  verticalAsymptotes = [],
  showGuides = false,
  breakJump = 0.85,
  areaFrom,
  areaTo,
  coverArea = false,
  rectangles = [],
  overlayFn,
  overlayPoints = [],
  overlayStep = true,
  lineThrough,
  tangent,
  probeX,
  orbs = [],
}: FunctionPlotProps) {
  const rawId = useId()
  const clipId = `plot-clip-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`
  const svgRef = useRef<SVGSVGElement>(null)
  const defaults = useRef<PlotView>({ xMin, xMax, yMin, yMax })
  const [view, setView] = useState<PlotView>({ xMin, xMax, yMin, yMax })
  const drag = useRef<{ x: number; y: number; view: PlotView } | null>(null)
  const [grabbing, setGrabbing] = useState(false)

  useEffect(() => {
    const next = { xMin, xMax, yMin, yMax }
    defaults.current = next
    setView(next)
  }, [viewKey, xMin, xMax, yMin, yMax])

  useEffect(() => {
    const node = svgRef.current
    if (!node || !interactive) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = node.getBoundingClientRect()
      const px = ((event.clientX - rect.left) / rect.width) * WIDTH
      const py = ((event.clientY - rect.top) / rect.height) * HEIGHT
      setView((prev) => {
        const wx = invertX(px, prev.xMin, prev.xMax)
        const wy = invertY(py, prev.yMin, prev.yMax)
        const factor = event.deltaY > 0 ? 1.12 : 1 / 1.12
        const xSpan = (prev.xMax - prev.xMin) * factor
        const ySpan = (prev.yMax - prev.yMin) * factor
        if (xSpan < 0.08 || xSpan > 200 || ySpan < 0.08 || ySpan > 200) return prev
        return {
          xMin: wx - ((wx - prev.xMin) / (prev.xMax - prev.xMin)) * xSpan,
          xMax: wx + ((prev.xMax - wx) / (prev.xMax - prev.xMin)) * xSpan,
          yMin: wy - ((wy - prev.yMin) / (prev.yMax - prev.yMin)) * ySpan,
          yMax: wy + ((prev.yMax - wy) / (prev.yMax - prev.yMin)) * ySpan,
        }
      })
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [interactive])

  function pointerToSvg(event: ReactPointerEvent<SVGSVGElement>) {
    const node = svgRef.current
    if (!node) return { px: 0, py: 0 }
    const rect = node.getBoundingClientRect()
    return {
      px: ((event.clientX - rect.left) / rect.width) * WIDTH,
      py: ((event.clientY - rect.top) / rect.height) * HEIGHT,
    }
  }

  function onPointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    if (!interactive || event.button !== 0) return
    const { px, py } = pointerToSvg(event)
    drag.current = { x: px, y: py, view }
    setGrabbing(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    if (!drag.current) return
    const { px, py } = pointerToSvg(event)
    const start = drag.current
    const dx = invertX(px, start.view.xMin, start.view.xMax) - invertX(start.x, start.view.xMin, start.view.xMax)
    const dy = invertY(py, start.view.yMin, start.view.yMax) - invertY(start.y, start.view.yMin, start.view.yMax)
    setView({
      xMin: start.view.xMin - dx,
      xMax: start.view.xMax - dx,
      yMin: start.view.yMin - dy,
      yMax: start.view.yMax - dy,
    })
  }

  function onPointerUp(event: ReactPointerEvent<SVGSVGElement>) {
    drag.current = null
    setGrabbing(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const points = sample(fn, view.xMin, view.xMax)
  const paths = toPaths(points, view, breakJump)
  const x0 = mapX(0, view.xMin, view.xMax)
  const y0 = mapY(0, view.yMin, view.yMax)
  const highlightY = highlightX == null ? null : fn(highlightX)
  const highlightValid =
    highlightX != null && highlightY != null && Number.isFinite(highlightY)
  const xTicks = ticks(view.xMin, view.xMax)
  const yTicks = ticks(view.yMin, view.yMax)

  const plotLine = lineThrough
    ? extendLine(
        lineThrough.x1,
        lineThrough.y1,
        (lineThrough.y2 - lineThrough.y1) / (lineThrough.x2 - lineThrough.x1),
        view,
      )
    : null
  const plotTangent = tangent
    ? extendLine(tangent.x, tangent.y, tangent.slope, view)
    : null
  const overlaySample = overlayFn
    ? toPaths(sample(overlayFn, view.xMin, view.xMax), view, breakJump)
    : []
  const overlayPoly = overlayPolyline(overlayPoints, view, overlayStep)

  return (
    <div className="plot-wrap">
      <svg
        ref={svgRef}
        className={`function-plot${interactive ? ' is-interactive' : ''}${grabbing ? ' is-grabbing' : ''}`}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Function graph. Scroll to zoom, drag to pan."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={PAD.left} y={PAD.top} width={PLOT_W} height={PLOT_H} />
          </clipPath>
        </defs>
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} className="plot-bg" />
        <g clipPath={`url(#${clipId})`}>
          {xTicks.values.map((t) => (
            <line
              key={`vx-${t}`}
              x1={mapX(t, view.xMin, view.xMax)}
              x2={mapX(t, view.xMin, view.xMax)}
              y1={PAD.top}
              y2={PAD.top + PLOT_H}
              className="plot-grid"
            />
          ))}
          {yTicks.values.map((t) => (
            <line
              key={`hy-${t}`}
              x1={PAD.left}
              x2={PAD.left + PLOT_W}
              y1={mapY(t, view.yMin, view.yMax)}
              y2={mapY(t, view.yMin, view.yMax)}
              className="plot-grid"
            />
          ))}
          {areaFrom != null && areaTo != null && (
            <path
              d={areaPath(fn, areaFrom, areaTo, view)}
              className="plot-area-gray"
            />
          )}
          {coverArea && areaFrom != null && areaTo != null && (
            <path
              d={areaPath(fn, areaFrom, areaTo, view)}
              className="plot-area-yellow"
            />
          )}
          {rectangles.map((rect, index) => {
            const left = mapX(rect.x, view.xMin, view.xMax)
            const right = mapX(rect.x + rect.width, view.xMin, view.xMax)
            const top = mapY(Math.max(rect.height, 0), view.yMin, view.yMax)
            const bottom = mapY(Math.min(rect.height, 0), view.yMin, view.yMax)
            return (
              <rect
                key={`r-${index}`}
                x={left}
                y={top}
                width={Math.max(right - left, 0.6)}
                height={Math.max(bottom - top, 0)}
                className="plot-riemann"
              />
            )
          })}
          <line x1={PAD.left} x2={PAD.left + PLOT_W} y1={y0} y2={y0} className="plot-axis" />
          <line x1={x0} x2={x0} y1={PAD.top} y2={PAD.top + PLOT_H} className="plot-axis" />
          {verticalAsymptotes.map((x) => (
            <line
              key={`asym-${x}`}
              x1={mapX(x, view.xMin, view.xMax)}
              x2={mapX(x, view.xMin, view.xMax)}
              y1={PAD.top}
              y2={PAD.top + PLOT_H}
              className="plot-asymptote"
            />
          ))}
          {plotLine && Number.isFinite(plotLine.y1) && Number.isFinite(plotLine.y2) && (
            <line
              x1={mapX(plotLine.x1, view.xMin, view.xMax)}
              y1={mapY(plotLine.y1, view.yMin, view.yMax)}
              x2={mapX(plotLine.x2, view.xMin, view.xMax)}
              y2={mapY(plotLine.y2, view.yMin, view.yMax)}
              className="plot-secant"
            />
          )}
          {plotTangent && (
            <line
              x1={mapX(plotTangent.x1, view.xMin, view.xMax)}
              y1={mapY(plotTangent.y1, view.yMin, view.yMax)}
              x2={mapX(plotTangent.x2, view.xMin, view.xMax)}
              y2={mapY(plotTangent.y2, view.yMin, view.yMax)}
              className="plot-tangent"
            />
          )}
          {paths.map((d, i) => (
            <path key={i} d={d} className="plot-curve" />
          ))}
          {overlaySample.map((d, i) => (
            <path key={`ov-${i}`} d={d} className="plot-overlay" />
          ))}
          {overlayPoly ? <path d={overlayPoly} className="plot-overlay" /> : null}
          {showGuides && highlightValid && highlightX != null && highlightY != null && (
            <>
              <line
                x1={mapX(highlightX, view.xMin, view.xMax)}
                x2={mapX(highlightX, view.xMin, view.xMax)}
                y1={mapY(highlightY, view.yMin, view.yMax)}
                y2={y0}
                className="plot-guide"
              />
              <line
                x1={mapX(highlightX, view.xMin, view.xMax)}
                x2={x0}
                y1={mapY(highlightY, view.yMin, view.yMax)}
                y2={mapY(highlightY, view.yMin, view.yMax)}
                className="plot-guide"
              />
            </>
          )}
          {highlightValid && highlightX != null && highlightY != null && (
            <circle
              cx={mapX(highlightX, view.xMin, view.xMax)}
              cy={mapY(highlightY, view.yMin, view.yMax)}
              r="5"
              className="plot-point"
            />
          )}
          {holes.map((hole) => (
            <circle
              key={`hole-${hole.x}-${hole.y}`}
              cx={mapX(hole.x, view.xMin, view.xMax)}
              cy={mapY(hole.y, view.yMin, view.yMax)}
              r="5"
              className="plot-hole"
            />
          ))}
          {filledPoints.map((point) => (
            <circle
              key={`fill-${point.x}-${point.y}`}
              cx={mapX(point.x, view.xMin, view.xMax)}
              cy={mapY(point.y, view.yMin, view.yMax)}
              r="5.5"
              className="plot-point"
            />
          ))}
          {probeX != null && Number.isFinite(probeX) ? (
            <line
              x1={mapX(probeX, view.xMin, view.xMax)}
              x2={mapX(probeX, view.xMin, view.xMax)}
              y1={PAD.top}
              y2={PAD.top + PLOT_H}
              className="plot-probe"
            />
          ) : null}
          {orbs.map((orb) => (
            <circle
              key={`orb-${orb.side}`}
              cx={mapX(orb.x, view.xMin, view.xMax)}
              cy={mapY(orb.y, view.yMin, view.yMax)}
              r="7"
              className={orb.side === 'left' ? 'plot-orb-left' : 'plot-orb-right'}
            />
          ))}
        </g>
        {xTicks.values.map((t) => (
          <text
            key={`xt-${t}`}
            x={mapX(t, view.xMin, view.xMax)}
            y={HEIGHT - 12}
            className="plot-label"
          >
            {formatTick(t, xTicks.step)}
          </text>
        ))}
        {yTicks.values.map((t) => (
          <text
            key={`yt-${t}`}
            x={PAD.left - 8}
            y={mapY(t, view.yMin, view.yMax) + 4}
            className="plot-label plot-label-y"
          >
            {formatTick(t, yTicks.step)}
          </text>
        ))}
      </svg>
      {interactive ? (
        <div className="plot-tools">
          <span>Scroll to zoom · drag to pan</span>
          <button type="button" onClick={() => setView(defaults.current)}>
            Reset view
          </button>
        </div>
      ) : null}
    </div>
  )
}
