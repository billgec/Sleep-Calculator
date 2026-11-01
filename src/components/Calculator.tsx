import { useEffect, useState } from 'react'
import { APP_NAME, TAGLINE } from '../brand.ts'
import { FallAsleepSlider } from './FallAsleepSlider.tsx'
import { HowItWorks } from './HowItWorks.tsx'
import { Logo } from './Logo.tsx'
import { ModeToggle } from './ModeToggle.tsx'
import { SuggestionList } from './SuggestionList.tsx'
import { type TimeOfDay, TimePicker } from './TimePicker.tsx'
import { loadSettings, saveSettings } from '../settings.ts'
import { type SleepMode, calculateSleep, nextOccurrence } from '../sleepCycles.ts'
import { formatTime } from '../time.ts'
import { useNow } from '../useNow.ts'

export function Calculator() {
  const [initial] = useState(loadSettings)
  const [mode, setMode] = useState<SleepMode>(initial.mode)
  const [wakeUp, setWakeUp] = useState<TimeOfDay>(initial.wakeUp)
  const [fallAsleepMinutes, setFallAsleepMinutes] = useState(
    initial.fallAsleepMinutes,
  )
  const now = useNow()

  useEffect(() => {
    saveSettings({ mode, wakeUp, fallAsleepMinutes })
  }, [mode, wakeUp, fallAsleepMinutes])

  const reference =
    mode === 'bedtime'
      ? nextOccurrence(wakeUp.hours, wakeUp.minutes, now)
      : now
  const suggestions = calculateSleep(mode, reference, { fallAsleepMinutes })

  return (
    <main className="app">
      <header>
        <div className="brand">
          <Logo />
          <div>
            <h1>{APP_NAME}</h1>
            <p className="tagline">{TAGLINE}</p>
          </div>
        </div>
        <p className="intro">
          Wake up between sleep cycles and feel rested.
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
