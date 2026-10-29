import type { SleepSuggestion } from '../sleepCycles.ts'
import { formatDuration, formatTime } from '../time.ts'

const RECOMMENDED_MIN_CYCLES = 5

interface SuggestionListProps {
  title: string
  suggestions: SleepSuggestion[]
}

export function SuggestionList({ title, suggestions }: SuggestionListProps) {
  return (
    <section className="suggestions" aria-live="polite">
      <h2>{title}</h2>
      <ol>
        {suggestions.map((s) => {
          const recommended = s.cycles >= RECOMMENDED_MIN_CYCLES
          return (
            <li key={s.cycles} className={recommended ? 'best' : undefined}>
              <time dateTime={s.time.toISOString()}>{formatTime(s.time)}</time>
              <span className="details">
                {s.cycles} cycles · {formatDuration(s.sleepMinutes)} of sleep
              </span>
              {recommended && <span className="badge">Recommended</span>}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
