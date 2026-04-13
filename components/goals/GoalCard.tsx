'use client'

import { cn, isOverdue, formatDateShort } from '@/lib/utils'

export default function GoalCard({ goal, onToggle, onEdit, onDelete, onComment, onShare }) {
  const overdue = isOverdue(goal.deadline) && !goal.is_completed

  return (
    <div className={cn('bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 p-4 group', overdue ? 'border-red-200 bg-red-50/30' : 'border-gray-100', goal.is_completed ? 'opacity-75' : '')}>
      <div className="flex items-start gap-3">
        <button onClick={onToggle} className={cn('flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all', goal.is_completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-blue-400')}>
          {goal.is_completed && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn('text-sm font-semibold text-gray-900 leading-snug', goal.is_completed && 'line-through text-gray-400')}>{goal.title}</h3>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button onClick={onComment} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </button>
              {goal.is_public && (
                <button onClick={onShare} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-green-600 transition">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                </button>
              )}
              <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
          {goal.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{goal.description}</p>}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {goal.categories && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${goal.categories.color}20`, color: goal.categories.color }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: goal.categories.color }} />
                {goal.categories.name}
              </span>
            )}
            {goal.deadline && (
              <span className={cn('inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full', overdue ? 'bg-red-100 text-red-600' : goal.is_completed ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600')}>
                {overdue ? '⚠ ' : ''}{formatDateShort(goal.deadline)}
              </span>
            )}
            {goal.is_completed && <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-600">✓ Выполнено</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
