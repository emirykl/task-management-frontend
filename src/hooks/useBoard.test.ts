import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useBoard } from './useBoard'

beforeEach(() => {
  window.localStorage.clear()
})

/** Testlerin çoğu bir projeyle başlar, bu yardımcı o hazırlığı yapar. */
function renderWithProject(name = 'Okul') {
  const view = renderHook(() => useBoard())
  act(() => view.result.current.addProject(name))
  return view
}

describe('useBoard projeler', () => {
  it('başlangıçta hiç proje yoktur', () => {
    const { result } = renderHook(() => useBoard())

    expect(result.current.projects).toEqual([])
    expect(result.current.activeProject).toBeNull()
  })

  it('yeni projeyi açar ve üzerine geçer', () => {
    const { result } = renderWithProject('Okul')

    expect(result.current.projects).toHaveLength(1)
    expect(result.current.activeProject?.name).toBe('Okul')
  })

  it('boş isimli projeyi yok sayar', () => {
    const { result } = renderHook(() => useBoard())
    act(() => result.current.addProject('   '))

    expect(result.current.projects).toEqual([])
  })

  it('projeler arasında geçiş yapar', () => {
    const { result } = renderWithProject('Okul')
    act(() => result.current.addProject('İş'))

    const okul = result.current.projects[0]
    act(() => result.current.selectProject(okul.id))

    expect(result.current.activeProject?.name).toBe('Okul')
  })

  it('proje adını değiştirir', () => {
    const { result } = renderWithProject('Okul')
    const id = result.current.projects[0].id

    act(() => result.current.renameProject(id, 'Bitirme projesi'))

    expect(result.current.activeProject?.name).toBe('Bitirme projesi')
  })

  it('projeyi silerken görevlerini de siler ve başka projeye geçer', () => {
    const { result } = renderWithProject('Okul')
    act(() => result.current.addTask('Okul görevi', '', 'easy'))
    act(() => result.current.addProject('İş'))

    const okul = result.current.projects[0]
    act(() => result.current.selectProject(okul.id))
    act(() => result.current.deleteProject(okul.id))

    expect(result.current.projects).toHaveLength(1)
    expect(result.current.activeProject?.name).toBe('İş')
    expect(result.current.stats.total).toBe(0)
  })

  it('son proje silinince karşılama durumuna döner', () => {
    const { result } = renderWithProject('Tek proje')
    const id = result.current.projects[0].id

    act(() => result.current.deleteProject(id))

    expect(result.current.activeProject).toBeNull()
  })

  it('her projenin görev sayısını ayrı tutar', () => {
    const { result } = renderWithProject('Okul')
    act(() => result.current.addTask('Okul görevi', '', 'easy'))
    act(() => result.current.addProject('İş'))
    act(() => result.current.addTask('İş görevi', '', 'hard'))

    const [okul, is] = result.current.projects
    expect(result.current.taskCountByProject[okul.id]).toBe(1)
    expect(result.current.taskCountByProject[is.id]).toBe(1)
  })
})

describe('useBoard görev ekleme', () => {
  it('yeni görevi açık projenin yapılacak sütununa koyar', () => {
    const { result } = renderWithProject()
    act(() => result.current.addTask('Sunumu hazırla', 'Slaytlar', 'medium'))

    expect(result.current.stats.total).toBe(1)
    expect(result.current.tasksByStatus.todo[0].title).toBe('Sunumu hazırla')
    expect(result.current.tasksByStatus.todo[0].projectId).toBe(
      result.current.activeProject?.id,
    )
  })

  it('boş başlıklı görevi yok sayar', () => {
    const { result } = renderWithProject()
    act(() => result.current.addTask('   ', 'açıklama', 'easy'))

    expect(result.current.stats.total).toBe(0)
  })

  it('başlık ve açıklamadaki fazla boşlukları kırpar', () => {
    const { result } = renderWithProject()
    act(() => result.current.addTask('  Rapor  ', '  detay  ', 'hard'))

    expect(result.current.tasks[0].title).toBe('Rapor')
    expect(result.current.tasks[0].description).toBe('detay')
  })

  it('görevleri projeler arasında karıştırmaz', () => {
    const { result } = renderWithProject('Okul')
    act(() => result.current.addTask('Okul görevi', '', 'easy'))
    act(() => result.current.addProject('İş'))

    expect(result.current.stats.total).toBe(0)
    expect(result.current.tasks).toEqual([])
  })
})

