import type { Task, TaskDifficulty, TaskStatus } from '../interfaces/task'

const STORAGE_KEY = 'gorev-panosu:tasks'

const STATUSES: TaskStatus[] = ['todo', 'progress', 'done']
const DIFFICULTIES: TaskDifficulty[] = ['easy', 'medium', 'hard']

/** Uygulamanın önceki sürümünde kullanılan öncelik değerlerinin karşılığı. */
const LEGACY_PRIORITY_MAP: Record<string, TaskDifficulty> = {
  high: 'hard',
  medium: 'medium',
  low: 'easy',
}

/**
 * Kayıttaki tek bir görevi bugünkü Task yapısına çevirir.
 * Eksik veya eski alanlar tamamlanır, tanınmayan kayıtlar için null döner.
 */
function normalizeTask(value: unknown): Task | null {
  if (typeof value !== 'object' || value === null) return null
  const raw = value as Record<string, unknown>

  if (typeof raw.id !== 'string' || typeof raw.title !== 'string') return null
  if (typeof raw.createdAt !== 'string') return null
  if (!STATUSES.includes(raw.status as TaskStatus)) return null

  // Zorluk alanı yoksa eski öncelik değerinden türetilir.
  let difficulty: TaskDifficulty = 'medium'
  if (DIFFICULTIES.includes(raw.difficulty as TaskDifficulty)) {
    difficulty = raw.difficulty as TaskDifficulty
  } else if (typeof raw.priority === 'string' && raw.priority in LEGACY_PRIORITY_MAP) {
    difficulty = LEGACY_PRIORITY_MAP[raw.priority]
  }

  return {
    id: raw.id,
    title: raw.title,
    description: typeof raw.description === 'string' ? raw.description : '',
    status: raw.status as TaskStatus,
    difficulty,
    isSample: raw.isSample === true || raw.id.startsWith('ornek-'),
    createdAt: raw.createdAt,
  }
}

/**
 * LocalStorage'daki görevleri okur.
 * Kayıt yoksa veya veri bozuksa boş liste döner; uygulama asla çökmez.
 */
export function loadTasks(): Task[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map(normalizeTask)
      .filter((task): task is Task => task !== null)
  } catch {
    return []
  }
}

/**
 * Görevleri LocalStorage'a yazar.
 * Kota dolduğunda veya gizli sekmede erişim engellendiğinde sessizce geçilir.
 */
export function saveTasks(tasks: Task[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // Depolama kullanılamıyor: veri kalıcı olmaz ama uygulama çalışmaya devam eder.
  }
}
