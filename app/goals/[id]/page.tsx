import { createServerSupabase } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { formatDate, isOverdue } from '@/lib/utils'

export default async function PublicGoalPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabase()
  const { data: goal } = await supabase
    .from('goals').select('*, categories(*), profiles(full_name, username)')
    .eq('id', params.id).eq('is_public', true).single()

  if (!goal) notFound()

  const overdue = isOverdue(goal.deadline) && !goal.is_completed
  const profile = (goal as any).profiles

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <span className="font-bold text-gray-900">My Goals</span>
          <span className="ml-auto text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">Публичная цель</span>
        </div>
        <div className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full mb-4 ${goal.is_completed ? 'bg-green-100 text-green-700' : overdue ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
          {goal.is_completed ? '✓ Выполнено' : overdue ? '⚠ Просрочено' : '◯ В процессе'}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{goal.title}</h1>
        {goal.description && <p className="text-gray-600 text-sm mb-4">{goal.description}</p>}
        {goal.deadline && <p className="text-sm text-gray-500 mb-2">Дедлайн: {formatDate(goal.deadline)}</p>}
        {profile && <p className="text-sm text-gray-400 mt-6 pt-4 border-t border-gray-100">Автор: {profile.full_name || profile.username}</p>}
        <div className="mt-6 text-center">
          <a href="/auth/register" className="text-xs text-blue-600 hover:underline">Создать свой трекер целей →</a>
        </div>
      </div>
    </div>
  )
}
