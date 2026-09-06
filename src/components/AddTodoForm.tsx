import { useRef, useState } from 'react'
import type { Priority } from '../types'
import type { NewTodoInput } from '../useTodos'
import { PRIORITY_META, todayISO } from '../utils'

interface Props {
  onAdd: (input: NewTodoInput) => void
  categories: string[]
}

const AddTodoForm = ({ onAdd, categories }: Props) => {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [category, setCategory] = useState(categories[0] ?? 'Cá nhân')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = () => {
    if (text.trim() === '') {
      inputRef.current?.focus()
      return
    }
    onAdd({
      text,
      priority,
      category,
      dueDate: dueDate || null,
      notes,
    })
    setText('')
    setNotes('')
    setDueDate('')
    setPriority('medium')
    setExpanded(false)
    inputRef.current?.focus()
  }

  return (
    <div className='rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-3 mb-5 shadow-lg shadow-black/30'>
      <div className='flex gap-2'>
        <input
          ref={inputRef}
          type='text'
          placeholder='Bạn cần làm gì?'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setExpanded(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
          className='flex-1 px-3 py-2.5 rounded-lg bg-slate-900/60 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400'
        />
        <button
          onClick={submit}
          className='px-4 py-2.5 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 active:scale-95 transition cursor-pointer whitespace-nowrap'
        >
          + Thêm
        </button>
      </div>

      <div
        className={`grid transition-all duration-300 ${
          expanded
            ? 'grid-rows-[1fr] opacity-100 mt-3'
            : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className='overflow-hidden'>
          <div className='flex flex-wrap gap-2 items-center'>
            {/* Ưu tiên */}
            <div className='flex gap-1'>
              {(Object.keys(PRIORITY_META) as Priority[]).map((p) => (
                <button
                  key={p}
                  type='button'
                  onClick={() => setPriority(p)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                    priority === p
                      ? `bg-white/10 border-white/20 ${PRIORITY_META[p].color}`
                      : 'bg-transparent border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span
                    className='inline-block w-2 h-2 rounded-full mr-1.5 align-middle'
                    style={{ background: PRIORITY_META[p].dot }}
                  />
                  {PRIORITY_META[p].label}
                </button>
              ))}
            </div>

            {/* Danh mục */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='px-2.5 py-1.5 rounded-lg text-xs bg-slate-900/60 text-slate-200 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer'
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Hạn chót */}
            <input
              type='date'
              value={dueDate}
              min={todayISO()}
              onChange={(e) => setDueDate(e.target.value)}
              className='px-2.5 py-1.5 rounded-lg text-xs bg-slate-900/60 text-slate-200 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer [color-scheme:dark]'
            />
          </div>

          <textarea
            placeholder='Ghi chú (không bắt buộc)...'
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className='w-full mt-2 px-3 py-2 rounded-lg text-sm bg-slate-900/60 text-slate-200 placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none'
          />
        </div>
      </div>
    </div>
  )
}

export default AddTodoForm
