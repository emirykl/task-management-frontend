import { beforeEach, describe, expect, it } from 'vitest'
import type { Task } from '../interfaces/task'
import { loadTasks, saveTasks } from './storage'

const STORAGE_KEY = 'gorev-panosu:tasks'

function writeRaw(value: unknown) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'gorev-1',
    title: 'Sunumu hazırla',
    description: 'Slaytları gözden geçir',
    status: 'todo',
    difficulty: 'medium',
    isSample: false,
    createdAt: '2026-08-14T10:00:00.000Z',
    ...overrides,
  }
}

describe('loadTasks', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('hiç kayıt yokken boş liste döner', () => {
    expect(loadTasks()).toEqual([])
  })

  it('bozuk JSON karşısında çökmeden boş liste döner', () => {
    window.localStorage.setItem(STORAGE_KEY, '{bozuk json')
    expect(loadTasks()).toEqual([])
  })

  it('dizi olmayan veriyi yok sayar', () => {
    writeRaw({ tasks: 'yanlış biçim' })
    expect(loadTasks()).toEqual([])
  })

  it('geçersiz kayıtları eler, geçerli olanları korur', () => {
    writeRaw([makeTask(), { id: 'eksik' }, null, 42])

    const tasks = loadTasks()
    expect(tasks).toHaveLength(1)
    expect(tasks[0].title).toBe('Sunumu hazırla')
  })

  it('tanınmayan bir durum değerini reddeder', () => {
    writeRaw([makeTask({ status: 'arsiv' as Task['status'] })])
    expect(loadTasks()).toEqual([])
  })

  it('eski priority alanını difficulty değerine çevirir', () => {
    writeRaw([
      { ...makeTask({ id: 'a' }), difficulty: undefined, priority: 'high' },
      { ...makeTask({ id: 'b' }), difficulty: undefined, priority: 'low' },
    ])

    const tasks = loadTasks()
    expect(tasks[0].difficulty).toBe('hard')
    expect(tasks[1].difficulty).toBe('easy')
  })

  it('bilinmeyen bir zorluk değeri geldiğinde orta seviyeye düşer', () => {
    writeRaw([{ ...makeTask(), difficulty: 'imkansiz' }])
    expect(loadTasks()[0].difficulty).toBe('medium')
  })

  it('eksik açıklama alanını boş metinle tamamlar', () => {
    writeRaw([{ ...makeTask(), description: undefined }])
    expect(loadTasks()[0].description).toBe('')
  })

  it('ornek ile başlayan kimlikleri örnek veri sayar', () => {
    writeRaw([{ ...makeTask({ id: 'ornek-3-1786' }), isSample: undefined }])
    expect(loadTasks()[0].isSample).toBe(true)
  })
})

describe('saveTasks', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('yazdığı listeyi aynı şekilde geri okur', () => {
    const tasks = [makeTask({ id: 'a' }), makeTask({ id: 'b', status: 'done' })]
    saveTasks(tasks)

    expect(loadTasks()).toEqual(tasks)
  })

  it('boş listeyi de saklayabilir', () => {
    saveTasks([makeTask()])
    saveTasks([])

    expect(loadTasks()).toEqual([])
  })
})
