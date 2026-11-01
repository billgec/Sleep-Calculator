import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_SETTINGS,
  STORAGE_KEY,
  loadSettings,
  saveSettings,
} from './settings.ts'

describe('settings', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.restoreAllMocks())

  it('returns the defaults when nothing is stored', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
  })

  it('restores saved settings', () => {
    const settings = {
      mode: 'wakeUp' as const,
      wakeUp: { hours: 6, minutes: 45 },
      fallAsleepMinutes: 20,
    }
    saveSettings(settings)
    expect(loadSettings()).toEqual(settings)
  })

  it('replaces invalid values with defaults', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        mode: 'nap',
        wakeUp: { hours: 24, minutes: 7 },
        fallAsleepMinutes: 20,
      }),
    )
    expect(loadSettings()).toEqual({ ...DEFAULT_SETTINGS, fallAsleepMinutes: 20 })
  })

  it('returns the defaults for malformed data', () => {
    localStorage.setItem(STORAGE_KEY, 'not json')
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
  })

  it('works when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(() => saveSettings(DEFAULT_SETTINGS)).not.toThrow()
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
  })
})
