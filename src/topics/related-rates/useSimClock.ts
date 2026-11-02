import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A pausable simulation clock. `t` is simulated seconds; `speed` scales
 * how fast simulated time advances relative to wall time.
 */
export function useSimClock(speed: number, endTime = Infinity) {
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(false)
  const speedRef = useRef(speed)
  speedRef.current = speed

  // Stop the clock once the simulation has run its course.
  useEffect(() => {
    if (playing && t >= endTime) setPlaying(false)
  }, [playing, t, endTime])

  useEffect(() => {
    if (!playing) return
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      setT((prev) => prev + dt * speedRef.current)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing])

  const reset = useCallback(() => {
    setPlaying(false)
    setT(0)
  }, [])

  return { t, playing, setPlaying, reset, setT }
}
