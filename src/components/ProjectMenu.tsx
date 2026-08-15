import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { useDismissable } from '../hooks/useDismissable'
import type { Project } from '../interfaces/project'

interface ProjectMenuProps {
  projects: Project[]
  activeProject: Project
  taskCountByProject: Record<string, number>
  onSelect: (id: string) => void
  onCreate: (name: string) => void
}

/** Başlıktaki proje seçici. Projeler arasında geçiş ve yeni proje açma buradan yapılır. */
export default function ProjectMenu({
  projects,
  activeProject,
  taskCountByProject,
  onSelect,
  onCreate,
}: ProjectMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [draft, setDraft] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const close = useCallback(() => {
    setIsOpen(false)
    setIsCreating(false)
    setDraft('')
  }, [])

  useDismissable(isOpen, containerRef, close)

  useEffect(() => {
    if (isCreating) inputRef.current?.focus()
  }, [isCreating])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft.trim()) return

    onCreate(draft)
    close()
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-xl text-3xl font-semibold tracking-tight transition hover:opacity-70 sm:text-4xl"
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
          {isCreating ? (
            <form onSubmit={handleSubmit} className="p-1">
              <label
                htmlFor="new-project"
                className="mb-1.5 block text-sm font-medium text-muted"
              >
                Yeni proje adı
              </label>
              <input
                ref={inputRef}
                id="new-project"
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
                  Oluştur
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="glass-button rounded-full px-4 py-1.5 text-xs font-medium text-muted"
                >
                  Vazgeç
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="px-3 pt-2 pb-1 text-xs font-medium tracking-wide text-faint uppercase">
                Projelerin
              </p>

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
                onClick={() => {
                  setDraft('')
                  setIsCreating(true)
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[15px] font-medium transition hover:bg-white/60"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-4 text-accent"
                  aria-hidden="true"
                >
                  <path d="M9 3.5h2V9h5.5v2H11v5.5H9V11H3.5V9H9V3.5Z" />
                </svg>
                Yeni proje
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
