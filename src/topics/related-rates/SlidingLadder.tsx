import { useMemo, useState } from 'react'
import { MathTex } from '../../components/Math'
import { SimPanel } from '../../components/SimPanel'
import { EquationNotes, Param, Playback, RateTable, fmt, g } from './shared'
import { useSimClock } from './useSimClock'

const SPEEDS = [0.1, 0.25, 0.5, 1]
const DT = 0.0005

type Sample = { t: number; theta: number; omega: number }

/**
 * Frictionless ladder whose ends stay on the wall and floor.
 * Energy: (1/6) m L² θ̇² + (1/2) m g L sin θ = const, so θ̈ = -(3g / 2L) cos θ.
 * Integrated with velocity Verlet until the ladder reaches the floor.
 */
function integrate(theta0: number, L: number): Sample[] {
  const accel = (theta: number) => (-(3 * g) / (2 * L)) * Math.cos(theta)
  const out: Sample[] = [{ t: 0, theta: theta0, omega: 0 }]
  let t = 0
  let theta = theta0
  let omega = 0
  let a = accel(theta)
  while (theta > 0 && t < 30) {
    theta += omega * DT + 0.5 * a * DT * DT
    const aNext = accel(Math.max(theta, 0))
    omega += 0.5 * (a + aNext) * DT
    a = aNext
    t += DT
    out.push({ t, theta: Math.max(theta, 0), omega })
  }
  return out
}

function sample(path: Sample[], t: number): Sample {
  const last = path[path.length - 1]
  if (t >= last.t) return last
  const i = Math.min(path.length - 2, Math.max(0, Math.floor(t / DT)))
  const a = path[i]
  const b = path[i + 1]
  const u = (t - a.t) / (b.t - a.t)
  return {
    t,
    theta: a.theta + (b.theta - a.theta) * u,
    omega: a.omega + (b.omega - a.omega) * u,
  }
}

