import { useEffect, type RefObject } from 'react'

/**
 * Açık bir menüyü dışarı tıklandığında veya Escape tuşuna basıldığında kapatır.
 * `onDismiss` her render değişmesin diye çağıran tarafta sabitlenmelidir.
 */
export function useDismissable(
  isOpen: boolean,
  ref: RefObject<HTMLElement | null>,
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) onDismiss()
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onDismiss()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, ref, onDismiss])
}
