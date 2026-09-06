import type { FilterStatus, SortKey } from '../types'

interface Props {
  search: string
  onSearch: (v: string) => void
  status: FilterStatus
  onStatus: (v: FilterStatus) => void
  category: string
  onCategory: (v: string) => void
  categories: string[]
  sort: SortKey
  onSort: (v: SortKey) => void
}

const STATUS_TABS: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'active', label: 'Đang làm' },
  { key: 'completed', label: 'Hoàn thành' },
  { key: 'overdue', label: 'Quá hạn' },
]

const Toolbar = ({
  search,
  onSearch,
  status,
  onStatus,
  category,
  onCategory,
  categories,
  sort,
  onSort,
}: Props) => {
  return (
    <div className='mb-4 space-y-3'>
      {/* Tìm kiếm */}
      <div className='relative'>
        <svg
          className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z'
          />
        </svg>
        <input
          type='text'
          placeholder='Tìm công việc, ghi chú...'
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className='w-full pl-9 pr-8 py-2 rounded-lg bg-slate-900/50 text-white placeholder-slate-500 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400'
        />
        {search && (
          <button
            onClick={() => onSearch('')}
            className='absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer'
            aria-label='Xóa tìm kiếm'
          >
            ✕
          </button>
        )}
      </div>

      {/* Tabs trạng thái */}
      <div className='flex gap-1 p-1 rounded-lg bg-slate-900/50 border border-slate-800'>
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => onStatus(t.key)}
            className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              status === t.key
                ? 'bg-indigo-500/90 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Lọc danh mục + sắp xếp */}
      <div className='flex gap-2'>
        <select
          value={category}
          onChange={(e) => onCategory(e.target.value)}
          className='flex-1 px-2.5 py-1.5 rounded-lg text-xs bg-slate-900/50 text-slate-200 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer'
        >
          <option value='all'>Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => onSort(e.target.value as SortKey)}
          className='flex-1 px-2.5 py-1.5 rounded-lg text-xs bg-slate-900/50 text-slate-200 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer'
        >
          <option value='created'>Mới nhất</option>
          <option value='dueDate'>Theo hạn chót</option>
          <option value='priority'>Theo ưu tiên</option>
          <option value='alpha'>Theo bảng chữ cái</option>
        </select>
      </div>
    </div>
  )
}

export default Toolbar
