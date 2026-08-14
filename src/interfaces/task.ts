/**
 * Uygulama genelinde kullanılan tip tanımları.
 * Ekranda görünen etiketler ve sıralama bilgisi için `lib/taskMeta` dosyasına bakılır.
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
  /** Görevin bağlı olduğu projenin kimliği. */
  projectId: string
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
