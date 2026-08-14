import type { TaskDifficulty, TaskStatus } from '../interfaces/task'

/**
 * Görev alanlarının ekranda karşılık geldiği metinler ve sıralama bilgisi.
 * Tip tanımlarından ayrı tutulur, böylece arayüz metinleri tek yerden yönetilir.
 */

/** Sütunların soldan sağa sırası. */
export const STATUS_ORDER: TaskStatus[] = ['todo', 'progress', 'done']

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Yapılacak',
  progress: 'Devam ediyor',
  done: 'Bitti',
}

/** Sütun boşken gösterilecek kısa açıklamalar. */
export const STATUS_EMPTY_HINTS: Record<TaskStatus, string> = {
  todo: 'Sıradaki işler burada birikir',
  progress: 'Üzerinde çalıştığın işler burada durur',
  done: 'Bitirdiklerin buraya taşınır',
}

/** Zorluk seçeneklerinin kolaydan zora sırası. */
export const DIFFICULTY_ORDER: TaskDifficulty[] = ['easy', 'medium', 'hard']

export const DIFFICULTY_LABELS: Record<TaskDifficulty, string> = {
  easy: 'Basit',
  medium: 'Orta',
  hard: 'Zor',
}

/** Sıralamada zor görevler üste çıksın diye kullanılan ağırlıklar. */
export const DIFFICULTY_WEIGHT: Record<TaskDifficulty, number> = {
  hard: 0,
  medium: 1,
  easy: 2,
}
