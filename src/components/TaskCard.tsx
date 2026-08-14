import { useEffect, useRef, useState, type DragEvent, type KeyboardEvent } from 'react'
import {
  STATUS_LABELS,
  STATUS_ORDER,
  type Task,
  type TaskDifficulty,
  type TaskPatch,
  type TaskStatus,
} from '../interfaces/task'
import DifficultyBadge from './DifficultyBadge'
import DifficultySelect from './DifficultySelect'
import StatusChip from './StatusChip'

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

/** Tek bir görev kartı: sütun değiştirme, satır içi düzenleme (UPDATE) ve silme (DELETE). */
export default function TaskCard({
  task,
  variant,
  onMove,
  onUpdate,
  onDelete,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(task.title)
  const [draftDescription, setDraftDescription] = useState(task.description)
  const [draftDifficulty, setDraftDifficulty] = useState<TaskDifficulty>(task.difficulty)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const statusIndex = STATUS_ORDER.indexOf(task.status)
  const previousStatus = statusIndex > 0 ? STATUS_ORDER[statusIndex - 1] : null
  const nextStatus =
    statusIndex < STATUS_ORDER.length - 1 ? STATUS_ORDER[statusIndex + 1] : null
  const isDone = task.status === 'done'

  function startEditing() {
    setDraftTitle(task.title)
    setDraftDescription(task.description)
    setDraftDifficulty(task.difficulty)
    setIsEditing(true)
  }

  function commit() {
    if (draftTitle.trim()) {
      onUpdate(task.id, {
        title: draftTitle,
        description: draftDescription,
        difficulty: draftDifficulty,
      })
    }
    setIsEditing(false)
  }

  function cancel() {
    setDraftTitle(task.title)
    setDraftDescription(task.description)
    setDraftDifficulty(task.difficulty)
    setIsEditing(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      cancel()
    }
  }

  function handleDragStart(event: DragEvent<HTMLElement>) {
    event.dataTransfer.setData('text/plain', task.id)
    event.dataTransfer.effectAllowed = 'move'
  }

  if (isEditing) {
    return (
      <article
        onKeyDown={handleKeyDown}
        className="glass-card rounded-2xl p-4 ring-2 ring-accent/35"
      >
        <input
          ref={inputRef}
          type="text"
          value={draftTitle}
          maxLength={200}
          onChange={(event) => setDraftTitle(event.target.value)}
          aria-label="Görev başlığı"
          className="glass-field w-full rounded-xl px-3 py-2 text-[15px] leading-snug"
        />

        <textarea
          value={draftDescription}
          maxLength={600}
          rows={3}
          onChange={(event) => setDraftDescription(event.target.value)}
          placeholder="Açıklama"
          aria-label="Görev açıklaması"
          className="glass-field mt-3 w-full resize-y rounded-xl px-3 py-2 text-sm leading-relaxed placeholder:text-faint"
        />

        <div className="mt-3">
          <DifficultySelect
            value={draftDifficulty}
            onChange={setDraftDifficulty}
            size="sm"
          />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={commit}
            className="glass-button glass-button-accent rounded-full px-4 py-1.5 text-xs font-medium"
          >
            Kaydet
          </button>
          <button
            type="button"
            onClick={cancel}
            className="glass-button rounded-full px-4 py-1.5 text-xs font-medium text-muted"
          >
            Vazgeç
          </button>
        </div>
      </article>
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
        onClick={startEditing}
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
          <button
            type="button"
            disabled={!previousStatus}
            onClick={() => previousStatus && onMove(task.id, previousStatus)}
            aria-label={
              previousStatus
                ? `${task.title} görevini ${STATUS_LABELS[previousStatus]} sütununa taşı`
                : 'Geri taşınamaz'
            }
            className="flex size-8 items-center justify-center rounded-full transition hover:bg-black/6 hover:text-ink disabled:pointer-events-none disabled:opacity-25"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-3.5"
              aria-hidden="true"
            >
              <path d="M12.5 3.5 6 10l6.5 6.5 2.1-2.1L10.2 10l4.4-4.4z" />
            </svg>
          </button>

          <button
            type="button"
            disabled={!nextStatus}
            onClick={() => nextStatus && onMove(task.id, nextStatus)}
            aria-label={
              nextStatus
                ? `${task.title} görevini ${STATUS_LABELS[nextStatus]} sütununa taşı`
                : 'İleri taşınamaz'
            }
            className="flex size-8 items-center justify-center rounded-full transition hover:bg-black/6 hover:text-ink disabled:pointer-events-none disabled:opacity-25"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-3.5"
              aria-hidden="true"
            >
              <path d="M7.5 3.5 14 10l-6.5 6.5-2.1-2.1L9.8 10 5.4 5.6z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => onDelete(task.id)}
            aria-label={`${task.title} görevini sil`}
            className="flex size-8 items-center justify-center rounded-full transition hover:bg-high/10 hover:text-high"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-3.5"
              aria-hidden="true"
            >
              <path d="M8.5 2a1 1 0 0 0-1 1v.5H4a1 1 0 0 0 0 2h12a1 1 0 1 0 0-2h-3.5V3a1 1 0 0 0-1-1h-3ZM5.5 7h9l-.72 9.083A2 2 0 0 1 11.786 18H8.214a2 2 0 0 1-1.994-1.917L5.5 7Z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}
