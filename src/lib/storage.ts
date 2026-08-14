import type { BoardState, Project } from '../interfaces/project'
import type { Task, TaskDifficulty, TaskStatus } from '../interfaces/task'
import { createId } from './createId'

const BOARD_KEY = 'panolo:board'

/** Projeler eklenmeden önce kullanılan, yalnızca görev listesi tutan anahtar. */
const LEGACY_TASKS_KEY = 'gorev-panosu:tasks'

const STATUSES: TaskStatus[] = ['todo', 'progress', 'done']
const DIFFICULTIES: TaskDifficulty[] = ['easy', 'medium', 'hard']

/** Uygulamanın önceki sürümünde kullanılan öncelik değerlerinin karşılığı. */
const LEGACY_PRIORITY_MAP: Record<string, TaskDifficulty> = {
  high: 'hard',
  medium: 'medium',
  low: 'easy',
}

const EMPTY_BOARD: BoardState = { projects: [], tasks: [], activeProjectId: null }

/** Kayıttaki bir projeyi doğrular. */
function normalizeProject(value: unknown): Project | null {
  if (typeof value !== 'object' || value === null) return null
  const raw = value as Record<string, unknown>

  if (typeof raw.id !== 'string' || !raw.id) return null
  if (typeof raw.name !== 'string' || !raw.name.trim()) return null

  return {
    id: raw.id,
    name: raw.name.trim(),
    createdAt:
      typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
  }
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
    projectId: typeof raw.projectId === 'string' ? raw.projectId : '',
    title: raw.title,
    description: typeof raw.description === 'string' ? raw.description : '',
    status: raw.status as TaskStatus,
    difficulty,
    isSample: raw.isSample === true || raw.id.startsWith('ornek-'),
    createdAt: raw.createdAt,
  }
}

/** Depodan okunan ham metni ayrıştırır, hata durumunda null döner. */
function parse(raw: string | null): unknown {
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * Projesi bulunmayan görevleri ilk projeye bağlar ve aktif projeyi doğrular.
 * Hiç proje yoksa görevler de temizlenir.
 */
function reconcile(projects: Project[], tasks: Task[], activeId: unknown): BoardState {
  if (projects.length === 0) return EMPTY_BOARD

  const known = new Set(projects.map((project) => project.id))
  const fallbackId = projects[0].id

  const attached = tasks.map((task) =>
    known.has(task.projectId) ? task : { ...task, projectId: fallbackId },
  )

  const activeProjectId =
    typeof activeId === 'string' && known.has(activeId) ? activeId : fallbackId

  return { projects, tasks: attached, activeProjectId }
}

/** Projeler eklenmeden önce kaydedilmiş görevleri varsayılan bir projeye taşır. */
function migrateLegacyTasks(): BoardState {
  const parsed = parse(window.localStorage.getItem(LEGACY_TASKS_KEY))
  if (!Array.isArray(parsed)) return EMPTY_BOARD

  const tasks = parsed
    .map(normalizeTask)
    .filter((task): task is Task => task !== null)

  if (tasks.length === 0) return EMPTY_BOARD

  const project: Project = {
    id: createId(),
    name: 'Genel',
    createdAt: new Date().toISOString(),
  }

  return reconcile([project], tasks, project.id)
}

/**
 * Tarayıcıdaki uygulama durumunu okur.
 * Kayıt yoksa eski biçimdeki görevler aranır, o da yoksa boş bir pano döner.
 */
export function loadBoard(): BoardState {
  try {
    const parsed = parse(window.localStorage.getItem(BOARD_KEY))

    if (typeof parsed !== 'object' || parsed === null) {
      return migrateLegacyTasks()
    }

    const raw = parsed as Record<string, unknown>
    const projects = Array.isArray(raw.projects)
      ? raw.projects
          .map(normalizeProject)
          .filter((project): project is Project => project !== null)
      : []
    const tasks = Array.isArray(raw.tasks)
      ? raw.tasks.map(normalizeTask).filter((task): task is Task => task !== null)
      : []

    if (projects.length === 0) return migrateLegacyTasks()

    return reconcile(projects, tasks, raw.activeProjectId)
  } catch {
    return EMPTY_BOARD
  }
}

/**
 * Uygulama durumunu tarayıcıya yazar.
 * Kota dolduğunda veya gizli sekmede erişim engellendiğinde sessizce geçilir.
 */
export function saveBoard(state: BoardState): void {
  try {
    window.localStorage.setItem(BOARD_KEY, JSON.stringify(state))
  } catch {
    // Depolama kullanılamıyor: veri kalıcı olmaz ama uygulama çalışmaya devam eder.
  }
}
