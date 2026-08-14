import { describe, expect, it } from 'vitest'
import { createSampleTasks } from './sampleTasks'

describe('createSampleTasks', () => {
  it('bütün görevleri verilen projeye bağlar', () => {
    const tasks = createSampleTasks('proje-42')

    expect(tasks.length).toBeGreaterThan(0)
    expect(tasks.every((task) => task.projectId === 'proje-42')).toBe(true)
  })

  it('her kaydı örnek veri olarak işaretler', () => {
    expect(createSampleTasks('p').every((task) => task.isSample)).toBe(true)
  })

  it('benzersiz kimlikler üretir', () => {
    const ids = createSampleTasks('p').map((task) => task.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('başlık ve açıklama alanlarını dolu bırakır', () => {
    for (const task of createSampleTasks('p')) {
      expect(task.title.trim().length).toBeGreaterThan(0)
      expect(task.description.trim().length).toBeGreaterThan(0)
    }
  })

  it('görevleri üç sütuna da dağıtır', () => {
    const statuses = new Set(createSampleTasks('p').map((task) => task.status))
    expect(statuses).toEqual(new Set(['todo', 'progress', 'done']))
  })

  it('üç zorluk seviyesini de kullanır', () => {
    const levels = new Set(createSampleTasks('p').map((task) => task.difficulty))
    expect(levels).toEqual(new Set(['easy', 'medium', 'hard']))
  })

  it('geçerli bir oluşturulma zamanı verir', () => {
    for (const task of createSampleTasks('p')) {
      expect(Number.isNaN(new Date(task.createdAt).getTime())).toBe(false)
    }
  })
})
