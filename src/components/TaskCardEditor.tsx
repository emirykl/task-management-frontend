import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import type { Task, TaskDifficulty, TaskPatch } from '../interfaces/task'
import DifficultySelect from './DifficultySelect'

interface TaskCardEditorProps {
  task: Task
  onSubmit: (patch: TaskPatch) => void
  onCancel: () => void
}

/**
 * Görev kartının düzenleme hali.
 * Form olduğu için başlıkta Enter tuşu doğrudan kaydeder, Escape vazgeçer.
 */
export default function TaskCardEditor({ task, onSubmit, onCancel }: TaskCardEditorProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [difficulty, setDifficulty] = useState<TaskDifficulty>(task.difficulty)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
    titleRef.current?.select()
  }, [])

  const canSubmit = title.trim().length > 0

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return

    onSubmit({ title, description, difficulty })
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onCancel()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="glass-card rounded-2xl p-4 ring-2 ring-accent/35"
    >
      <input
        ref={titleRef}
        type="text"
        value={title}
        maxLength={200}
        onChange={(event) => setTitle(event.target.value)}
        aria-label="Görev başlığı"
        className="glass-field w-full rounded-xl px-3 py-2 text-[15px] leading-snug"
      />

      <textarea
        value={description}
        maxLength={600}
        rows={3}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Açıklama"
        aria-label="Görev açıklaması"
        className="glass-field mt-3 w-full resize-y rounded-xl px-3 py-2 text-sm leading-relaxed placeholder:text-faint"
      />

      <div className="mt-3">
        <DifficultySelect value={difficulty} onChange={setDifficulty} size="sm" />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="glass-button glass-button-accent rounded-full px-4 py-1.5 text-xs font-medium disabled:opacity-35"
        >
          Kaydet
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="glass-button rounded-full px-4 py-1.5 text-xs font-medium text-muted"
        >
          Vazgeç
        </button>
      </div>
    </form>
  )
}