describe('useBoard güncelleme ve taşıma', () => {
  it('başlığı, açıklamayı ve zorluğu günceller', () => {
    const { result } = renderWithProject()
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
    const { result } = renderWithProject()
    act(() => result.current.addTask('Kalsın', '', 'medium'))

    const id = result.current.tasks[0].id
    act(() => result.current.updateTask(id, { title: '  ' }))

    expect(result.current.tasks[0].title).toBe('Kalsın')
  })

  it('görevi başka bir sütuna taşır ve sayaçları günceller', () => {
    const { result } = renderWithProject()
    act(() => result.current.addTask('Taşınacak', '', 'medium'))

    const id = result.current.tasks[0].id
    act(() => result.current.moveTask(id, 'done'))

    expect(result.current.stats.done).toBe(1)
    expect(result.current.stats.todo).toBe(0)
  })
})

describe('useBoard silme', () => {
  it('tek bir görevi siler', () => {
    const { result } = renderWithProject()
    act(() => result.current.addTask('Silinecek', '', 'easy'))

    const id = result.current.tasks[0].id
    act(() => result.current.deleteTask(id))

    expect(result.current.stats.total).toBe(0)
  })

  it('yalnızca açık projedeki biten görevleri temizler', () => {
    const { result } = renderWithProject('Okul')
    act(() => result.current.addTask('Duracak', '', 'easy'))
    act(() => result.current.addTask('Gidecek', '', 'easy'))

    const gidecek = result.current.tasks.find((task) => task.title === 'Gidecek')!
    act(() => result.current.moveTask(gidecek.id, 'done'))
    act(() => result.current.clearDone())

    expect(result.current.tasks.map((task) => task.title)).toEqual(['Duracak'])
  })
})

describe('useBoard örnek veri', () => {
  it('örnek verileri açık projeye yükler', () => {
    const { result } = renderWithProject()

    expect(result.current.hasSamples).toBe(false)
    act(() => result.current.loadSamples())

    expect(result.current.hasSamples).toBe(true)
    expect(result.current.stats.total).toBeGreaterThan(0)
  })

  it('örnekleri silerken kullanıcının kendi görevine dokunmaz', () => {
    const { result } = renderWithProject()
    act(() => result.current.addTask('Benim görevim', '', 'medium'))
    act(() => result.current.loadSamples())
    act(() => result.current.removeSamples())

    expect(result.current.tasks.map((task) => task.title)).toEqual(['Benim görevim'])
    expect(result.current.hasSamples).toBe(false)
  })
})

describe('useBoard sıralama, görünüm ve kalıcılık', () => {
  it('zor görevleri listenin başına alır', () => {
    const { result } = renderWithProject()
    act(() => result.current.addTask('Kolay iş', '', 'easy'))
    act(() => result.current.addTask('Orta iş', '', 'medium'))
    act(() => result.current.addTask('Zor iş', '', 'hard'))

    expect(result.current.sortedTasks.map((task) => task.title)).toEqual([
      'Zor iş',
      'Orta iş',
      'Kolay iş',
    ])
  })

  it('projeyi ve görevleri tarayıcı hafızasına yazıp geri okur', () => {
    const first = renderWithProject('Kalıcı proje')
    act(() => first.result.current.addTask('Kalıcı görev', 'açıklama', 'hard'))

    const second = renderHook(() => useBoard())
    expect(second.result.current.activeProject?.name).toBe('Kalıcı proje')
    expect(second.result.current.tasks[0].title).toBe('Kalıcı görev')
  })

  it('görünüm tercihini değiştirebilir', () => {
    const { result } = renderWithProject()

    expect(result.current.view).toBe('board')
    act(() => result.current.setView('list'))

    expect(result.current.view).toBe('list')
  })
})
