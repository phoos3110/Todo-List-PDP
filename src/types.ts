export type Priority = 'low' | 'medium' | 'high'

export interface Todo {
  id: string
  text: string
  done: boolean
  priority: Priority
  category: string
  dueDate: string | null // ISO date (yyyy-mm-dd) hoặc null
  notes: string
  createdAt: number
  completedAt: number | null
}

export type FilterStatus = 'all' | 'active' | 'completed' | 'overdue'

export type SortKey = 'created' | 'dueDate' | 'priority' | 'alpha'

export interface Category {
  name: string
  color: string // tailwind text/bg gợi ý, dùng hex
}
