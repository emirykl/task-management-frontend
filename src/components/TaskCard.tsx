import { useState, type DragEvent } from 'react'
import type { Task, TaskPatch, TaskStatus } from '../interfaces/task'
import { STATUS_LABELS, STATUS_ORDER } from '../lib/taskMeta'
import DifficultyBadge from './DifficultyBadge'
import IconButton from './IconButton'
import StatusChip from './StatusChip'
import TaskCardEditor from './TaskCardEditor'

interface TaskCardProps {
  task: Task
  variant: 'board' | 'list'
  onMove: (id: string, status: TaskStatus) => void
  onUpdate: (id: string, patch: TaskPatch) => void
  onDelete: (id: string) => void
}

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'short',
})

/** Tek bir görev kartı: sütun değiştirme, düzenlemeye geçme (UPDATE) ve silme (DELETE). */
export default function TaskCard({
  task,
  variant,
  onMove,
  onUpdate,
  onDelete,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)

  const statusIndex = STATUS_ORDER.indexOf(task.status)
  const previousStatus = statusIndex > 0 ? STATUS_ORDER[statusIndex - 1] : null
  const nextStatus =
    statusIndex < STATUS_ORDER.length - 1 ? STATUS_ORDER[statusIndex + 1] : null
  const isDone = task.status === 'done'

  function handleDragStart(event: DragEvent<HTMLElement>) {
    event.dataTransfer.setData('text/plain', task.id)
    event.dataTransfer.effectAllowed = 'move'
  }

  if (isEditing) {
    return (
      <TaskCardEditor
        task={task}
        onSubmit={(patch) => {
          onUpdate(task.id, patch)
          setIsEditing(false)
        }}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <article
      draggable
      onDragStart={handleDragStart}
      className="glass-card group cursor-grab rounded-2xl p-4 transition duration-200 hover:-translate-y-px hover:bg-white/80 active:cursor-grabbing"
    >
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        title="Düzenlemek için tıkla"
        className="block w-full cursor-text text-left"
      >
        <span
          className={`block text-[15px] leading-snug font-semibold break-words ${
            isDone ? 'text-faint line-through' : 'text-ink'
          }`}
        >
          {task.title}
        </span>

        {task.description && (
          <span
            className={`mt-1.5 block text-sm leading-relaxed break-words ${
              isDone ? 'text-faint' : 'text-muted'
            }`}
          >
            {task.description}
          </span>
        )}
      </button>

      <div className="mt-3 flex items-center gap-3">
        <DifficultyBadge difficulty={task.difficulty} />
        {variant === 'list' && <StatusChip status={task.status} size="sm" />}
        <span className="text-xs text-faint">
          {dateFormatter.format(new Date(task.createdAt))}
        </span>

        <div className="ml-auto flex shrink-0 items-center gap-1 text-faint transition duration-200 sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
          <IconButton
            label={
              previousStatus
                ? `${STATUS_LABELS[previousStatus]} sütununa taşı`
                : 'Geri taşınamaz'
            }
            disabled={!previousStatus}
            onClick={() => previousStatus && onMove(task.id, previousStatus)}
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-3.5"
              aria-hidden="true"
            >
              <path d="M12.5 3.5 6 10l6.5 6.5 2.1-2.1L10.2 10l4.4-4.4z" />
            </svg>
          </IconButton>

          <IconButton
            label={
              nextStatus ? `${STATUS_LABELS[nextStatus]} sütununa taşı` : 'İleri taşınamaz'
            }
            disabled={!nextStatus}
            onClick={() => nextStatus && onMove(task.id, nextStatus)}
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-3.5"
              aria-hidden="true"
            >
              <path d="M7.5 3.5 14 10l-6.5 6.5-2.1-2.1L9.8 10 5.4 5.6z" />
            </svg>
          </IconButton>

          <IconButton
            label="Görevi sil"
            tone="danger"
            onClick={() => onDelete(task.id)}
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-3.5"
              aria-hidden="true"
            >
              <path d="M8.5 2a1 1 0 0 0-1 1v.5H4a1 1 0 0 0 0 2h12a1 1 0 1 0 0-2h-3.5V3a1 1 0 0 0-1-1h-3ZM5.5 7h9l-.72 9.083A2 2 0 0 1 11.786 18H8.214a2 2 0 0 1-1.994-1.917L5.5 7Z" />
            </svg>
          </IconButton>
        </div>
      </div>
    </article>
  )
}
