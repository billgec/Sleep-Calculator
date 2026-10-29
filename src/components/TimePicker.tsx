import { pad } from '../time.ts'
import { WheelPicker } from './WheelPicker.tsx'

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
      <div className="time-picker-wheels">
        <WheelPicker
          label="Hours"
          values={HOURS}
          value={value.hours}
          onChange={(hours) => onChange({ ...value, hours })}
          format={pad}
        />
        <span className="time-picker-colon" aria-hidden="true">
          :
        </span>
        <WheelPicker
          label="Minutes"
          values={MINUTES}
          value={value.minutes}
          onChange={(minutes) => onChange({ ...value, minutes })}
          format={pad}
        />
      </div>
    </fieldset>
  )
}
