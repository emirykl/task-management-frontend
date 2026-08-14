import type { TaskDifficulty } from '../interfaces/task'
import { DIFFICULTY_LABELS } from '../lib/taskMeta'

interface DifficultyBadgeProps {
  difficulty: TaskDifficulty
}

const DOT_COLORS: Record<TaskDifficulty, string> = {
  hard: 'bg-high',
  medium: 'bg-medium',
  easy: 'bg-low',
}

/** Görevin zorluk derecesini renkli bir nokta ve kısa etiketle gösterir. */
export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span
        aria-hidden="true"
        className={`size-2 rounded-full ${DOT_COLORS[difficulty]}`}
      />
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  )
}
