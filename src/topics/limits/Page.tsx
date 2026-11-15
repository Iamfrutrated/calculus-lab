import { MathTex } from '../../components/Math'
import { Approach } from './Approach'

export default function LimitsPage() {
  return (
    <div className="lesson-stack">
      <section className="lesson-copy">
        <p>
          A limit is the height the outputs settle on. A coral point comes in
          from the left and a mint point from the right. The point itself can
          be missing. What matters is whether those two heights meet:
        </p>
        <MathTex display expr="\lim_{x\to c} f(x)=L" />
      </section>
      <Approach />
    </div>
  )
}
