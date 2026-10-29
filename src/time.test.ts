import { describe, expect, it } from 'vitest'
import { formatDuration, formatTime } from './time.ts'

describe('formatTime', () => {
  it('uses the 24-hour format with leading zeros', () => {
    expect(formatTime(new Date(2026, 9, 30, 7, 5))).toBe('07:05')
    expect(formatTime(new Date(2026, 9, 30, 23, 45))).toBe('23:45')
    expect(formatTime(new Date(2026, 9, 30, 0, 0))).toBe('00:00')
  })
})

describe('formatDuration', () => {
  it('formats whole and partial hours', () => {
    expect(formatDuration(540)).toBe('9 h')
    expect(formatDuration(450)).toBe('7 h 30 min')
  })
})
