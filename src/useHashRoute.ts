import { useSyncExternalStore } from 'react'

export type Route = 'home' | 'legal-notice' | 'privacy'

const routes: Record<string, Route> = {
  '#/legal-notice': 'legal-notice',
  '#/privacy': 'privacy',
}

function subscribe(onChange: () => void) {
  const handler = () => {
    window.scrollTo(0, 0)
    onChange()
  }
  window.addEventListener('hashchange', handler)
  return () => window.removeEventListener('hashchange', handler)
}

export function useHashRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash)
  return routes[hash] ?? 'home'
}
