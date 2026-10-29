import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App.tsx'

const times = () =>
  within(screen.getByRole('list'))
    .getAllByRole('listitem')
    .map((item) => item.querySelector('time')?.textContent)

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 29, 22, 30))
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('renders the heading', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: 'Sleep Calculator' }),
    ).toBeDefined()
  })

  it('suggests bedtimes for a 07:00 wake-up time by default', () => {
    render(<App />)
    expect(
      screen.getByRole('button', { name: 'When to go to bed' }),
    ).toHaveProperty('ariaPressed', 'true')
    expect(screen.getByRole('heading', { name: 'Go to bed at' })).toBeDefined()
    expect(times()).toEqual(['21:45', '23:15', '00:45'])
  })

  it('updates bedtimes when the wake-up time changes', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Hours'), { target: { value: '6' } })
    fireEvent.change(screen.getByLabelText('Minutes'), {
      target: { value: '30' },
    })
    expect(times()).toEqual(['21:15', '22:45', '00:15'])
  })

  it('suggests wake-up times when going to bed now', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'When to wake up' }))
    expect(screen.getByText('22:30')).toBeDefined()
    expect(
      screen.getByRole('heading', { name: 'Set your alarm for' }),
    ).toBeDefined()
    expect(times()).toEqual(['07:45', '06:15', '04:45'])
    expect(screen.queryByLabelText('Hours')).toBeNull()
  })

  it('marks the 6 and 5 cycle suggestions as recommended', () => {
    render(<App />)
    const [six, five, four] = within(screen.getByRole('list')).getAllByRole(
      'listitem',
    )
    expect(within(six).getByText('Recommended')).toBeDefined()
    expect(within(six).getByText('6 cycles · 9 h of sleep')).toBeDefined()
    expect(within(five).getByText('Recommended')).toBeDefined()
    expect(within(four).queryByText('Recommended')).toBeNull()
  })
})
