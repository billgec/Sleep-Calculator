export const CYCLE_MINUTES = 90
export const DEFAULT_FALL_ASLEEP_MINUTES = 15
export const DEFAULT_CYCLE_COUNTS: readonly number[] = [6, 5, 4]

export type SleepMode = 'bedtime' | 'wakeUp'

export interface SleepOptions {
  fallAsleepMinutes?: number
  cycleCounts?: readonly number[]
}

export interface SleepSuggestion {
  time: Date
  cycles: number
  sleepMinutes: number
}

const MINUTE_MS = 60_000

function resolveOptions({
  fallAsleepMinutes = DEFAULT_FALL_ASLEEP_MINUTES,
  cycleCounts = DEFAULT_CYCLE_COUNTS,
}: SleepOptions) {
  if (!Number.isFinite(fallAsleepMinutes) || fallAsleepMinutes < 0) {
    throw new RangeError('fallAsleepMinutes must be a non-negative number')
  }
  if (cycleCounts.some((count) => !Number.isInteger(count) || count < 1)) {
    throw new RangeError('cycleCounts must contain positive integers')
  }
  return { fallAsleepMinutes, cycleCounts }
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * MINUTE_MS)
}

export function bedtimesFor(
  wakeUp: Date,
  options: SleepOptions = {},
): SleepSuggestion[] {
  const { fallAsleepMinutes, cycleCounts } = resolveOptions(options)
  return cycleCounts.map((cycles) => {
    const sleepMinutes = cycles * CYCLE_MINUTES
    return {
      time: addMinutes(wakeUp, -(sleepMinutes + fallAsleepMinutes)),
      cycles,
      sleepMinutes,
    }
  })
}

export function wakeUpTimesFrom(
  bedtime: Date,
  options: SleepOptions = {},
): SleepSuggestion[] {
  const { fallAsleepMinutes, cycleCounts } = resolveOptions(options)
  return cycleCounts.map((cycles) => {
    const sleepMinutes = cycles * CYCLE_MINUTES
    return {
      time: addMinutes(bedtime, sleepMinutes + fallAsleepMinutes),
      cycles,
      sleepMinutes,
    }
  })
}

export function calculateSleep(
  mode: SleepMode,
  reference: Date,
  options: SleepOptions = {},
): SleepSuggestion[] {
  return mode === 'bedtime'
    ? bedtimesFor(reference, options)
    : wakeUpTimesFrom(reference, options)
}

export function nextOccurrence(hours: number, minutes: number, now: Date): Date {
  if (
    !Number.isInteger(hours) || hours < 0 || hours > 23 ||
    !Number.isInteger(minutes) || minutes < 0 || minutes > 59
  ) {
    throw new RangeError('Invalid time of day')
  }
  const candidate = new Date(now)
  candidate.setHours(hours, minutes, 0, 0)
  if (candidate.getTime() <= now.getTime()) {
    candidate.setDate(candidate.getDate() + 1)
  }
  return candidate
}
