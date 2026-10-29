import type { SleepSuggestion } from '../sleepCycles.ts'
import { formatDuration, formatTime } from '../time.ts'

interface SuggestionListProps {
  title: string
  suggestions: SleepSuggestion[]
}

export function SuggestionList({ title, suggestions }: SuggestionListProps) {
  return (
    <section className="suggestions" aria-live="polite">
      <h2>{title}</h2>
      <ol>
        {suggestions.map((s, index) => (
          <li key={s.cycles} className={index === 0 ? 'best' : undefined}>
            <time dateTime={s.time.toISOString()}>{formatTime(s.time)}</time>
            <span className="details">
              {s.cycles} cycles · {formatDuration(s.sleepMinutes)} of sleep
            </span>
            {index === 0 && <span className="badge">Recommended</span>}
          </li>
        ))}
      </ol>
    </section>
  )
}
