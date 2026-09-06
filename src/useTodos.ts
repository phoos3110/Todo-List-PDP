import { useCallback, useEffect, useState } from 'react'
import type { Priority, Todo } from './types'
import { uid } from './utils'

const STORAGE_KEY = 'todos.v2'
const LEGACY_KEY = 'todos'

// Đọc dữ liệu, tự động migrate từ định dạng cũ (chỉ có text/done/id)
const loadTodos = (): Todo[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Todo[]
      if (Array.isArray(parsed)) return parsed
    }

    // Migrate từ localStorage cũ
    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const old = JSON.parse(legacy) as Array<{
        id: number
        text: string
        done: boolean
      }>
      if (Array.isArray(old)) {
        return old.map((t) => ({
          id: String(t.id),
          text: t.text,
          done: t.done,
          priority: 'medium' as Priority,
          category: 'Cá nhân',
          dueDate: null,
          notes: '',
          createdAt: typeof t.id === 'number' ? t.id : Date.now(),
          completedAt: t.done ? Date.now() : null,
        }))
      }
    }
  } catch {
    // bỏ qua lỗi parse
  }
  return []
}

export interface NewTodoInput {
  text: string
  priority: Priority
  category: string
  dueDate: string | null
  notes: string
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = useCallback((input: NewTodoInput) => {
    const text = input.text.trim()
    if (!text) return
    const newTodo: Todo = {
      id: uid(),
      text,
      done: false,
      priority: input.priority,
      category: input.category.trim() || 'Cá nhân',
      dueDate: input.dueDate,
      notes: input.notes.trim(),
      createdAt: Date.now(),
      completedAt: null,
    }
    setTodos((prev) => [newTodo, ...prev])
  }, [])

  const updateTodo = useCallback(
    (id: string, patch: Partial<Omit<Todo, 'id'>>) => {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      )
    },
    [],
  )

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toggleDone = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              done: !t.done,
              completedAt: !t.done ? Date.now() : null,
            }
          : t,
      ),
    )
  }, [])

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.done))
  }, [])

  const toggleAll = useCallback((done: boolean) => {
    setTodos((prev) =>
      prev.map((t) => ({
        ...t,
        done,
        completedAt: done ? t.completedAt ?? Date.now() : null,
      })),
    )
  }, [])

  const reorderTodos = useCallback((next: Todo[]) => {
    setTodos(next)
  }, [])

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleDone,
    clearCompleted,
    toggleAll,
    reorderTodos,
  }
}
