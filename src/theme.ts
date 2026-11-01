export type Theme = 'night' | 'dusk'

export const THEME_KEY = 'sleep-calculator:theme'

const THEME_COLORS: Record<Theme, string> = {
  night: '#03040f',
  dusk: '#1a1030',
}

export function loadTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === 'dusk' ? 'dusk' : 'night'
  } catch {
    return 'night'
  }
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLORS[theme])
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // Storage may be blocked; the theme still applies for this visit.
  }
}
