import type { TaskStatus } from '../interfaces/task'
import { STATUS_LABELS } from '../lib/taskMeta'

interface StatusChipProps {
  status: TaskStatus
  /** Verilirse etiketin yanında sayaç gösterilir. */
  count?: number
  size?: 'sm' | 'md'
}

const CHIP_STYLES: Record<TaskStatus, string> = {
  todo: 'bg-danger/22 text-danger-ink ring-1 ring-danger/25',
  progress: 'bg-warn/32 text-warn-ink ring-1 ring-warn/35',
  done: 'bg-success/32 text-success-ink ring-1 ring-success/35',
}

const COUNT_STYLES: Record<TaskStatus, string> = {
  todo: 'bg-danger/25',
  progress: 'bg-warn/35',
  done: 'bg-success/35',
}

/** Sütun durumunu renkli bir kutucukla gösterir. */
export default function StatusChip({ status, count, size = 'md' }: StatusChipProps) {
  const scale = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1.5 text-sm'

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-medium ${scale} ${CHIP_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
      {count !== undefined && (
        <span
          className={`rounded-full px-1.5 text-xs tabular-nums ${COUNT_STYLES[status]}`}
        >
          {count}
        </span>
      )}
    </span>
  )
}
