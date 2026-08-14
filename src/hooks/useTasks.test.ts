import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useTasks } from './useTasks'

beforeEach(() => {
  window.localStorage.clear()
})

describe('useTasks ekleme', () => {
  it('yeni görevi yapılacak sütununa koyar', () => {
    const { result } = renderHook(() => useTasks())

    act(() => result.current.addTask('Sunumu hazırla', 'Slaytlar', 'medium'))

    expect(result.current.stats.total).toBe(1)
    expect(result.current.tasksByStatus.todo[0].title).toBe('Sunumu hazırla')
    expect(result.current.tasksByStatus.todo[0].isSample).toBe(false)
  })

  it('boş başlıklı görevi yok sayar', () => {
    const { result } = renderHook(() => useTasks())

    act(() => result.current.addTask('   ', 'açıklama', 'easy'))

    expect(result.current.stats.total).toBe(0)
  })

  it('başlık ve açıklamadaki fazla boşlukları kırpar', () => {
    const { result } = renderHook(() => useTasks())

    act(() => result.current.addTask('  Rapor  ', '  detay  ', 'hard'))

    expect(result.current.tasks[0].title).toBe('Rapor')
    expect(result.current.tasks[0].description).toBe('detay')
  })
})

describe('useTasks güncelleme ve taşıma', () => {
  it('başlığı, açıklamayı ve zorluğu günceller', () => {
    const { result } = renderHook(() => useTasks())
    act(() => result.current.addTask('Eski', 'eski açıklama', 'easy'))

    const id = result.current.tasks[0].id
    act(() =>
      result.current.updateTask(id, {
        title: 'Yeni',
        description: 'yeni açıklama',
        difficulty: 'hard',
      }),
    )

    expect(result.current.tasks[0]).toMatchObject({
      title: 'Yeni',
      description: 'yeni açıklama',
      difficulty: 'hard',
    })
  })

  it('boş başlıkla yapılan güncellemeyi uygulamaz', () => {
    const { result } = renderHook(() => useTasks())
    act(() => result.current.addTask('Kalsın', '', 'medium'))

    const id = result.current.tasks[0].id
    act(() => result.current.updateTask(id, { title: '  ' }))

    expect(result.current.tasks[0].title).toBe('Kalsın')
  })

  it('görevi başka bir sütuna taşır ve sayaçları günceller', () => {
    const { result } = renderHook(() => useTasks())
    act(() => result.current.addTask('Taşınacak', '', 'medium'))

    const id = result.current.tasks[0].id
    act(() => result.current.moveTask(id, 'done'))

    expect(result.current.stats.done).toBe(1)
    expect(result.current.stats.todo).toBe(0)
  })
})

describe('useTasks silme', () => {
  it('tek bir görevi siler', () => {
    const { result } = renderHook(() => useTasks())
    act(() => result.current.addTask('Silinecek', '', 'easy'))

    const id = result.current.tasks[0].id
    act(() => result.current.deleteTask(id))

    expect(result.current.stats.total).toBe(0)
  })

  it('yalnızca biten sütununu temizler', () => {
    const { result } = renderHook(() => useTasks())
    act(() => result.current.addTask('Duracak', '', 'easy'))
    act(() => result.current.addTask('Gidecek', '', 'easy'))

    const gidecek = result.current.tasks.find((task) => task.title === 'Gidecek')!
    act(() => result.current.moveTask(gidecek.id, 'done'))
    act(() => result.current.clearDone())

    expect(result.current.tasks.map((task) => task.title)).toEqual(['Duracak'])
  })
})

describe('useTasks örnek veri', () => {
  it('örnek verileri yükler ve işaretini bildirir', () => {
    const { result } = renderHook(() => useTasks())

    expect(result.current.hasSamples).toBe(false)
    act(() => result.current.loadSamples())

    expect(result.current.hasSamples).toBe(true)
    expect(result.current.stats.total).toBeGreaterThan(0)
  })

  it('örnekleri silerken kullanıcının kendi görevine dokunmaz', () => {
    const { result } = renderHook(() => useTasks())
    act(() => result.current.addTask('Benim görevim', '', 'medium'))
    act(() => result.current.loadSamples())
    act(() => result.current.removeSamples())

    expect(result.current.tasks.map((task) => task.title)).toEqual(['Benim görevim'])
    expect(result.current.hasSamples).toBe(false)
  })
})

describe('useTasks sıralama ve kalıcılık', () => {
  it('zor görevleri listenin başına alır', () => {
    const { result } = renderHook(() => useTasks())
    act(() => result.current.addTask('Kolay iş', '', 'easy'))
    act(() => result.current.addTask('Orta iş', '', 'medium'))
    act(() => result.current.addTask('Zor iş', '', 'hard'))

    expect(result.current.sortedTasks.map((task) => task.title)).toEqual([
      'Zor iş',
      'Orta iş',
      'Kolay iş',
    ])
  })

  it('görevleri tarayıcı hafızasına yazar ve yeniden okur', () => {
    const first = renderHook(() => useTasks())
    act(() => first.result.current.addTask('Kalıcı görev', 'açıklama', 'hard'))

    const second = renderHook(() => useTasks())
    expect(second.result.current.tasks[0].title).toBe('Kalıcı görev')
  })

  it('görünüm tercihini değiştirebilir', () => {
    const { result } = renderHook(() => useTasks())

    expect(result.current.view).toBe('board')
    act(() => result.current.setView('list'))

    expect(result.current.view).toBe('list')
  })
})
