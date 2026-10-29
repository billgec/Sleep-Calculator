import {
  type CSSProperties,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react'

const ITEM_HEIGHT = 44
const VISIBLE_ITEMS = 5
const SETTLE_MS = 120

interface WheelPickerProps {
  label: string
  values: readonly number[]
  value: number
  onChange: (value: number) => void
  format: (value: number) => string
}

export function WheelPicker({
  label,
  values,
  value,
  onChange,
  format,
}: WheelPickerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const settleTimer = useRef<number | undefined>(undefined)
  const selectedIndex = Math.max(0, values.indexOf(value))
  const [offset, setOffset] = useState(selectedIndex)

  useEffect(() => {
    const el = ref.current
    if (el && Math.round(el.scrollTop / ITEM_HEIGHT) !== selectedIndex) {
      el.scrollTop = selectedIndex * ITEM_HEIGHT
    }
  }, [selectedIndex])

  useEffect(() => () => clearTimeout(settleTimer.current), [])

  const clampIndex = (index: number) =>
    Math.min(values.length - 1, Math.max(0, index))

  const scrollToIndex = (index: number) => {
    const el = ref.current
    if (!el) return
    const top = clampIndex(index) * ITEM_HEIGHT
    if (typeof el.scrollTo === 'function') {
      el.scrollTo({ top, behavior: 'smooth' })
    } else {
      el.scrollTop = top
    }
  }

  const handleScroll = () => {
    const el = ref.current
    if (!el) return
    setOffset(el.scrollTop / ITEM_HEIGHT)
    clearTimeout(settleTimer.current)
    settleTimer.current = window.setTimeout(() => {
      const next = values[clampIndex(Math.round(el.scrollTop / ITEM_HEIGHT))]
      if (next !== value) onChange(next)
    }, SETTLE_MS)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    const steps: Record<string, number> = {
      ArrowUp: -1,
      ArrowDown: 1,
      PageUp: -5,
      PageDown: 5,
    }
    let next: number | undefined
    if (event.key in steps) next = clampIndex(selectedIndex + steps[event.key])
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = values.length - 1
    if (next === undefined) return
    event.preventDefault()
    onChange(values[next])
  }

  return (
    <div
      className="wheel"
      style={{
        '--item-height': `${ITEM_HEIGHT}px`,
        '--visible-items': VISIBLE_ITEMS,
      } as CSSProperties}
    >
      <div
        ref={ref}
        className="wheel-track"
        role="spinbutton"
        tabIndex={0}
        aria-label={label}
        aria-valuenow={value}
        aria-valuetext={format(value)}
        aria-valuemin={values[0]}
        aria-valuemax={values[values.length - 1]}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
      >
        {values.map((v, index) => {
          const distance = index - offset
          return (
            <div
              key={v}
              className="wheel-item"
              aria-hidden="true"
              data-selected={index === selectedIndex || undefined}
              style={{
                transform: `rotateX(${distance * -18}deg)`,
                opacity: Math.max(0.15, 1 - Math.abs(distance) * 0.3),
              }}
              onClick={() => scrollToIndex(index)}
            >
              {format(v)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
