import { useState } from 'react'
import { FallAsleepSlider } from './FallAsleepSlider.tsx'
import { HowItWorks } from './HowItWorks.tsx'
import { ModeToggle } from './ModeToggle.tsx'
import { SuggestionList } from './SuggestionList.tsx'
import { type TimeOfDay, TimePicker } from './TimePicker.tsx'
import {
  DEFAULT_FALL_ASLEEP_MINUTES,
  type SleepMode,
  calculateSleep,
  nextOccurrence,
} from '../sleepCycles.ts'
import { formatTime } from '../time.ts'
import { useNow } from '../useNow.ts'

export function Calculator() {
  const [mode, setMode] = useState<SleepMode>('bedtime')
  const [wakeUp, setWakeUp] = useState<TimeOfDay>({ hours: 7, minutes: 0 })
  const [fallAsleepMinutes, setFallAsleepMinutes] = useState(
    DEFAULT_FALL_ASLEEP_MINUTES,
  )
  const now = useNow()

  const reference =
    mode === 'bedtime'
      ? nextOccurrence(wakeUp.hours, wakeUp.minutes, now)
      : now
  const suggestions = calculateSleep(mode, reference, { fallAsleepMinutes })

  return (
    <main className="app">
      <header>
        <h1>Sleep Calculator</h1>
        <p className="intro">
          Wake up between 90-minute sleep cycles and feel rested.
        </p>
      </header>

      <ModeToggle mode={mode} onChange={setMode} />

      <div className="card">
        {mode === 'bedtime' ? (
          <TimePicker
            label="I want to wake up at"
            value={wakeUp}
            onChange={setWakeUp}
          />
        ) : (
          <p className="now">
            If you go to bed now at{' '}
            <time dateTime={now.toISOString()}>{formatTime(now)}</time>
          </p>
        )}

        <FallAsleepSlider
          value={fallAsleepMinutes}
          onChange={setFallAsleepMinutes}
        />

        <SuggestionList
          title={
            mode === 'bedtime' ? 'Go to bed at' : 'Set your alarm for'
          }
          suggestions={suggestions}
        />
      </div>

      <p className="note">
        {fallAsleepMinutes === 0
          ? 'No time to fall asleep included.'
          : `Includes about ${fallAsleepMinutes} minutes to fall asleep.`}
      </p>

      <HowItWorks />
    </main>
  )
}
