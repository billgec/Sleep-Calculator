import { useEffect, useState } from 'react'
import { type Theme, applyTheme, loadTheme } from '../theme.ts'

const THEMES: { value: Theme; label: string }[] = [
  { value: 'night', label: 'Night' },
  { value: 'dusk', label: 'Dusk' },
]

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(loadTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      {THEMES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
        >
          <span className={`theme-swatch theme-swatch-${value}`} aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  )
}
