import { useEffect, useState } from 'react'

export const MAX_STAT_VALUE = 255

export const useStatBar = ({ value }) => {
  const target = Math.min(100, (value / MAX_STAT_VALUE) * 100)
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setPercentage(target))
    return () => cancelAnimationFrame(frame)
  }, [target])

  return { percentage }
}
