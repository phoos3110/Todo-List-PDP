import { useEffect, useRef, useState } from 'react'
import MouseTrail from './MouseTrail'

interface Todo {
  id: number
  text: string
  done: boolean
}

const App = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const data = localStorage.getItem('todos')
    return data ? JSON.parse(data) : []
  })

  const [inputValue, setInputValue] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addTodo = () => {
    if (inputValue.trim() === '') return

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      done: false,
    }

    setTodos((prev) => [...prev, newTodo])
    setInputValue('')
    inputRef.current?.focus()
  }

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const toggleDone = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    )
  }

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const todoNotDone = todos.filter((todo) => !todo.done)

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900'>
      <MouseTrail />
      <div className='max-w-md mx-auto pt-16 md:pt-24 px-4'>
        <h1 className='text-2xl font-bold text-white mb-6 text-center'>
          Todo List
        </h1>

        <div className='flex gap-2 mb-4'>
          <input
            ref={inputRef}
            type='text'
            placeholder='Nhập công việc...'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTodo()
            }}
            className='flex-1 px-3 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400'
          />
          <button
            onClick={addTodo}
            className='px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer whitespace-nowrap'
          >
            Thêm
          </button>
        </div>

        <ul className='space-y-3'>
          {todos.map((todo) => (
            <li
              key={todo.id}
              className='group flex items-center justify-between bg-white/0 hover:bg-white/3 backdrop-blur-md border border-white/0 rounded-lg shadow-lg shadow-black/40 px-4 py-3 transition-colors'
            >
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={todo.done}
                  onChange={() => toggleDone(todo.id)}
                  className='accent-indigo-500'
                />
                <span
                  className={`${
                    todo.done ? 'line-through text-slate-500' : 'text-slate-100'
                  }`}
                >
                  {todo.text}
                </span>
              </div>

              <button
                onClick={() => deleteTodo(todo.id)}
                className='text-red-400 hover:text-red-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity'
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className='text-center text-slate-500 mt-8'>
            Chưa có công việc nào, thêm ngay nhé!
          </p>
        )}

        {todoNotDone.length > 0 && (
          <p className='mt-4 text-slate-400 text-sm'>
            {`Còn lại ${todoNotDone.length} công việc chưa hoàn thành`}
          </p>
        )}
      </div>
    </div>
  )
}

export default App
