import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import type { TaskDifficulty } from '../interfaces/task'
import DifficultySelect from './DifficultySelect'

interface TaskFormProps {
  onAdd: (title: string, description: string, difficulty: TaskDifficulty) => void
}

/** Görev ekleme paneli (CREATE). Kapalıyken tek bir butona iner. */
export default function TaskForm({ onAdd }: TaskFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('medium')
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) titleRef.current?.focus()
  }, [isOpen])

  const canSubmit = title.trim().length > 0

  function reset() {
    setTitle('')
    setDescription('')
    setDifficulty('medium')
  }

  function close() {
    reset()
    setIsOpen(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return

    onAdd(title, description, difficulty)
    reset()
    titleRef.current?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
    }
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="glass-button glass-button-accent flex w-fit items-center gap-2 self-start rounded-full px-6 py-3 text-[15px] font-medium"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
          <path d="M9 3.5h2V9h5.5v2H11v5.5H9V11H3.5V9H9V3.5Z" />
        </svg>
        Görev ekle
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="glass-card w-full max-w-2xl rounded-2xl p-5 sm:p-6"
    >
      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="task-title"
            className="mb-1.5 block text-sm font-medium text-muted"
          >
            Başlık
          </label>
          <input
            ref={titleRef}
            id="task-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ne yapılması gerekiyor?"
            autoComplete="off"
            maxLength={200}
            className="glass-field w-full rounded-xl px-4 py-3 text-[15px] placeholder:text-faint"
          />
        </div>

        <div>
          <label
            htmlFor="task-description"
            className="mb-1.5 block text-sm font-medium text-muted"
          >
            Açıklama
            <span className="ml-1.5 font-normal text-faint">isteğe bağlı</span>
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Görevin ayrıntılarını buraya yazabilirsin"
            rows={3}
            maxLength={600}
            className="glass-field w-full resize-y rounded-xl px-4 py-3 text-[15px] leading-relaxed placeholder:text-faint"
          />
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-muted">
            Zorluk derecesi
          </span>
          <DifficultySelect value={difficulty} onChange={setDifficulty} />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className="glass-button glass-button-accent rounded-full px-6 py-2.5 text-[15px] font-medium disabled:opacity-35"
        >
          Ekle
        </button>
        <button
          type="button"
          onClick={close}
          className="glass-button rounded-full px-6 py-2.5 text-[15px] font-medium text-muted"
        >
          Kapat
        </button>
      </div>
    </form>
  )
}
