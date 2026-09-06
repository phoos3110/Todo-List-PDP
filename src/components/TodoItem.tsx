import { useEffect, useRef, useState } from 'react'
import type { Priority, Todo } from '../types'
import {
  PRIORITY_META,
  categoryColor,
  formatDueDate,
  formatRelativeTime,
  isOverdue,
  todayISO,
} from '../utils'

interface Props {
  todo: Todo
  categories: string[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, patch: Partial<Omit<Todo, 'id'>>) => void
}

const TodoItem = ({
  todo,
  categories,
  onToggle,
  onDelete,
  onUpdate,
}: Props) => {
  const [editing, setEditing] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [draft, setDraft] = useState(todo)
  const editRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      setDraft(todo)
      editRef.current?.focus()
    }
  }, [editing, todo])

  const overdue = isOverdue(todo)
  const due = formatDueDate(todo.dueDate)
  const meta = PRIORITY_META[todo.priority]
  const catColor = categoryColor(todo.category)

  const saveEdit = () => {
    if (draft.text.trim() === '') return
    onUpdate(todo.id, {
      text: draft.text.trim(),
      priority: draft.priority,
      category: draft.category,
      dueDate: draft.dueDate || null,
      notes: draft.notes.trim(),
    })
    setEditing(false)
  }

  const dueToneClass =
    due?.tone === 'overdue'
      ? 'text-rose-300 bg-rose-500/10 border-rose-400/20'
      : due?.tone === 'today'
        ? 'text-sky-300 bg-sky-500/10 border-sky-400/20'
        : due?.tone === 'soon'
          ? 'text-amber-300 bg-amber-500/10 border-amber-400/20'
          : 'text-slate-400 bg-white/5 border-white/10'

  if (editing) {
    return (
      <li className='rounded-xl bg-slate-900/70 backdrop-blur-md border border-indigo-400/30 p-3 shadow-lg shadow-black/40'>
        <input
          ref={editRef}
          value={draft.text}
          onChange={(e) => setDraft({ ...draft, text: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit()
            if (e.key === 'Escape') setEditing(false)
          }}
          className='w-full px-3 py-2 rounded-lg bg-slate-900/60 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2'
        />
        <div className='flex flex-wrap gap-2 mb-2'>
          <div className='flex gap-1'>
            {(Object.keys(PRIORITY_META) as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setDraft({ ...draft, priority: p })}
                className={`px-2 py-1 rounded-md text-xs border cursor-pointer transition ${
                  draft.priority === p
                    ? `bg-white/10 border-white/20 ${PRIORITY_META[p].color}`
                    : 'border-slate-700 text-slate-400'
                }`}
              >
                {PRIORITY_META[p].label}
              </button>
            ))}
          </div>
          <select
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            className='px-2 py-1 rounded-md text-xs bg-slate-900/60 text-slate-200 border border-slate-700 cursor-pointer'
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type='date'
            value={draft.dueDate ?? ''}
            min={todayISO()}
            onChange={(e) =>
              setDraft({ ...draft, dueDate: e.target.value || null })
            }
            className='px-2 py-1 rounded-md text-xs bg-slate-900/60 text-slate-200 border border-slate-700 cursor-pointer [color-scheme:dark]'
          />
        </div>
        <textarea
          value={draft.notes}
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
          placeholder='Ghi chú...'
          rows={2}
          className='w-full px-3 py-2 rounded-lg text-sm bg-slate-900/60 text-slate-200 placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none mb-2'
        />
        <div className='flex gap-2 justify-end'>
          <button
            onClick={() => setEditing(false)}
            className='px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/5 cursor-pointer'
          >
            Hủy
          </button>
          <button
            onClick={saveEdit}
            className='px-3 py-1.5 rounded-lg text-xs bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer'
          >
            Lưu
          </button>
        </div>
      </li>
    )
  }

  return (
    <li
      className={`group relative rounded-xl bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md border rounded-l-none border-white/10 shadow-lg shadow-black/30 transition-colors ${
        overdue ? 'border-l-0' : ''
      }`}
      style={{ borderLeft: `3px solid ${meta.dot}` }}
    >
      <div className='flex items-start gap-3 px-3 py-3 pl-3.5'>
        <button
          onClick={() => onToggle(todo.id)}
          className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition cursor-pointer ${
            todo.done
              ? 'bg-emerald-500 border-emerald-500'
              : 'border-slate-500 hover:border-indigo-400'
          }`}
          aria-label={todo.done ? 'Bỏ hoàn thành' : 'Đánh dấu hoàn thành'}
        >
          {todo.done && (
            <svg
              className='w-3 h-3 text-white'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={3}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M5 13l4 4L19 7'
              />
            </svg>
          )}
        </button>

        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between gap-2'>
            <span
              onDoubleClick={() => setEditing(true)}
              className={`break-words leading-snug ${
                todo.done
                  ? 'line-through text-slate-500'
                  : overdue
                    ? 'text-rose-100'
                    : 'text-slate-100'
              }`}
            >
              {todo.text}
            </span>
          </div>

          {/* Chips */}
          <div className='flex flex-wrap items-center gap-1.5 mt-2'>
            <span
              className='px-2 py-0.5 rounded-full text-[10px] font-medium border'
              style={{
                color: catColor,
                borderColor: `${catColor}33`,
                background: `${catColor}14`,
              }}
            >
              {todo.category}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium border border-white/10 bg-white/5 ${meta.color}`}
            >
              {meta.label}
            </span>
            {due && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${dueToneClass}`}
              >
                📅 {due.text}
              </span>
            )}
            {todo.notes && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className='px-2 py-0.5 rounded-full text-[10px] font-medium border border-white/10 bg-white/5 text-slate-400 hover:text-slate-200 cursor-pointer'
              >
                📝 Ghi chú {expanded ? '▲' : '▼'}
              </button>
            )}
          </div>

          {expanded && todo.notes && (
            <p className='mt-2 text-xs text-slate-400 whitespace-pre-wrap bg-slate-900/40 rounded-lg p-2 border border-white/5'>
              {todo.notes}
            </p>
          )}

          <div className='mt-1.5 text-[10px] text-slate-600'>
            {todo.done && todo.completedAt
              ? `Hoàn thành ${formatRelativeTime(todo.completedAt)}`
              : `Tạo ${formatRelativeTime(todo.createdAt)}`}
          </div>
        </div>

        {/* Actions */}
        <div className='flex items-center gap-1 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity'>
          <button
            onClick={() => setEditing(true)}
            className='p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-white/5 cursor-pointer'
            aria-label='Sửa'
            title='Sửa'
          >
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className='p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-white/5 cursor-pointer'
            aria-label='Xóa'
            title='Xóa'
          >
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
              />
            </svg>
          </button>
        </div>
      </div>
    </li>
  )
}

export default TodoItem
