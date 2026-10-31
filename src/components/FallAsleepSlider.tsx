import type { CSSProperties } from 'react'

const MIN = 0
const MAX = 30
const STEP = 5

interface FallAsleepSliderProps {
  value: number
  onChange: (value: number) => void
}

export function FallAsleepSlider({ value, onChange }: FallAsleepSliderProps) {
  const percent = ((value - MIN) / (MAX - MIN)) * 100
  return (
    <div className="fall-asleep">
      <label htmlFor="fall-asleep">
        Time to fall asleep <output htmlFor="fall-asleep">{value} min</output>
      </label>
      <input
        id="fall-asleep"
        type="range"
        min={MIN}
        max={MAX}
        step={STEP}
        value={value}
        aria-valuetext={`${value} minutes`}
        style={{ '--fill': `${percent}%` } as CSSProperties}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}
