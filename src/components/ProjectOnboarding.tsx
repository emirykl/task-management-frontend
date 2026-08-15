import { useEffect, useRef, useState, type FormEvent } from 'react'
import BrandMark from './BrandMark'

interface ProjectOnboardingProps {
  onCreate: (name: string) => void
}

/** Hiç proje yokken gösterilen karşılama ekranı. */
export default function ProjectOnboarding({ onCreate }: ProjectOnboardingProps) {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const canSubmit = name.trim().length > 0

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return

    onCreate(name)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="glass-panel w-full max-w-md rounded-panel p-8 sm:p-10">
        <BrandMark />
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          İlk projeni oluştur
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Görevlerin projeler altında toplanır. Okul, iş ya da kişisel işler için ayrı
          panolar açabilirsin.
        </p>

        <form onSubmit={handleSubmit} className="mt-7">
          <label
            htmlFor="first-project"
            className="mb-1.5 block text-sm font-medium text-muted"
          >
            Proje adı
          </label>
          <input
            ref={inputRef}
            id="first-project"
            type="text"
            value={name}
            maxLength={60}
            autoComplete="off"
            onChange={(event) => setName(event.target.value)}
            placeholder="Örneğin Bitirme projesi"
            className="glass-field w-full rounded-2xl px-4 py-3 text-[15px] placeholder:text-faint"
          />

          <button
            type="submit"
            disabled={!canSubmit}
            className="glass-button glass-button-accent mt-5 w-full rounded-full px-6 py-3 text-[15px] font-medium disabled:opacity-35"
          >
            Panoyu aç
          </button>
        </form>
      </div>
    </div>
  )
}
