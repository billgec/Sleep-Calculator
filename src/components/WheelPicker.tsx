import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react'

const ITEM_HEIGHT = 44
const VISIBLE_ITEMS = 5
const SETTLE_MS = 120
const DRAG_THRESHOLD_PX = 4
const FLICK_MS = 150
const MAX_VELOCITY = 3

interface DragState {
  startY: number
  startScrollTop: number
  lastY: number
  lastTime: number
  velocity: number
  moved: boolean
}

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
  const [dragging, setDragging] = useState(false)
  const drag = useRef<DragState | null>(null)
  const suppressClick = useRef(false)

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
    if (drag.current) return
    settleTimer.current = window.setTimeout(() => {
      const next = values[clampIndex(Math.round(el.scrollTop / ITEM_HEIGHT))]
      if (next !== value) onChange(next)
    }, SETTLE_MS)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    event.preventDefault()
    const el = event.currentTarget
    el.focus()
    el.setPointerCapture?.(event.pointerId)
    drag.current = {
      startY: event.clientY,
      startScrollTop: el.scrollTop,
      lastY: event.clientY,
      lastTime: event.timeStamp,
      velocity: 0,
      moved: false,
    }
    suppressClick.current = false
    setDragging(true)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current
    if (!state) return
    const dt = event.timeStamp - state.lastTime
    if (dt > 0) {
      const velocity = (event.clientY - state.lastY) / dt
      state.velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity))
    }
    state.lastY = event.clientY
    state.lastTime = event.timeStamp
    const dy = event.clientY - state.startY
    if (Math.abs(dy) > DRAG_THRESHOLD_PX) state.moved = true
    event.currentTarget.scrollTop = state.startScrollTop - dy
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current
    if (!state) return
    drag.current = null
    setDragging(false)
    if (!state.moved) return
    suppressClick.current = true
    const velocity =
      event.timeStamp - state.lastTime > FLICK_MS ? 0 : state.velocity
    const projected = event.currentTarget.scrollTop - velocity * FLICK_MS
    scrollToIndex(Math.round(projected / ITEM_HEIGHT))
    handleScroll()
  }

  const handleItemClick = (index: number) => {
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }
    scrollToIndex(index)
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
        data-dragging={dragging || undefined}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
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
              onClick={() => handleItemClick(index)}
            >
              {format(v)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
