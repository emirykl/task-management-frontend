import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Project } from '../interfaces/project'

interface ProjectMenuProps {
  projects: Project[]
  activeProject: Project
  taskCountByProject: Record<string, number>
  onSelect: (id: string) => void
  onCreate: (name: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}

type MenuMode = 'list' | 'create' | 'rename' | 'confirmDelete'

/** Başlıktaki proje seçici. Proje ekleme, yeniden adlandırma ve silme buradan yapılır. */
export default function ProjectMenu({
  projects,
  activeProject,
  taskCountByProject,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: ProjectMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<MenuMode>('list')
  const [draft, setDraft] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function close() {
    setIsOpen(false)
    setMode('list')
    setDraft('')
  }

  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) close()
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (mode === 'create' || mode === 'rename') inputRef.current?.focus()
  }, [mode])

  function startCreate() {
    setDraft('')
    setMode('create')
  }

  function startRename() {
    setDraft(activeProject.name)
    setMode('rename')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft.trim()) return

    if (mode === 'create') {
      onCreate(draft)
    } else {
      onRename(activeProject.id, draft)
    }
    close()
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-xl px-1 text-3xl font-semibold tracking-tight transition hover:opacity-70 sm:text-4xl"
      >
        {activeProject.name}
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`size-5 text-muted transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        >
          <path d="M5 7.5 10 13l5-5.5z" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="glass-panel absolute top-full left-0 z-20 mt-2 w-72 rounded-2xl p-2"
        >
          {mode === 'list' && (
            <>
              <ul className="flex flex-col">
                {projects.map((project) => {
                  const isActive = project.id === activeProject.id
                  return (
                    <li key={project.id}>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          onSelect(project.id)
                          close()
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] transition hover:bg-white/60 ${
                          isActive ? 'font-medium' : 'text-muted'
                        }`}
                      >
                        <span className="min-w-0 flex-1 truncate">{project.name}</span>
                        <span className="text-xs text-faint tabular-nums">
                          {taskCountByProject[project.id] ?? 0}
                        </span>
                        {isActive && (
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-4 text-accent"
                            aria-hidden="true"
                          >
                            <path d="m7.6 14.2-3.8-3.8 1.4-1.4 2.4 2.4 6.8-6.8 1.4 1.4z" />
                          </svg>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>

              <hr className="my-2 border-line" />

              <button
                type="button"
                role="menuitem"
                onClick={startCreate}
                className="w-full rounded-xl px-3 py-2.5 text-left text-[15px] transition hover:bg-white/60"
              >
                Yeni proje
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={startRename}
                className="w-full rounded-xl px-3 py-2.5 text-left text-[15px] text-muted transition hover:bg-white/60 hover:text-ink"
              >
                Projeyi yeniden adlandır
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => setMode('confirmDelete')}
                className="w-full rounded-xl px-3 py-2.5 text-left text-[15px] text-muted transition hover:bg-high/10 hover:text-high"
              >
                Projeyi sil
              </button>
            </>
          )}

          {(mode === 'create' || mode === 'rename') && (
            <form onSubmit={handleSubmit} className="p-1">
              <label
                htmlFor="project-name"
                className="mb-1.5 block text-sm font-medium text-muted"
              >
                {mode === 'create' ? 'Yeni proje adı' : 'Proje adı'}
              </label>
              <input
                ref={inputRef}
                id="project-name"
                type="text"
                value={draft}
                maxLength={60}
                autoComplete="off"
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Örneğin Okul"
                className="glass-field w-full rounded-xl px-3 py-2 text-[15px] placeholder:text-faint"
              />
              <div className="mt-3 flex gap-2">
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="glass-button glass-button-accent rounded-full px-4 py-1.5 text-xs font-medium disabled:opacity-35"
                >
                  {mode === 'create' ? 'Oluştur' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('list')}
                  className="glass-button rounded-full px-4 py-1.5 text-xs font-medium text-muted"
                >
                  Vazgeç
                </button>
              </div>
            </form>
          )}

          {mode === 'confirmDelete' && (
            <div className="p-3">
              <p className="text-sm leading-relaxed text-muted">
                <span className="font-medium text-ink">{activeProject.name}</span> projesi
                ve içindeki bütün görevler silinecek. Bu işlem geri alınamaz.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onDelete(activeProject.id)
                    close()
                  }}
                  className="glass-button rounded-full bg-high/12 px-4 py-1.5 text-xs font-medium text-high"
                >
                  Sil
                </button>
                <button
                  type="button"
                  onClick={() => setMode('list')}
                  className="glass-button rounded-full px-4 py-1.5 text-xs font-medium text-muted"
                >
                  Vazgeç
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
