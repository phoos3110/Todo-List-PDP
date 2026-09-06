import { useMemo, useRef, useState } from 'react'
import MouseTrail from './MouseTrail'
import StatsBar from './components/StatsBar'
import AddTodoForm from './components/AddTodoForm'
import Toolbar from './components/Toolbar'
import TodoItem from './components/TodoItem'
import { useTodos } from './useTodos'
import type { FilterStatus, SortKey, Todo } from './types'
import { DEFAULT_CATEGORIES, PRIORITY_META, isOverdue } from './utils'

const App = () => {
  const {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleDone,
    clearCompleted,
    toggleAll,
  } = useTodos()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<FilterStatus>('all')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState<SortKey>('created')
  const fileRef = useRef<HTMLInputElement>(null)

  // Tổng hợp danh mục: mặc định + do người dùng tạo
  const categories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES)
    todos.forEach((t) => set.add(t.category))
    return Array.from(set)
  }, [todos])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = todos.filter((t) => {
      if (q && !t.text.toLowerCase().includes(q) && !t.notes.toLowerCase().includes(q))
        return false
      if (category !== 'all' && t.category !== category) return false
      if (status === 'active' && t.done) return false
      if (status === 'completed' && !t.done) return false
      if (status === 'overdue' && !isOverdue(t)) return false
      return true
    })

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'dueDate': {
          if (!a.dueDate && !b.dueDate) return b.createdAt - a.createdAt
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return a.dueDate.localeCompare(b.dueDate)
        }
        case 'priority':
          return (
            PRIORITY_META[b.priority].weight - PRIORITY_META[a.priority].weight
          )
        case 'alpha':
          return a.text.localeCompare(b.text, 'vi')
        case 'created':
        default:
          return b.createdAt - a.createdAt
      }
    })

    // Việc chưa xong luôn ưu tiên hiện trước (trừ khi lọc completed)
    if (status === 'all') {
      list.sort((a, b) => Number(a.done) - Number(b.done))
    }
    return list
  }, [todos, search, category, status, sort])

  const completedCount = todos.filter((t) => t.done).length
  const allDone = todos.length > 0 && completedCount === todos.length

  // Export dữ liệu ra file JSON
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(todos, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `todo-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Import từ file JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as Todo[]
        if (Array.isArray(data)) {
          const existing = new Set(todos.map((t) => t.id))
          data.forEach((t) => {
            if (t && t.id && !existing.has(t.id)) {
              addTodo({
                text: t.text,
                priority: t.priority ?? 'medium',
                category: t.category ?? 'Cá nhân',
                dueDate: t.dueDate ?? null,
                notes: t.notes ?? '',
              })
            }
          })
          alert('Đã nhập dữ liệu thành công!')
        }
      } catch {
        alert('File không hợp lệ.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 pb-20'>
      <MouseTrail />
      <div className='max-w-lg mx-auto pt-10 md:pt-16 px-4'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-2xl font-bold bg-linear-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent'>
              ✦ Danh sách công việc
            </h1>
            <p className='text-xs text-slate-500 mt-0.5'>
              Sắp xếp cuộc sống của bạn, từng việc một
            </p>
          </div>
          <div className='flex gap-1'>
            <button
              onClick={handleExport}
              title='Sao lưu (JSON)'
              className='p-2 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-white/5 cursor-pointer'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                />
              </svg>
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              title='Khôi phục từ file'
              className='p-2 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-white/5 cursor-pointer'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
                />
              </svg>
            </button>
            <input
              ref={fileRef}
              type='file'
              accept='application/json'
              onChange={handleImport}
              className='hidden'
            />
          </div>
        </div>

        <StatsBar todos={todos} />
        <AddTodoForm onAdd={addTodo} categories={categories} />
        <Toolbar
          search={search}
          onSearch={setSearch}
          status={status}
          onStatus={setStatus}
          category={category}
          onCategory={setCategory}
          categories={categories}
          sort={sort}
          onSort={setSort}
        />

        {/* Bulk actions */}
        {todos.length > 0 && (
          <div className='flex items-center justify-between mb-3 px-1'>
            <label className='flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none'>
              <input
                type='checkbox'
                checked={allDone}
                onChange={(e) => toggleAll(e.target.checked)}
                className='accent-indigo-500 cursor-pointer'
              />
              {allDone ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </label>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className='text-xs text-rose-400 hover:text-rose-300 cursor-pointer'
              >
                Xóa {completedCount} việc đã hoàn thành
              </button>
            )}
          </div>
        )}

        {/* Danh sách */}
        <ul className='space-y-2.5'>
          {filtered.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              categories={categories}
              onToggle={toggleDone}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          ))}
        </ul>

        {/* Empty states */}
        {todos.length === 0 && (
          <div className='text-center mt-12'>
            <div className='text-5xl mb-3'>🌊</div>
            <p className='text-slate-400 font-medium'>Chưa có công việc nào</p>
            <p className='text-slate-600 text-sm mt-1'>
              Thêm việc đầu tiên để bắt đầu nhé!
            </p>
          </div>
        )}

        {todos.length > 0 && filtered.length === 0 && (
          <div className='text-center mt-10'>
            <div className='text-4xl mb-2'>🔍</div>
            <p className='text-slate-400'>Không tìm thấy công việc phù hợp</p>
            <button
              onClick={() => {
                setSearch('')
                setStatus('all')
                setCategory('all')
              }}
              className='mt-2 text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer'
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        <footer className='text-center text-[11px] text-slate-600 mt-10'>
          Dữ liệu được lưu trên trình duyệt của bạn · Nhấp đúp vào công việc để
          sửa nhanh
        </footer>
      </div>
    </div>
  )
}

export default App
