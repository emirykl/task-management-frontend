import { describe, expect, it } from 'vitest'
import { createSampleTasks } from './sampleTasks'

describe('createSampleTasks', () => {
  it('her kaydı örnek veri olarak işaretler', () => {
    const tasks = createSampleTasks()

    expect(tasks.length).toBeGreaterThan(0)
    expect(tasks.every((task) => task.isSample)).toBe(true)
  })

  it('benzersiz kimlikler üretir', () => {
    const ids = createSampleTasks().map((task) => task.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('başlık ve açıklama alanlarını dolu bırakır', () => {
    for (const task of createSampleTasks()) {
      expect(task.title.trim().length).toBeGreaterThan(0)
      expect(task.description.trim().length).toBeGreaterThan(0)
    }
  })

  it('görevleri üç sütuna da dağıtır', () => {
    const statuses = new Set(createSampleTasks().map((task) => task.status))
    expect(statuses).toEqual(new Set(['todo', 'progress', 'done']))
  })

  it('üç zorluk seviyesini de kullanır', () => {
    const levels = new Set(createSampleTasks().map((task) => task.difficulty))
    expect(levels).toEqual(new Set(['easy', 'medium', 'hard']))
  })

  it('geçerli bir oluşturulma zamanı verir', () => {
    for (const task of createSampleTasks()) {
      expect(Number.isNaN(new Date(task.createdAt).getTime())).toBe(false)
    }
  })
})
