import { useState } from 'react'
import { MathTex } from '../../components/Math'
import { SimPanel } from '../../components/SimPanel'
import { EquationNotes, Param, Playback, RateTable, fmt, g } from './shared'
import { useSimClock } from './useSimClock'

const HOLE_RADIUS = 0.02 // m, the drain opening at the cone's apex
const HOLE_AREA = Math.PI * HOLE_RADIUS * HOLE_RADIUS
const CYL_RATIO = 0.6 // cylinder radius as a fraction of the cone radius
const SPEEDS = [1, 5, 20]
const CM = 100 // display lengths in centimeters
const LITERS = 1000 // display volumes in liters

function coneVolume(R: number, H: number, h: number) {
  return (Math.PI * R * R * h ** 3) / (3 * H * H)
}

function heightForVolume(R: number, H: number, V: number) {
  return Math.cbrt((3 * H * H * V) / (Math.PI * R * R))
}

export function ConeToCylinder() {
  const [R, setR] = useState(0.5)
  const [H, setH] = useState(1.0)
  const [fill, setFill] = useState(0.9) // fraction of the cone volume at t = 0
  const [speed, setSpeed] = useState(5)

  const Vcone = coneVolume(R, H, H)
  const V0 = fill * Vcone
  const h0 = heightForVolume(R, H, V0)
  const Rc = CYL_RATIO * R

  // Torricelli: dV/dt = -a sqrt(2 g h), with V = pi R^2 h^3 / (3 H^2),
  // gives dh/dt = -k h^(-3/2) and the closed form h^(5/2) = h0^(5/2) - (5/2) k t.
  const k = (HOLE_AREA * Math.sqrt(2 * g) * H * H) / (Math.PI * R * R)
  const drainTime = h0 > 0 ? (0.4 * h0 ** 2.5) / k : 0
  const clock = useSimClock(speed, drainTime)
  const t = Math.min(clock.t, drainTime)
  const finished = clock.t >= drainTime
  const h = Math.max(0, (Math.max(h0 ** 2.5 - 2.5 * k * t, 0)) ** 0.4)
  const r = (R * h) / H
  const Q = HOLE_AREA * Math.sqrt(2 * g * h) // m^3/s leaving the cone
  const dhdt = h > 0 ? -Q / (Math.PI * r * r) : 0
  const V = coneVolume(R, H, h)
  const y = (V0 - V) / (Math.PI * Rc * Rc)
  const dydt = Q / (Math.PI * Rc * Rc)

  const resetWith = (apply: () => void) => {
    apply()
    clock.reset()
  }

  // Drawing. World units are meters; everything is scaled to fit the view.
  const width = 520
  const height = 440
  const cylHeight = Vcone / (Math.PI * Rc * Rc)
  const gap = 0.3
  const worldH = H + gap + cylHeight * 1.08
  const worldW = 2 * R + 0.5
  const s = Math.min((height - 56) / worldH, (width - 40) / worldW)
  const cx = width / 2
  const coneTop = 34
  const apex = coneTop + H * s
  const cylTop = apex + gap * s
  const cylBottom = cylTop + cylHeight * 1.08 * s
  const waterTop = apex - h * s
  const cylWaterTop = cylBottom - y * s

  return (
    <div className="sim-split">
      <SimPanel>
        <div className="param-grid">
          <Param
            label="cone radius R"
            value={R * CM}
            min={20}
            max={100}
            step={5}
            unit=" cm"
            digits={0}
            onChange={(next) => resetWith(() => setR(next / CM))}
          />
          <Param
            label="cone height H"
            value={H * CM}
            min={50}
            max={200}
            step={5}
            unit=" cm"
            digits={0}
            onChange={(next) => resetWith(() => setH(next / CM))}
          />
          <Param
            label="initial water V₀"
            value={V0 * LITERS}
            min={0}
            max={Vcone * LITERS}
            step={(Vcone * LITERS) / 100}
            unit=" L"
            digits={1}
            onChange={(next) => resetWith(() => setFill(Vcone > 0 ? next / (Vcone * LITERS) : 0))}
          />
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="rr-canvas" role="img" aria-label="Cone draining into a cylinder">
          {h > 0 ? (
            <polygon
              className="rr-water"
              points={`${cx - r * s},${waterTop} ${cx + r * s},${waterTop} ${cx},${apex}`}
            />
          ) : null}
          <polygon
            className="rr-vessel"
            points={`${cx - R * s},${coneTop} ${cx + R * s},${coneTop} ${cx},${apex}`}
          />
          {Q > 0 ? (
            <line
              className="rr-stream"
              x1={cx}
              y1={apex}
              x2={cx}
              y2={cylWaterTop}
              strokeWidth={2 + 60 * Q}
            />
          ) : null}
          {y > 0 ? (
            <rect
              className="rr-water"
              x={cx - Rc * s}
              y={cylWaterTop}
              width={2 * Rc * s}
              height={cylBottom - cylWaterTop}
            />
          ) : null}
          <path
            className="rr-vessel"
            d={`M${cx - Rc * s},${cylTop} V${cylBottom} H${cx + Rc * s} V${cylTop}`}
          />
          <line className="rr-dim" x1={cx - R * s - 14} y1={coneTop} x2={cx - R * s - 14} y2={apex} />
          <text className="rr-label" x={cx - R * s - 20} y={(coneTop + apex) / 2} textAnchor="end">
            H
          </text>
          <line className="rr-dim" x1={cx} y1={coneTop - 10} x2={cx + R * s} y2={coneTop - 10} />
          <text className="rr-label" x={cx + (R * s) / 2} y={coneTop - 14} textAnchor="middle">
            R
          </text>
          {h > 0 ? (
            <>
              <line className="rr-dim rr-dim-live" x1={cx + R * s + 14} y1={waterTop} x2={cx + R * s + 14} y2={apex} />
              <text className="rr-label" x={cx + R * s + 20} y={(waterTop + apex) / 2}>
                h = {fmt(h * CM, 1)} cm
              </text>
            </>
          ) : null}
          {y > 0 ? (
            <>
              <line className="rr-dim rr-dim-live" x1={cx + Rc * s + 14} y1={cylWaterTop} x2={cx + Rc * s + 14} y2={cylBottom} />
              <text className="rr-label" x={cx + Rc * s + 20} y={(cylWaterTop + cylBottom) / 2}>
                y = {fmt(y * CM, 1)} cm
              </text>
            </>
          ) : null}
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
          t = {fmt(t, 1)} s · cone empties at t = {fmt(drainTime, 1)} s · cylinder radius R꜀ = 0.6R ={' '}
          {fmt(Rc * CM, 0)} cm
        </p>
      </SimPanel>
      <EquationNotes>
        <p>Similar triangles tie the water's radius to its depth:</p>
        <MathTex display expr="\frac{r}{h}=\frac{R}{H}\quad\Rightarrow\quad V=\tfrac13\pi r^2h=\frac{\pi R^2}{3H^2}\,h^3" />
        <p>Differentiate with respect to time:</p>
        <MathTex display expr="\frac{dV}{dt}=\frac{\pi R^2}{H^2}\,h^2\,\frac{dh}{dt}=\pi r^2\,\frac{dh}{dt}" />
        <p>
          The draining rate <MathTex expr="dV/dt" /> is calculated here from
          fluid dynamics. In a problem it would typically be given, and the job
          is to relate it to <MathTex expr="dh/dt" /> and <MathTex expr="dy/dt" />.
        </p>
        <MathTex display expr="\frac{dh}{dt}=\frac{1}{\pi r^2}\,\frac{dV}{dt}" />
        <p>Whatever leaves the cone enters the cylinder:</p>
        <MathTex display expr="V_c=\pi R_c^2\,y,\qquad \frac{dV_c}{dt}=\pi R_c^2\frac{dy}{dt}=-\frac{dV}{dt}" />
        <RateTable
          rates={[
            { tex: 'h', value: h * CM, unit: 'cm', note: 'water depth in the cone', digits: 1 },
            { tex: 'r', value: r * CM, unit: 'cm', note: 'radius of the water surface', digits: 1 },
            { tex: '\\tfrac{dV}{dt}', value: -Q * LITERS, unit: 'L/s', note: 'out of the cone (given)', digits: 2 },
            { tex: '\\tfrac{dh}{dt}', value: dhdt * CM, unit: 'cm/s', note: 'cone level falling', digits: 2 },
            { tex: '\\tfrac{dV_c}{dt}', value: Q * LITERS, unit: 'L/s', note: 'into the cylinder', digits: 2 },
            { tex: '\\tfrac{dy}{dt}', value: dydt * CM, unit: 'cm/s', note: 'cylinder level rising', digits: 2 },
          ]}
        />
        <p>
          Watch <MathTex expr="dh/dt" /> grow as the cone empties: the same
          outflow is drawn from a shrinking surface <MathTex expr="\pi r^2" />,
          so the level drops faster even though less water is leaving per
          second. The cylinder's level, with its fixed surface, rises more slowly
          as the stream weakens.
        </p>
      </EquationNotes>
    </div>
  )
}
