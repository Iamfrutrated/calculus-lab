type Point = { x: number; y: number }

export type RiemannRect = {
  x: number
  width: number
  height: number
}

type FunctionPlotProps = {
  fn: (x: number) => number | null
  xMin?: number
  xMax?: number
  yMin?: number
  yMax?: number
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
  lineThrough?: { x1: number; y1: number; x2: number; y2: number }
  tangent?: { x: number; y: number; slope: number }
}

const WIDTH = 640
const HEIGHT = 360
const PAD = { left: 44, right: 16, top: 16, bottom: 36 }

function mapX(x: number, xMin: number, xMax: number) {
  return PAD.left + ((x - xMin) / (xMax - xMin)) * (WIDTH - PAD.left - PAD.right)
}

function mapY(y: number, yMin: number, yMax: number) {
  return PAD.top + ((yMax - y) / (yMax - yMin)) * (HEIGHT - PAD.top - PAD.bottom)
}

function sample(fn: (x: number) => number | null, xMin: number, xMax: number) {
  const n = 480
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
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  breakJump: number,
) {
  const paths: string[] = []
  let current = ''
  let last: Point | null = null
  const jump = (yMax - yMin) * breakJump

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
    const sx = mapX(point.x, xMin, xMax)
    const sy = mapY(point.y, yMin, yMax)
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
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
) {
  const n = 240
  const yAxis = mapY(0, yMin, yMax)
  let d = `M ${mapX(from, xMin, xMax)} ${yAxis}`
  for (let i = 0; i <= n; i++) {
    const x = from + (i / n) * (to - from)
    const y = fn(x)
    if (y == null || !Number.isFinite(y)) continue
    d += ` L ${mapX(x, xMin, xMax)} ${mapY(y, yMin, yMax)}`
  }
  d += ` L ${mapX(to, xMin, xMax)} ${yAxis} Z`
  return d
}

function extendLine(
  x1: number,
  y1: number,
  slope: number,
  xMin: number,
  xMax: number,
) {
  return {
    x1: xMin,
    y1: y1 + slope * (xMin - x1),
    x2: xMax,
    y2: y1 + slope * (xMax - x1),
  }
}

