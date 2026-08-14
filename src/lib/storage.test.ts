import { beforeEach, describe, expect, it } from 'vitest'
import type { BoardState, Project } from '../interfaces/project'
import type { Task } from '../interfaces/task'
import { loadBoard, saveBoard } from './storage'

const BOARD_KEY = 'panolo:board'
const LEGACY_TASKS_KEY = 'gorev-panosu:tasks'

function writeBoard(value: unknown) {
  window.localStorage.setItem(BOARD_KEY, JSON.stringify(value))
}

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'proje-1',
    name: 'Okul',
    createdAt: '2026-08-14T09:00:00.000Z',
    ...overrides,
  }
}

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'gorev-1',
    projectId: 'proje-1',
    title: 'Sunumu hazırla',
    description: 'Slaytları gözden geçir',
    status: 'todo',
    difficulty: 'medium',
    isSample: false,
    createdAt: '2026-08-14T10:00:00.000Z',
    ...overrides,
  }
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('loadBoard boş ve bozuk durumlar', () => {
  it('hiç kayıt yokken boş pano döner', () => {
    expect(loadBoard()).toEqual({ projects: [], tasks: [], activeProjectId: null })
  })

  it('bozuk JSON karşısında çökmeden boş pano döner', () => {
    window.localStorage.setItem(BOARD_KEY, '{bozuk json')
    expect(loadBoard().projects).toEqual([])
  })

  it('proje kalmamışsa görevleri de taşımaz', () => {
    writeBoard({ projects: [], tasks: [makeTask()], activeProjectId: 'proje-1' })
    expect(loadBoard()).toEqual({ projects: [], tasks: [], activeProjectId: null })
  })
})

describe('loadBoard doğrulama', () => {
  it('adı olmayan projeleri eler', () => {
    writeBoard({
      projects: [makeProject(), { id: 'proje-2', name: '   ' }, null],
      tasks: [],
      activeProjectId: 'proje-1',
    })

    expect(loadBoard().projects).toHaveLength(1)
  })

  it('geçersiz görevleri eler, geçerli olanları korur', () => {
    writeBoard({
      projects: [makeProject()],
      tasks: [makeTask(), { id: 'eksik' }, 42],
      activeProjectId: 'proje-1',
    })

    const board = loadBoard()
    expect(board.tasks).toHaveLength(1)
    expect(board.tasks[0].title).toBe('Sunumu hazırla')
  })

  it('projesi bulunmayan görevi ilk projeye bağlar', () => {
    writeBoard({
      projects: [makeProject({ id: 'proje-a' })],
      tasks: [makeTask({ projectId: 'silinmis-proje' })],
      activeProjectId: 'proje-a',
    })

    expect(loadBoard().tasks[0].projectId).toBe('proje-a')
  })

  it('tanınmayan aktif proje kimliğini ilk projeye çevirir', () => {
    writeBoard({
      projects: [makeProject({ id: 'proje-a' }), makeProject({ id: 'proje-b' })],
      tasks: [],
      activeProjectId: 'olmayan',
    })

    expect(loadBoard().activeProjectId).toBe('proje-a')
  })

  it('bilinmeyen bir zorluk değeri geldiğinde orta seviyeye düşer', () => {
    writeBoard({
      projects: [makeProject()],
      tasks: [{ ...makeTask(), difficulty: 'imkansiz' }],
      activeProjectId: 'proje-1',
    })

    expect(loadBoard().tasks[0].difficulty).toBe('medium')
  })
})

describe('loadBoard eski kayıtlardan göç', () => {
  it('projesiz görevleri Genel projesine taşır', () => {
    window.localStorage.setItem(
      LEGACY_TASKS_KEY,
      JSON.stringify([
        { ...makeTask({ id: 'a' }), projectId: undefined },
        { ...makeTask({ id: 'b' }), projectId: undefined },
      ]),
    )

    const board = loadBoard()
    expect(board.projects).toHaveLength(1)
    expect(board.projects[0].name).toBe('Genel')
    expect(board.tasks).toHaveLength(2)
    expect(board.tasks[0].projectId).toBe(board.projects[0].id)
    expect(board.activeProjectId).toBe(board.projects[0].id)
  })

  it('göç sırasında eski priority alanını difficulty değerine çevirir', () => {
    window.localStorage.setItem(
      LEGACY_TASKS_KEY,
      JSON.stringify([{ ...makeTask(), difficulty: undefined, priority: 'high' }]),
    )

    expect(loadBoard().tasks[0].difficulty).toBe('hard')
  })

  it('eski kayıt da boşsa boş pano döner', () => {
    window.localStorage.setItem(LEGACY_TASKS_KEY, JSON.stringify([]))
    expect(loadBoard().projects).toEqual([])
  })
})

describe('saveBoard', () => {
  it('yazdığı panoyu aynı şekilde geri okur', () => {
    const board: BoardState = {
      projects: [makeProject()],
      tasks: [makeTask()],
      activeProjectId: 'proje-1',
    }
    saveBoard(board)

    expect(loadBoard()).toEqual(board)
  })

  it('eski kayıt dururken bile yeni panoyu tercih eder', () => {
    window.localStorage.setItem(LEGACY_TASKS_KEY, JSON.stringify([makeTask()]))
    saveBoard({
      projects: [makeProject({ id: 'yeni', name: 'İş' })],
      tasks: [],
      activeProjectId: 'yeni',
    })

    const board = loadBoard()
    expect(board.projects[0].name).toBe('İş')
    expect(board.tasks).toEqual([])
  })
})
