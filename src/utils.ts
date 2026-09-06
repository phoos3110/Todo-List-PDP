import type { Priority, Todo } from './types'

export const PRIORITY_META: Record<
  Priority,
  { label: string; color: string; ring: string; weight: number; dot: string }
> = {
  high: {
    label: 'Cao',
    color: 'text-rose-300',
    ring: 'ring-rose-400/40',
    weight: 3,
    dot: '#fb7185',
  },
  medium: {
    label: 'Trung bình',
    color: 'text-amber-300',
    ring: 'ring-amber-400/40',
    weight: 2,
    dot: '#fbbf24',
  },
  low: {
    label: 'Thấp',
    color: 'text-emerald-300',
    ring: 'ring-emerald-400/40',
    weight: 1,
    dot: '#34d399',
  },
}

export const DEFAULT_CATEGORIES: string[] = [
  'Cá nhân',
  'Công việc',
  'Học tập',
  'Mua sắm',
  'Sức khỏe',
]

// Bảng màu ổn định cho category (hash tên -> màu)
const CATEGORY_PALETTE = [
  '#a78bfa',
  '#60a5fa',
  '#38bdf8',
  '#2dd4bf',
  '#34d399',
  '#fbbf24',
  '#fb7185',
  '#f472b6',
  '#c084fc',
  '#818cf8',
]

export const categoryColor = (name: string): string => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i)
    hash |= 0
  }
  return CATEGORY_PALETTE[Math.abs(hash) % CATEGORY_PALETTE.length]
}

export const uid = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

export const todayISO = (): string => {
  const d = new Date()
  const off = d.getTimezoneOffset()
  const local = new Date(d.getTime() - off * 60 * 1000)
  return local.toISOString().slice(0, 10)
}

export const isOverdue = (todo: Todo): boolean => {
  if (!todo.dueDate || todo.done) return false
  return todo.dueDate < todayISO()
}

export const isDueToday = (todo: Todo): boolean => {
  if (!todo.dueDate || todo.done) return false
  return todo.dueDate === todayISO()
}

// Định dạng hạn chót thân thiện: Hôm nay / Ngày mai / Quá hạn N ngày ...
export const formatDueDate = (
  dueDate: string | null,
): { text: string; tone: 'overdue' | 'today' | 'soon' | 'normal' } | null => {
  if (!dueDate) return null
  const today = new Date(todayISO() + 'T00:00:00')
  const due = new Date(dueDate + 'T00:00:00')
  const diffDays = Math.round(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  )

  if (diffDays < 0)
    return {
      text: `Quá hạn ${Math.abs(diffDays)} ngày`,
      tone: 'overdue',
    }
  if (diffDays === 0) return { text: 'Hôm nay', tone: 'today' }
  if (diffDays === 1) return { text: 'Ngày mai', tone: 'soon' }
  if (diffDays <= 7) return { text: `Còn ${diffDays} ngày`, tone: 'soon' }

  const formatted = due.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  return { text: formatted, tone: 'normal' }
}

export const formatRelativeTime = (ts: number): string => {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'vừa xong'
  if (mins < 60) return `${mins} phút trước`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} ngày trước`
  return new Date(ts).toLocaleDateString('vi-VN')
}
