import { describe, expect, it } from 'vitest'
import {
  bedtimesFor,
  calculateSleep,
  nextOccurrence,
  wakeUpTimesFrom,
} from './sleepCycles.ts'

const at = (day: number, hours: number, minutes = 0) =>
  new Date(2026, 9, day, hours, minutes)

describe('bedtimesFor', () => {
  it('suggests bedtimes for 6, 5 and 4 cycles with a 15 minute buffer', () => {
    const result = bedtimesFor(at(30, 7))
    expect(result.map((s) => s.time)).toEqual([
      at(29, 21, 45),
      at(29, 23, 15),
      at(30, 0, 45),
    ])
    expect(result.map((s) => s.cycles)).toEqual([6, 5, 4])
    expect(result.map((s) => s.sleepMinutes)).toEqual([540, 450, 360])
  })

  it('uses a custom fall-asleep buffer', () => {
    const [first] = bedtimesFor(at(30, 7), { fallAsleepMinutes: 0 })
    expect(first.time).toEqual(at(29, 22))
  })

  it('uses custom cycle counts in the given order', () => {
    const result = bedtimesFor(at(30, 7), { cycleCounts: [3, 1] })
    expect(result.map((s) => s.time)).toEqual([at(30, 2, 15), at(30, 5, 15)])
  })

  it('rejects invalid options', () => {
    expect(() => bedtimesFor(at(30, 7), { fallAsleepMinutes: -1 })).toThrow(
      RangeError,
    )
    expect(() => bedtimesFor(at(30, 7), { cycleCounts: [0] })).toThrow(
      RangeError,
    )
    expect(() => bedtimesFor(at(30, 7), { cycleCounts: [1.5] })).toThrow(
      RangeError,
    )
  })
})

describe('wakeUpTimesFrom', () => {
  it('suggests wake-up times when going to bed now', () => {
    const result = wakeUpTimesFrom(at(29, 22, 30))
    expect(result.map((s) => s.time)).toEqual([
      at(30, 7, 45),
      at(30, 6, 15),
      at(30, 4, 45),
    ])
  })

  it('uses a custom fall-asleep buffer', () => {
    const [first] = wakeUpTimesFrom(at(29, 22, 30), { fallAsleepMinutes: 30 })
    expect(first.time).toEqual(at(30, 8))
  })
})

describe('calculateSleep', () => {
  it('dispatches by mode', () => {
    const reference = at(30, 7)
    expect(calculateSleep('bedtime', reference)).toEqual(bedtimesFor(reference))
    expect(calculateSleep('wakeUp', reference)).toEqual(
      wakeUpTimesFrom(reference),
    )
  })
})

describe('nextOccurrence', () => {
  it('returns today when the time is still ahead', () => {
    expect(nextOccurrence(23, 0, at(29, 22, 30))).toEqual(at(29, 23))
  })

  it('returns tomorrow when the time has passed or is now', () => {
    expect(nextOccurrence(7, 0, at(29, 22, 30))).toEqual(at(30, 7))
    expect(nextOccurrence(22, 30, at(29, 22, 30))).toEqual(at(30, 22, 30))
  })

  it('rejects invalid times', () => {
    expect(() => nextOccurrence(24, 0, at(29, 22))).toThrow(RangeError)
    expect(() => nextOccurrence(7, 60, at(29, 22))).toThrow(RangeError)
  })
})
