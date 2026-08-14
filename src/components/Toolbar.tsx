import type { ViewMode } from '../interfaces/task'

interface ToolbarProps {
  view: ViewMode
  hasDone: boolean
  hasSamples: boolean
  onViewChange: (view: ViewMode) => void
  onLoadSamples: () => void
  onRemoveSamples: () => void
  onClearDone: () => void
}

const VIEWS: { value: ViewMode; label: string }[] = [
  { value: 'board', label: 'Pano' },
  { value: 'list', label: 'Liste' },
]

/** Görünüm değiştirici ve toplu işlemler. */
export default function Toolbar({
  view,
  hasDone,
  hasSamples,
  onViewChange,
  onLoadSamples,
  onRemoveSamples,
  onClearDone,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div
        role="tablist"
        aria-label="Görünüm"
        className="glass-field flex gap-1 rounded-full p-1"
      >
        {VIEWS.map(({ value, label }) => {
          const isActive = view === value
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onViewChange(value)}
              className={`rounded-full px-5 py-2 text-[15px] transition duration-200 ${
                isActive
                  ? 'bg-white font-medium text-ink shadow-[0_1px_3px_rgb(0_0_0/0.12)]'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={hasSamples ? onRemoveSamples : onLoadSamples}
          className="glass-button rounded-full px-5 py-2.5 text-sm font-medium text-ink"
        >
          {hasSamples ? 'Örnek verileri sil' : 'Örnek veri yükle'}
        </button>
        <button
          type="button"
          onClick={onClearDone}
          disabled={!hasDone}
          className="glass-button rounded-full px-5 py-2.5 text-sm font-medium text-muted disabled:opacity-35"
        >
          Bitenleri sil
        </button>
      </div>
    </div>
  )
}
