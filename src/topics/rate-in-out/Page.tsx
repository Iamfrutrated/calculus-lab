import { useState } from 'react'
import { MathTex } from '../../components/Math'
import { SimPanel } from '../../components/SimPanel'
import { Bars, TimeSlider } from './controls'
import { RateChart } from './RateChart'

export default function RateInOutPage() {
  const [t, setT] = useState(3)

  return (
    <div className="lesson-stack">
      <section className="lesson-copy">
        <p>
          Water enters a tank at one rate and leaves at another. Both rates
          depend on the same clock, <MathTex expr="t" />. The net rate is what
          stays:
        </p>
        <MathTex display expr="\frac{dV}{dt}=r_{\text{in}}(t)-r_{\text{out}}(t)" />
        <p>
          <MathTex expr="r_{\text{in}}=6+4\sin(\pi t/4)" /> and{' '}
          <MathTex expr="r_{\text{out}}=7+3\cos(\pi t/6)" />, in gallons per hour.
          The graph stays centered on <MathTex expr="t" />. Drag it to move the clock.
        </p>
      </section>
      <div className="rio-stage">
        <SimPanel label="At this instant">
          <TimeSlider t={t} onChange={setT} />
          <Bars t={t} />
        </SimPanel>
        <SimPanel label="Around this time">
          <RateChart t={t} onPick={setT} />
        </SimPanel>
      </div>
    </div>
  )
}
