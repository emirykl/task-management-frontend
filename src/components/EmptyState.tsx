interface EmptyStateProps {
  message?: string
  /** Sütun içinde kullanılırken daha az dikey boşluk bırakır. */
  size?: 'sm' | 'md'
}

/** Görev bulunmayan bir alanda gösterilen kısa bilgi satırı. */
export default function EmptyState({
  message = 'Henüz görev yok',
  size = 'md',
}: EmptyStateProps) {
  const scale = size === 'sm' ? 'py-8 text-sm' : 'py-16 text-[15px]'

  return (
    <p
      className={`rounded-2xl border border-dashed border-black/12 bg-white/30 px-4 text-center text-faint ${scale}`}
    >
      {message}
    </p>
  )
}
