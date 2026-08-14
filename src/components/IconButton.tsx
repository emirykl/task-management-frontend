import type { ReactNode } from 'react'

interface IconButtonProps {
  /** Ekran okuyucuya okunacak açıklama. Butonda görsel metin bulunmaz. */
  label: string
  onClick: () => void
  children: ReactNode
  disabled?: boolean
  /** Silme gibi geri alınamayan işlemlerde kırmızı vurgu verir. */
  tone?: 'neutral' | 'danger'
}

const TONE_STYLES: Record<'neutral' | 'danger', string> = {
  neutral: 'hover:bg-black/6 hover:text-ink',
  danger: 'hover:bg-high/10 hover:text-high',
}

/** Kart üzerindeki küçük, yalnızca ikon içeren aksiyon butonu. */
export default function IconButton({
  label,
  onClick,
  children,
  disabled = false,
  tone = 'neutral',
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex size-8 items-center justify-center rounded-full transition disabled:pointer-events-none disabled:opacity-25 ${TONE_STYLES[tone]}`}
    >
      {children}
    </button>
  )
}
