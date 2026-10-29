import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { pad } from '../time.ts'
import { WheelPicker } from './WheelPicker.tsx'

const VALUES = [0, 5, 10, 15, 20]

const renderWheel = (value: number, onChange = vi.fn()) => {
  render(
    <WheelPicker
      label="Minutes"
      values={VALUES}
      value={value}
      onChange={onChange}
      format={pad}
    />,
  )
  return { onChange, wheel: screen.getByRole('spinbutton', { name: 'Minutes' }) }
}

describe('WheelPicker', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('exposes the current value to assistive technology', () => {
    const { wheel } = renderWheel(10)
    expect(wheel.getAttribute('aria-valuenow')).toBe('10')
    expect(wheel.getAttribute('aria-valuetext')).toBe('10')
  })

  it('scrolls to the selected value', () => {
    const { wheel } = renderWheel(15)
    expect(wheel.scrollTop).toBe(3 * 44)
  })

  it('changes the value with the keyboard and stops at the ends', () => {
    const { onChange, wheel } = renderWheel(0)
    fireEvent.keyDown(wheel, { key: 'ArrowDown' })
    expect(onChange).toHaveBeenLastCalledWith(5)
    fireEvent.keyDown(wheel, { key: 'ArrowUp' })
    expect(onChange).toHaveBeenLastCalledWith(0)
    fireEvent.keyDown(wheel, { key: 'End' })
    expect(onChange).toHaveBeenLastCalledWith(20)
  })

  it('selects the value the wheel settles on after scrolling', () => {
    vi.useFakeTimers()
    const { onChange, wheel } = renderWheel(0)
    wheel.scrollTop = 2 * 44 + 10
    fireEvent.scroll(wheel)
    expect(onChange).not.toHaveBeenCalled()
    vi.advanceTimersByTime(200)
    expect(onChange).toHaveBeenCalledWith(10)
  })

  it('selects the value the wheel is dragged to with the mouse', () => {
    vi.useFakeTimers()
    const { onChange, wheel } = renderWheel(0)
    const mouse = { pointerId: 1, pointerType: 'mouse', button: 0 }
    fireEvent.pointerDown(wheel, { ...mouse, clientY: 200 })
    vi.advanceTimersByTime(1000)
    fireEvent.pointerMove(wheel, { ...mouse, clientY: 112 })
    vi.advanceTimersByTime(1000)
    fireEvent.pointerUp(wheel, { ...mouse, clientY: 112 })
    expect(wheel.scrollTop).toBe(2 * 44)
    vi.advanceTimersByTime(200)
    expect(onChange).toHaveBeenCalledWith(10)
  })
})
