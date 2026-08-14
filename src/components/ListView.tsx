import type { Task, TaskPatch, TaskStatus } from '../interfaces/task'
import EmptyState from './EmptyState'
import TaskCard from './TaskCard'

interface ListViewProps {
  tasks: Task[]
  onMove: (id: string, status: TaskStatus) => void
  onUpdate: (id: string, patch: TaskPatch) => void
  onDelete: (id: string) => void
}

/** Bütün görevleri öncelik sırasına göre tek listede gösteren görünüm. */
export default function ListView({ tasks, onMove, onUpdate, onDelete }: ListViewProps) {
  if (tasks.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          variant="list"
          onMove={onMove}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
