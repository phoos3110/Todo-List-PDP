import type { Todo } from '../types'
import { isOverdue, isDueToday } from '../utils'

interface Props {
  todos: Todo[]
}

const StatCard = ({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent: string
}) => (
  <div className='flex-1 min-w-[70px] rounded-xl bg-white/5 backdrop-blur-md border border-white/10 px-3 py-2 text-center'>
    <div className={`text-xl font-bold ${accent}`}>{value}</div>
    <div className='text-[11px] text-slate-400 mt-0.5'>{label}</div>
  </div>
)

const StatsBar = ({ todos }: Props) => {
  const total = todos.length
  const done = todos.filter((t) => t.done).length
  const overdue = todos.filter(isOverdue).length
  const dueToday = todos.filter(isDueToday).length
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className='mb-5'>
      <div className='flex gap-2 mb-3'>
        <StatCard label='Tổng' value={total} accent='text-indigo-300' />
        <StatCard label='Hoàn thành' value={done} accent='text-emerald-300' />
        <StatCard label='Hôm nay' value={dueToday} accent='text-sky-300' />
        <StatCard label='Quá hạn' value={overdue} accent='text-rose-300' />
      </div>

      <div className='flex items-center gap-3'>
        <div className='flex-1 h-2.5 rounded-full bg-slate-800/80 overflow-hidden border border-white/5'>
          <div
            className='h-full rounded-full bg-linear-to-r from-indigo-400 via-sky-400 to-emerald-400 transition-all duration-500'
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className='text-xs font-semibold text-slate-300 tabular-nums w-10 text-right'>
          {percent}%
        </span>
      </div>
    </div>
  )
}

export default StatsBar