export function SlidingLadder() {
  const [thetaDeg, setThetaDeg] = useState(65)
  const [L, setL] = useState(4)
  const [speed, setSpeed] = useState(0.25)

  const theta0 = (thetaDeg * Math.PI) / 180
  const path = useMemo(() => integrate(theta0, L), [theta0, L])
  const fallTime = path[path.length - 1].t
  const clock = useSimClock(speed, fallTime)
  const { theta, omega } = sample(path, clock.t)
  const finished = clock.t >= fallTime

  const x = L * Math.cos(theta)
  const y = L * Math.sin(theta)
  const dxdt = -L * Math.sin(theta) * omega
  const dydt = L * Math.cos(theta) * omega

  const resetWith = (apply: () => void) => {
    apply()
    clock.reset()
  }

  // Drawing
  const width = 520
  const height = 440
  const wallX = 60
  const floorY = height - 40
  const s = Math.min((width - 120) / L, (height - 80) / L)
  const top = { x: wallX, y: floorY - y * s }
  const bottom = { x: wallX + x * s, y: floorY }
  const ghostTop = { x: wallX, y: floorY - L * Math.sin(theta0) * s }
  const ghostBottom = { x: wallX + L * Math.cos(theta0) * s, y: floorY }
  const arrow = (v: number) => Math.sign(v) * Math.min(Math.abs(v) * 12, 110)
  const showArrows = !finished && clock.t > 0
  const arcR = 46
  const arcEnd = {
    x: bottom.x - arcR * Math.cos(theta),
    y: floorY - arcR * Math.sin(theta),
  }

  return (
    <div className="sim-split">
      <SimPanel>
        <div className="param-grid">
          <Param
            label="initial angle θ₀"
            value={thetaDeg}
            min={20}
            max={85}
            step={1}
            unit="°"
            digits={0}
            onChange={(next) => resetWith(() => setThetaDeg(next))}
          />
          <Param
            label="ladder length L"
            value={L}
            min={2}
            max={6}
            step={0.1}
            unit=" m"
            digits={1}
            onChange={(next) => resetWith(() => setL(next))}
          />
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="rr-canvas" role="img" aria-label="Ladder sliding down a wall">
          <line className="rr-surface" x1={wallX} y1={20} x2={wallX} y2={floorY} />
          <line className="rr-surface" x1={wallX} y1={floorY} x2={width - 20} y2={floorY} />
          <line className="rr-ghost" x1={ghostTop.x} y1={ghostTop.y} x2={ghostBottom.x} y2={ghostBottom.y} />
          {theta > 0.02 ? (
            <path
              className="rr-arc"
              d={`M${bottom.x - arcR},${floorY} A${arcR},${arcR} 0 0 1 ${arcEnd.x},${arcEnd.y}`}
            />
          ) : null}
          <text className="rr-label" x={bottom.x - arcR - 10} y={floorY - 26} textAnchor="end">
            θ = {fmt((theta * 180) / Math.PI, 1)}°
          </text>
          <line className="rr-ladder" x1={top.x} y1={top.y} x2={bottom.x} y2={bottom.y} />
          <circle className="rr-end" cx={top.x} cy={top.y} r={6} />
          <circle className="rr-end" cx={bottom.x} cy={bottom.y} r={6} />
          {showArrows && Math.abs(dydt) > 1e-3 ? (
            <line
              className="rr-arrow"
              x1={top.x + 14}
              y1={top.y}
              x2={top.x + 14}
              y2={top.y - arrow(dydt)}
              markerEnd="url(#rr-arrowhead)"
            />
          ) : null}
          {showArrows && Math.abs(dxdt) > 1e-3 ? (
            <line
              className="rr-arrow"
              x1={bottom.x}
              y1={floorY - 14}
              x2={bottom.x + arrow(dxdt)}
              y2={floorY - 14}
              markerEnd="url(#rr-arrowhead)"
            />
          ) : null}
          <text className="rr-label" x={wallX - 10} y={(top.y + floorY) / 2} textAnchor="end">
            y = {fmt(y, 2)}
          </text>
          <text className="rr-label" x={(wallX + bottom.x) / 2} y={floorY + 24} textAnchor="middle">
            x = {fmt(x, 2)}
          </text>
          <defs>
            <marker id="rr-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" className="rr-arrowhead" />
            </marker>
          </defs>
        </svg>
        <Playback
          playing={clock.playing}
          finished={finished}
          speed={speed}
          speeds={SPEEDS}
          onToggle={() => clock.setPlaying(!clock.playing)}
          onReset={clock.reset}
          onSpeed={setSpeed}
        />
        <p className="compare-readout">
          t = {fmt(Math.min(clock.t, fallTime), 2)} s · reaches the floor at t = {fmt(fallTime, 2)} s ·
          dashed line marks the start
        </p>
      </SimPanel>
      <EquationNotes>
        <p>The ladder's ends are tied together by its fixed length:</p>
        <MathTex display expr="x^2+y^2=L^2,\qquad x=L\cos\theta,\quad y=L\sin\theta" />
        <p>Differentiate each relation with respect to time:</p>
        <MathTex display expr="2x\frac{dx}{dt}+2y\frac{dy}{dt}=0\;\Rightarrow\;\frac{dy}{dt}=-\frac{x}{y}\,\frac{dx}{dt}" />
        <MathTex display expr="\frac{dx}{dt}=-L\sin\theta\,\frac{d\theta}{dt},\qquad \frac{dy}{dt}=L\cos\theta\,\frac{d\theta}{dt}" />
        <p>
          Knowing any one of the three rates at an instant pins down the other
          two. The simulation supplies <MathTex expr="d\theta/dt" /> as the
          ladder slips; the rest follow from the relations above.
        </p>
        <RateTable
          rates={[
            { tex: '\\theta', value: (theta * 180) / Math.PI, unit: '°', note: 'angle with the floor' },
            { tex: '\\tfrac{d\\theta}{dt}', value: omega, unit: 'rad/s', note: `${fmt((omega * 180) / Math.PI, 1)} °/s (given)` },
            { tex: '\\tfrac{dx}{dt}', value: dxdt, unit: 'm/s', note: 'bottom sliding out' },
            { tex: '\\tfrac{dy}{dt}', value: dydt, unit: 'm/s', note: 'top sliding down' },
            { tex: '-\\tfrac{x}{y}\\,\\tfrac{dx}{dt}', value: y > 1e-6 ? -(x / y) * dxdt : dydt, unit: 'm/s', note: 'check: equals dy/dt' },
          ]}
        />
        <p>
          Early on the top barely moves while the bottom kicks out. Near the
          floor the ratio <MathTex expr="x/y" /> grows, so{' '}
          <MathTex expr="dy/dt=-\tfrac{x}{y}\,dx/dt" /> makes the top's speed
          overtake the bottom's.
        </p>
      </EquationNotes>
    </div>
  )
}
