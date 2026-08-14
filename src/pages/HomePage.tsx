import BoardView from '../components/BoardView'
import ListView from '../components/ListView'
import TaskForm from '../components/TaskForm'
import Toolbar from '../components/Toolbar'
import { useTasks } from '../hooks/useTasks'

/** Uygulamanın ana sayfası: başlık, form, araç çubuğu ve seçili görünüm. */
export default function HomePage() {
  const {
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
  } = useTasks()

  const progress = stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100)

  return (
    <div className="flex min-h-screen flex-col px-4 py-8 sm:px-8 sm:py-12 xl:px-12">
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-1 sm:mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">TaskManager</h1>

          {stats.total > 0 && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-sm text-muted tabular-nums">
                {stats.done} / {stats.total} iş tamamlandı
              </span>
              <div className="h-1.5 w-40 overflow-hidden rounded-full bg-black/10 sm:w-56">
                <div
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Tamamlanma oranı"
                  className="h-full rounded-full bg-accent transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium tabular-nums">%{progress}</span>
            </div>
          )}
        </header>

        <section className="glass-panel flex flex-1 flex-col rounded-panel p-5 sm:p-7 lg:p-9">
          <TaskForm onAdd={addTask} />

          <hr className="my-6 border-line lg:my-7" />

          <Toolbar
            view={view}
            hasDone={stats.done > 0}
            hasSamples={hasSamples}
            onViewChange={setView}
            onLoadSamples={loadSamples}
            onRemoveSamples={removeSamples}
            onClearDone={clearDone}
          />

          <div className="mt-6 flex-1 lg:mt-8">
            {view === 'board' ? (
              <BoardView
                tasksByStatus={tasksByStatus}
                onMove={moveTask}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ) : (
              <ListView
                tasks={sortedTasks}
                onMove={moveTask}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
