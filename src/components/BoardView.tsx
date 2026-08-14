import { useState, type DragEvent } from 'react'
import {
  STATUS_ORDER,
  type Task,
  type TaskPatch,
  type TaskStatus,
} from '../interfaces/task'
import StatusChip from './StatusChip'
import TaskCard from './TaskCard'

interface BoardViewProps {
  tasksByStatus: Record<TaskStatus, Task[]>
  onMove: (id: string, status: TaskStatus) => void
  onUpdate: (id: string, patch: TaskPatch) => void
  onDelete: (id: string) => void
}

/** Görevleri durumlarına göre sütunlara dağıtan pano görünümü. */
export default function BoardView({
  tasksByStatus,
  onMove,
  onUpdate,
  onDelete,
}: BoardViewProps) {
  const [hoveredColumn, setHoveredColumn] = useState<TaskStatus | null>(null)

  function handleDrop(event: DragEvent<HTMLElement>, status: TaskStatus) {
    event.preventDefault()
    setHoveredColumn(null)

    const id = event.dataTransfer.getData('text/plain')
    if (id) onMove(id, status)
  }

  return (
    <div className="grid divide-y divide-black/15 md:grid-cols-3 md:divide-x md:divide-y-0">
      {STATUS_ORDER.map((status) => {
        const columnTasks = tasksByStatus[status]
        const isHovered = hoveredColumn === status

        return (
          <section
            key={status}
            onDragOver={(event) => {
              event.preventDefault()
              setHoveredColumn(status)
            }}
            onDragLeave={() => setHoveredColumn(null)}
            onDrop={(event) => handleDrop(event, status)}
            className={`flex flex-col px-4 py-5 transition duration-200 md:first:pl-0 md:last:pr-0 ${
              isHovered ? 'bg-accent/10' : ''
            }`}
          >
            <h2 className="mb-4">
              <StatusChip status={status} count={columnTasks.length} />
            </h2>

            <div className="flex min-h-32 flex-1 flex-col gap-3">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  variant="board"
                  onMove={onMove}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
