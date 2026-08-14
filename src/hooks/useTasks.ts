import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  Task,
  TaskDifficulty,
  TaskPatch,
  TaskStats,
  TaskStatus,
  ViewMode,
} from '../interfaces/task'
import { createSampleTasks } from '../lib/sampleTasks'
import { loadTasks, saveTasks } from '../lib/storage'
import { DIFFICULTY_WEIGHT } from '../lib/taskMeta'

/** Benzersiz kimlik üretir. crypto.randomUUID desteklenmeyen tarayıcılar için yedeği vardır. */
function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/** Önce zor görevler, eşitlikte daha yeni kayıt üste gelir. */
function compareTasks(a: Task, b: Task): number {
  const byDifficulty = DIFFICULTY_WEIGHT[a.difficulty] - DIFFICULTY_WEIGHT[b.difficulty]
  if (byDifficulty !== 0) return byDifficulty
  return b.createdAt.localeCompare(a.createdAt)
}

/**
 * Panonun tüm durumunu ve görev işlemlerini yöneten hook.
 * Her değişiklikte liste LocalStorage'a yazılır.
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [view, setView] = useState<ViewMode>('board')

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  /** CREATE — Yeni görev ekler. Boş başlıklar yok sayılır. */
  const addTask = useCallback(
    (title: string, description: string, difficulty: TaskDifficulty) => {
      const trimmed = title.trim()
      if (!trimmed) return

      const task: Task = {
        id: createId(),
        title: trimmed,
        description: description.trim(),
        status: 'todo',
        difficulty,
        isSample: false,
        createdAt: new Date().toISOString(),
      }
      setTasks((current) => [task, ...current])
    },
    [],
  )

  /** UPDATE — Başlığı, açıklamayı ve zorluğu günceller. Boş başlık kaydedilmez. */
  const updateTask = useCallback((id: string, patch: TaskPatch) => {
    if (patch.title !== undefined && !patch.title.trim()) return

    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) return task

        return {
          ...task,
          title: patch.title === undefined ? task.title : patch.title.trim(),
          description:
            patch.description === undefined ? task.description : patch.description.trim(),
          difficulty: patch.difficulty ?? task.difficulty,
        }
      }),
    )
  }, [])

  /** UPDATE — Görevi başka bir sütuna taşır. */
  const moveTask = useCallback((id: string, status: TaskStatus) => {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, status } : task)),
    )
  }, [])

  /** DELETE — Tek bir görevi siler. */
  const deleteTask = useCallback((id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id))
  }, [])

  /** DELETE — Biten sütunundaki görevleri temizler. */
  const clearDone = useCallback(() => {
    setTasks((current) => current.filter((task) => task.status !== 'done'))
  }, [])

  /** Hazır örnek görevleri listenin başına ekler. */
  const loadSamples = useCallback(() => {
    setTasks((current) => [...createSampleTasks(), ...current])
  }, [])

  /** DELETE — Yalnızca örnek olarak eklenmiş görevleri kaldırır. */
  const removeSamples = useCallback(() => {
    setTasks((current) => current.filter((task) => !task.isSample))
  }, [])

  /** READ — Sütunlara dağıtılmış, zorluk sırasına dizilmiş görevler. */
  const tasksByStatus = useMemo<Record<TaskStatus, Task[]>>(() => {
    const grouped: Record<TaskStatus, Task[]> = { todo: [], progress: [], done: [] }
    for (const task of tasks) {
      grouped[task.status].push(task)
    }
    for (const status of Object.keys(grouped) as TaskStatus[]) {
      grouped[status].sort(compareTasks)
    }
    return grouped
  }, [tasks])

  /** READ — Liste görünümü için tek parça, sıralanmış liste. */
  const sortedTasks = useMemo(() => [...tasks].sort(compareTasks), [tasks])

  const stats = useMemo<TaskStats>(
    () => ({
      total: tasks.length,
      todo: tasksByStatus.todo.length,
      progress: tasksByStatus.progress.length,
      done: tasksByStatus.done.length,
    }),
    [tasks, tasksByStatus],
  )

  const hasSamples = useMemo(() => tasks.some((task) => task.isSample), [tasks])

  return {
    tasks,
    tasksByStatus,
    sortedTasks,
    stats,
    hasSamples,
    view,
    setView,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
    clearDone,
    loadSamples,
    removeSamples,
  }
}
