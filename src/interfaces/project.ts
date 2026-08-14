import type { Task } from './task'

/** Görevlerin altında toplandığı çalışma alanı. */
export interface Project {
  id: string
  name: string
  /** ISO 8601 formatında oluşturulma zamanı. */
  createdAt: string
}

/** Tarayıcıda tek parça olarak saklanan uygulama durumu. */
export interface BoardState {
  projects: Project[]
  tasks: Task[]
  /** Hiç proje yoksa null olur. */
  activeProjectId: string | null
}
