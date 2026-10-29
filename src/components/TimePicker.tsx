import { pad } from '../time.ts'

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5)

export interface TimeOfDay {
  hours: number
  minutes: number
}

interface TimePickerProps {
  label: string
  value: TimeOfDay
  onChange: (value: TimeOfDay) => void
}

export function TimePicker({ label, value, onChange }: TimePickerProps) {
  return (
    <fieldset className="time-picker">
      <legend>{label}</legend>
      <select
        aria-label="Hours"
        value={value.hours}
        onChange={(e) => onChange({ ...value, hours: Number(e.target.value) })}
      >
        {HOURS.map((h) => (
          <option key={h} value={h}>
            {pad(h)}
          </option>
        ))}
      </select>
      <span aria-hidden="true">:</span>
      <select
        aria-label="Minutes"
        value={value.minutes}
        onChange={(e) =>
          onChange({ ...value, minutes: Number(e.target.value) })
        }
      >
        {MINUTES.map((m) => (
          <option key={m} value={m}>
            {pad(m)}
          </option>
        ))}
      </select>
    </fieldset>
  )
}