export function FunctionPlot({
  fn,
  xMin = -6,
  xMax = 6,
  yMin = -3,
  yMax = 3,
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
  lineThrough,
  tangent,
}: FunctionPlotProps) {
  const points = sample(fn, xMin, xMax)
  const paths = toPaths(points, xMin, xMax, yMin, yMax, breakJump)
  const x0 = mapX(0, xMin, xMax)
  const y0 = mapY(0, yMin, yMax)
  const highlightY = highlightX == null ? null : fn(highlightX)
  const highlightValid =
    highlightX != null && highlightY != null && Number.isFinite(highlightY)

  const ticks: number[] = []
  for (let t = Math.ceil(xMin); t <= Math.floor(xMax); t++) {
    if (t !== 0) ticks.push(t)
  }
  const yTicks: number[] = []
  for (let t = Math.ceil(yMin); t <= Math.floor(yMax); t++) {
    if (t !== 0) yTicks.push(t)
  }

  const plotLine = lineThrough
    ? extendLine(
        lineThrough.x1,
        lineThrough.y1,
        (lineThrough.y2 - lineThrough.y1) / (lineThrough.x2 - lineThrough.x1),
        xMin,
        xMax,
      )
    : null

  const plotTangent = tangent
    ? extendLine(tangent.x, tangent.y, tangent.slope, xMin, xMax)
    : null

  return (
    <svg
      className="function-plot"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Function graph"
    >
      <rect x="0" y="0" width={WIDTH} height={HEIGHT} className="plot-bg" />
      {ticks.map((t) => (
        <line
          key={`vx-${t}`}
          x1={mapX(t, xMin, xMax)}
          x2={mapX(t, xMin, xMax)}
          y1={PAD.top}
          y2={HEIGHT - PAD.bottom}
          className="plot-grid"
        />
      ))}
      {yTicks.map((t) => (
        <line
          key={`hy-${t}`}
          x1={PAD.left}
          x2={WIDTH - PAD.right}
          y1={mapY(t, yMin, yMax)}
          y2={mapY(t, yMin, yMax)}
          className="plot-grid"
        />
      ))}
      {areaFrom != null && areaTo != null && (
        <path
          d={areaPath(fn, areaFrom, areaTo, xMin, xMax, yMin, yMax)}
          className="plot-area-gray"
        />
      )}
      {coverArea && areaFrom != null && areaTo != null && (
        <path
          d={areaPath(fn, areaFrom, areaTo, xMin, xMax, yMin, yMax)}
          className="plot-area-yellow"
        />
      )}
      {rectangles.map((rect, index) => {
        const left = mapX(rect.x, xMin, xMax)
        const right = mapX(rect.x + rect.width, xMin, xMax)
        const top = mapY(Math.max(rect.height, 0), yMin, yMax)
        const bottom = mapY(Math.min(rect.height, 0), yMin, yMax)
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
      <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y0} y2={y0} className="plot-axis" />
      <line x1={x0} x2={x0} y1={PAD.top} y2={HEIGHT - PAD.bottom} className="plot-axis" />
      {ticks
        .filter((t) => t % 2 === 0)
        .map((t) => (
          <text
            key={`xt-${t}`}
            x={mapX(t, xMin, xMax)}
            y={HEIGHT - 12}
            className="plot-label"
          >
            {t}
          </text>
        ))}
      {yTicks
        .filter((t) => t % 1 === 0)
        .map((t) => (
          <text
            key={`yt-${t}`}
            x={PAD.left - 8}
            y={mapY(t, yMin, yMax) + 4}
            className="plot-label plot-label-y"
          >
            {t}
          </text>
        ))}
      {verticalAsymptotes.map((x) => (
        <line
          key={`asym-${x}`}
          x1={mapX(x, xMin, xMax)}
          x2={mapX(x, xMin, xMax)}
          y1={PAD.top}
          y2={HEIGHT - PAD.bottom}
          className="plot-asymptote"
        />
      ))}
      {plotLine && Number.isFinite(plotLine.y1) && Number.isFinite(plotLine.y2) && (
        <line
          x1={mapX(plotLine.x1, xMin, xMax)}
          y1={mapY(plotLine.y1, yMin, yMax)}
          x2={mapX(plotLine.x2, xMin, xMax)}
          y2={mapY(plotLine.y2, yMin, yMax)}
          className="plot-secant"
        />
      )}
      {plotTangent && (
        <line
          x1={mapX(plotTangent.x1, xMin, xMax)}
          y1={mapY(plotTangent.y1, yMin, yMax)}
          x2={mapX(plotTangent.x2, xMin, xMax)}
          y2={mapY(plotTangent.y2, yMin, yMax)}
          className="plot-tangent"
        />
      )}
      {paths.map((d, i) => (
        <path key={i} d={d} className="plot-curve" />
      ))}
      {showGuides && highlightValid && highlightX != null && highlightY != null && (
        <>
          <line
            x1={mapX(highlightX, xMin, xMax)}
            x2={mapX(highlightX, xMin, xMax)}
            y1={mapY(highlightY, yMin, yMax)}
            y2={y0}
            className="plot-guide"
          />
          <line
            x1={mapX(highlightX, xMin, xMax)}
            x2={x0}
            y1={mapY(highlightY, yMin, yMax)}
            y2={mapY(highlightY, yMin, yMax)}
            className="plot-guide"
          />
        </>
      )}
      {highlightValid && highlightX != null && highlightY != null && (
        <circle
          cx={mapX(highlightX, xMin, xMax)}
          cy={mapY(highlightY, yMin, yMax)}
          r="5"
          className="plot-point"
        />
      )}
      {holes.map((hole) => (
        <circle
          key={`hole-${hole.x}-${hole.y}`}
          cx={mapX(hole.x, xMin, xMax)}
          cy={mapY(hole.y, yMin, yMax)}
          r="5"
          className="plot-hole"
        />
      ))}
      {filledPoints.map((point) => (
        <circle
          key={`fill-${point.x}-${point.y}`}
          cx={mapX(point.x, xMin, xMax)}
          cy={mapY(point.y, yMin, yMax)}
          r="5.5"
          className="plot-point"
        />
      ))}
    </svg>
  )
}
