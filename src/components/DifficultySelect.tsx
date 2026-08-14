import type { TaskDifficulty } from '../interfaces/task'
import { DIFFICULTY_LABELS, DIFFICULTY_ORDER } from '../lib/taskMeta'

interface DifficultySelectProps {
  value: TaskDifficulty
  onChange: (difficulty: TaskDifficulty) => void
  /** Kart içinde kullanılırken daha küçük bir ölçek uygulanır. */
  size?: 'sm' | 'md'
}

const ACTIVE_STYLES: Record<TaskDifficulty, string> = {
  easy: 'bg-low/18 text-ink',
  medium: 'bg-medium/22 text-ink',
  hard: 'bg-high/16 text-ink',
}

/** Basit, Orta ve Zor arasında seçim yaptıran segment kontrolü. */
export default function DifficultySelect({
  value,
  onChange,
  size = 'md',
}: DifficultySelectProps) {
  const padding = size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'

  return (
    <div
      role="radiogroup"
      aria-label="Zorluk derecesi"
      className="glass-field inline-flex gap-1 rounded-full p-1"
    >
      {DIFFICULTY_ORDER.map((difficulty) => {
        const isActive = value === difficulty
        return (
          <button
            key={difficulty}
            type="button"
            role="radio"
            aria-checked={isActive}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onChange(difficulty)}
            className={`rounded-full transition duration-200 ${padding} ${
              isActive
                ? `${ACTIVE_STYLES[difficulty]} font-medium shadow-[0_1px_3px_rgb(0_0_0/0.1)]`
                : 'text-muted hover:text-ink'
            }`}
          >
            {DIFFICULTY_LABELS[difficulty]}
          </button>
        )
      })}
    </div>
  )
}
