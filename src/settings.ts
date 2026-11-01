import type { TimeOfDay } from './components/TimePicker.tsx'
import { DEFAULT_FALL_ASLEEP_MINUTES, type SleepMode } from './sleepCycles.ts'

export const STORAGE_KEY = 'sleep-calculator:settings'

export interface Settings {
  mode: SleepMode
  wakeUp: TimeOfDay
  fallAsleepMinutes: number
}

export const DEFAULT_SETTINGS: Settings = {
  mode: 'bedtime',
  wakeUp: { hours: 7, minutes: 0 },
  fallAsleepMinutes: DEFAULT_FALL_ASLEEP_MINUTES,
}

const isStep = (value: unknown, max: number, step: number) =>
  Number.isInteger(value) &&
  (value as number) >= 0 &&
  (value as number) <= max &&
  (value as number) % step === 0

export function loadSettings(): Settings {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    return {
      mode:
        stored.mode === 'bedtime' || stored.mode === 'wakeUp'
          ? stored.mode
          : DEFAULT_SETTINGS.mode,
      wakeUp:
        isStep(stored.wakeUp?.hours, 23, 1) &&
        isStep(stored.wakeUp?.minutes, 55, 5)
          ? { hours: stored.wakeUp.hours, minutes: stored.wakeUp.minutes }
          : DEFAULT_SETTINGS.wakeUp,
      fallAsleepMinutes: isStep(stored.fallAsleepMinutes, 30, 5)
        ? stored.fallAsleepMinutes
        : DEFAULT_SETTINGS.fallAsleepMinutes,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Storage may be full or blocked; the calculator still works without it.
  }
}
