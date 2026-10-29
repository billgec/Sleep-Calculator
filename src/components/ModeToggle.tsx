import type { SleepMode } from '../sleepCycles.ts'

const MODES: { value: SleepMode; label: string }[] = [
  { value: 'bedtime', label: 'When to go to bed' },
  { value: 'wakeUp', label: 'When to wake up' },
]

interface ModeToggleProps {
  mode: SleepMode
  onChange: (mode: SleepMode) => void
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="mode-toggle" role="group" aria-label="Calculation mode">
      {MODES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          aria-pressed={mode === value}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
