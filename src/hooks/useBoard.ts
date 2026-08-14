import { useCallback, useEffect, useMemo, useState } from 'react'
import type { BoardState, Project } from '../interfaces/project'
import type {
  Task,
  TaskDifficulty,
  TaskPatch,
  TaskStats,
  TaskStatus,
  ViewMode,
} from '../interfaces/task'
import { createId } from '../lib/createId'
import { createSampleTasks } from '../lib/sampleTasks'
import { loadBoard, saveBoard } from '../lib/storage'
import { DIFFICULTY_WEIGHT } from '../lib/taskMeta'

/** Önce zor görevler, eşitlikte daha yeni kayıt üste gelir. */
function compareTasks(a: Task, b: Task): number {
  const byDifficulty = DIFFICULTY_WEIGHT[a.difficulty] - DIFFICULTY_WEIGHT[b.difficulty]
  if (byDifficulty !== 0) return byDifficulty
  return b.createdAt.localeCompare(a.createdAt)
}

/**
 * Projeleri ve görevleri birlikte yöneten hook.
 * Tek bir durum nesnesi tutulur, her değişiklikte tarayıcıya yazılır.
 */
export function useBoard() {
  const [board, setBoard] = useState<BoardState>(loadBoard)
  const [view, setView] = useState<ViewMode>('board')

  useEffect(() => {
    saveBoard(board)
  }, [board])

  const { projects, activeProjectId } = board

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) ?? null,
    [projects, activeProjectId],
  )

  /** Görev listesini dönüştüren yardımcı. */
  const updateTasks = useCallback((change: (tasks: Task[]) => Task[]) => {
    setBoard((current) => ({ ...current, tasks: change(current.tasks) }))
  }, [])

  /* Proje işlemleri */

  /** CREATE — Yeni proje açar ve üzerine geçer. Boş isimler yok sayılır. */
  const addProject = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return

    const project: Project = {
      id: createId(),
      name: trimmed,
      createdAt: new Date().toISOString(),
    }

    setBoard((current) => ({
      ...current,
      projects: [...current.projects, project],
      activeProjectId: project.id,
    }))
  }, [])

  /** UPDATE — Proje adını değiştirir. */
  const renameProject = useCallback((id: string, name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return

    setBoard((current) => ({
      ...current,
      projects: current.projects.map((project) =>
        project.id === id ? { ...project, name: trimmed } : project,
      ),
    }))
  }, [])

  /** DELETE — Projeyi ve ona bağlı bütün görevleri siler. */
  const deleteProject = useCallback((id: string) => {
    setBoard((current) => {
      const projects = current.projects.filter((project) => project.id !== id)
      const tasks = current.tasks.filter((task) => task.projectId !== id)
      const activeProjectId =
        current.activeProjectId === id
          ? (projects[0]?.id ?? null)
          : current.activeProjectId

      return { projects, tasks, activeProjectId }
    })
  }, [])

  /** Görüntülenen projeyi değiştirir. */
  const selectProject = useCallback((id: string) => {
    setBoard((current) =>
      current.projects.some((project) => project.id === id)
        ? { ...current, activeProjectId: id }
        : current,
    )
  }, [])

  /* Görev işlemleri, yalnızca açık olan projeye uygulanır */

  /** CREATE — Yeni görev ekler. Boş başlıklar yok sayılır. */
  const addTask = useCallback(
    (title: string, description: string, difficulty: TaskDifficulty) => {
      const trimmed = title.trim()
      if (!trimmed || !activeProjectId) return

      const task: Task = {
        id: createId(),
        projectId: activeProjectId,
        title: trimmed,
        description: description.trim(),
        status: 'todo',
        difficulty,
        isSample: false,
        createdAt: new Date().toISOString(),
      }

      updateTasks((tasks) => [task, ...tasks])
    },
    [activeProjectId, updateTasks],
  )

  /** UPDATE — Başlığı, açıklamayı ve zorluğu günceller. Boş başlık kaydedilmez. */
  const updateTask = useCallback(
    (id: string, patch: TaskPatch) => {
      if (patch.title !== undefined && !patch.title.trim()) return

      updateTasks((tasks) =>
        tasks.map((task) => {
          if (task.id !== id) return task

          return {
            ...task,
            title: patch.title === undefined ? task.title : patch.title.trim(),
            description:
              patch.description === undefined
                ? task.description
                : patch.description.trim(),
            difficulty: patch.difficulty ?? task.difficulty,
          }
        }),
      )
    },
    [updateTasks],
  )

  /** UPDATE — Görevi başka bir sütuna taşır. */
  const moveTask = useCallback(
    (id: string, status: TaskStatus) => {
      updateTasks((tasks) =>
        tasks.map((task) => (task.id === id ? { ...task, status } : task)),
      )
    },
    [updateTasks],
  )

  /** DELETE — Tek bir görevi siler. */
  const deleteTask = useCallback(
    (id: string) => {
      updateTasks((tasks) => tasks.filter((task) => task.id !== id))
    },
    [updateTasks],
  )

  /** DELETE — Açık projedeki biten görevleri temizler. */
  const clearDone = useCallback(() => {
    if (!activeProjectId) return

    updateTasks((tasks) =>
      tasks.filter(
        (task) => task.projectId !== activeProjectId || task.status !== 'done',
      ),
    )
  }, [activeProjectId, updateTasks])

  /** Hazır örnek görevleri açık projeye ekler. */
  const loadSamples = useCallback(() => {
    if (!activeProjectId) return

    updateTasks((tasks) => [...createSampleTasks(activeProjectId), ...tasks])
  }, [activeProjectId, updateTasks])

  /** DELETE — Açık projedeki örnek görevleri kaldırır. */
  const removeSamples = useCallback(() => {
    if (!activeProjectId) return

    updateTasks((tasks) =>
      tasks.filter((task) => task.projectId !== activeProjectId || !task.isSample),
    )
  }, [activeProjectId, updateTasks])

  /* Türetilmiş veriler */

  /** READ — Yalnızca açık projeye ait görevler. */
  const projectTasks = useMemo(
    () => board.tasks.filter((task) => task.projectId === activeProjectId),
    [board.tasks, activeProjectId],
  )

  const tasksByStatus = useMemo<Record<TaskStatus, Task[]>>(() => {
    const grouped: Record<TaskStatus, Task[]> = { todo: [], progress: [], done: [] }
    for (const task of projectTasks) {
      grouped[task.status].push(task)
    }
    for (const status of Object.keys(grouped) as TaskStatus[]) {
      grouped[status].sort(compareTasks)
    }
    return grouped
  }, [projectTasks])

  const sortedTasks = useMemo(
    () => [...projectTasks].sort(compareTasks),
    [projectTasks],
  )

  const stats = useMemo<TaskStats>(
    () => ({
      total: projectTasks.length,
      todo: tasksByStatus.todo.length,
      progress: tasksByStatus.progress.length,
      done: tasksByStatus.done.length,
    }),
    [projectTasks, tasksByStatus],
  )

  const hasSamples = useMemo(
    () => projectTasks.some((task) => task.isSample),
    [projectTasks],
  )

  /** Menüde her projenin yanında gösterilen görev sayısı. */
  const taskCountByProject = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const project of projects) counts[project.id] = 0
    for (const task of board.tasks) {
      if (task.projectId in counts) counts[task.projectId] += 1
    }
    return counts
  }, [projects, board.tasks])

  return {
    projects,
    activeProject,
    taskCountByProject,
    addProject,
    renameProject,
    deleteProject,
    selectProject,

    tasks: projectTasks,
    tasksByStatus,
    sortedTasks,
    stats,
    hasSamples,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
    clearDone,
    loadSamples,
    removeSamples,

    view,
    setView,
  }
}
