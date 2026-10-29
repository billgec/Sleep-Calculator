import { useState } from 'react'
import './App.css'
import { ModeToggle } from './components/ModeToggle.tsx'
import { SuggestionList } from './components/SuggestionList.tsx'
import { type TimeOfDay, TimePicker } from './components/TimePicker.tsx'
import {
  DEFAULT_FALL_ASLEEP_MINUTES,
  type SleepMode,
  calculateSleep,
  nextOccurrence,
} from './sleepCycles.ts'
import { formatTime } from './time.ts'
import { useNow } from './useNow.ts'

function App() {
  const [mode, setMode] = useState<SleepMode>('bedtime')
  const [wakeUp, setWakeUp] = useState<TimeOfDay>({ hours: 7, minutes: 0 })
  const now = useNow()

  const reference =
    mode === 'bedtime'
      ? nextOccurrence(wakeUp.hours, wakeUp.minutes, now)
      : now
  const suggestions = calculateSleep(mode, reference)

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

        <SuggestionList
          title={
            mode === 'bedtime' ? 'Go to bed at' : 'Set your alarm for'
          }
          suggestions={suggestions}
        />
      </div>

      <p className="note">
        Includes about {DEFAULT_FALL_ASLEEP_MINUTES} minutes to fall asleep.
      </p>
    </main>
  )
}

export default App
