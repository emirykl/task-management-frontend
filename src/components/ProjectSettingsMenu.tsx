import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { useDismissable } from '../hooks/useDismissable'
import type { Project } from '../interfaces/project'

interface ProjectSettingsMenuProps {
  project: Project
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}

type SettingsMode = 'menu' | 'rename' | 'confirmDelete'

/** Açık projenin ayarları: adını değiştirme ve projeyi silme. */
export default function ProjectSettingsMenu({
  project,
  onRename,
  onDelete,
}: ProjectSettingsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<SettingsMode>('menu')
  const [draft, setDraft] = useState(project.name)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const close = useCallback(() => {
    setIsOpen(false)
    setMode('menu')
  }, [])

  useDismissable(isOpen, containerRef, close)

  useEffect(() => {
    if (mode === 'rename') {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [mode])

  function handleRename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft.trim()) return

    onRename(project.id, draft)
    close()
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          if (isOpen) {
            close()
          } else {
            setDraft(project.name)
            setIsOpen(true)
          }
        }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Proje ayarları"
        title="Proje ayarları"
        className="glass-button flex size-11 items-center justify-center rounded-full text-muted"
      >
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`size-5 transition-transform duration-300 ${
            isOpen ? 'rotate-45' : ''
          }`}
          aria-hidden="true"
        >
          <path d="M8.5 2h3l.4 2.2 1.4.8 2-.9 1.5 2.6-1.6 1.5v1.6l1.6 1.5-1.5 2.6-2-.9-1.4.8-.4 2.2h-3l-.4-2.2-1.4-.8-2 .9-1.5-2.6L3.8 9.8V8.2L2.2 6.7l1.5-2.6 2 .9 1.4-.8L8.5 2Zm1.5 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="glass-panel absolute top-full right-0 z-20 mt-2 w-72 rounded-2xl p-2"
        >
          {mode === 'menu' && (
            <>
              <p className="px-3 pt-2 pb-1 text-xs font-medium tracking-wide text-faint uppercase">
                Proje ayarları
              </p>
              <button
                type="button"
                role="menuitem"
                onClick={() => setMode('rename')}
                className="w-full rounded-xl px-3 py-2.5 text-left text-[15px] transition hover:bg-white/60"
              >
                Proje adını değiştir
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

          {mode === 'rename' && (
            <form onSubmit={handleRename} className="p-1">
              <label
                htmlFor="rename-project"
                className="mb-1.5 block text-sm font-medium text-muted"
              >
                Proje adı
              </label>
              <input
                ref={inputRef}
                id="rename-project"
                type="text"
                value={draft}
                maxLength={60}
                autoComplete="off"
                onChange={(event) => setDraft(event.target.value)}
                className="glass-field w-full rounded-xl px-3 py-2 text-[15px]"
              />
              <div className="mt-3 flex gap-2">
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="glass-button glass-button-accent rounded-full px-4 py-1.5 text-xs font-medium disabled:opacity-35"
                >
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => setMode('menu')}
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
                <span className="font-medium text-ink">{project.name}</span> projesi ve
                içindeki bütün görevler silinecek. Bu işlem geri alınamaz.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onDelete(project.id)
                    close()
                  }}
                  className="glass-button rounded-full bg-high/12 px-4 py-1.5 text-xs font-medium text-high"
                >
                  Sil
                </button>
                <button
                  type="button"
                  onClick={() => setMode('menu')}
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
