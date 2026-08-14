/**
 * Uygulama genelinde kullanılan tip tanımları.
 */

/** Bir görevin panodaki sütunu. */
export type TaskStatus = 'todo' | 'progress' | 'done'

/** Görevin zorluk derecesi. */
export type TaskDifficulty = 'easy' | 'medium' | 'hard'

/** Panonun mu yoksa listenin mi gösterileceği. */
export type ViewMode = 'board' | 'list'

/** Tek bir görevi temsil eder. */
export interface Task {
  id: string
  title: string
  /** Serbest metin açıklama. Boş bırakılabilir. */
  description: string
  status: TaskStatus
  difficulty: TaskDifficulty
  /** Örnek veri olarak eklendiyse doğru olur, toplu silmede kullanılır. */
  isSample: boolean
  /** ISO 8601 formatında oluşturulma zamanı. */
  createdAt: string
}

/** Bir görev güncellenirken değiştirilebilen alanlar. */
export interface TaskPatch {
  title?: string
  description?: string
  difficulty?: TaskDifficulty
}

/** Görev listesinin özet sayıları. */
export interface TaskStats {
  total: number
  todo: number
  progress: number
  done: number
}

/** Sütunların soldan sağa sırası. */
export const STATUS_ORDER: TaskStatus[] = ['todo', 'progress', 'done']

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Yapılacak',
  progress: 'Devam ediyor',
  done: 'Bitti',
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
