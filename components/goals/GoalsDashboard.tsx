'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { isOverdue } from '@/lib/utils'
import { exportGoalsToPDF } from '@/lib/exportPDF'
import GoalModal from './GoalModal'
import CategoryModal from './CategoryModal'
import GoalCard from './GoalCard'
import CommentsModal from './CommentsModal'

export default function GoalsDashboard({ profile, initialGoals, initialCategories, userId }) {
  const supabase = createClient()
  const [goals, setGoals] = useState(initialGoals)
  const [categories, setCategories] = useState(initialCategories)
  const [filter, setFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [commentGoal, setCommentGoal] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [exporting, setExporting] = useState(false)

  const displayName = profile?.full_name?.split(' ')[0] || 'друг'
  const completed = goals.filter((g) => g.is_completed).length
  const total = goals.length
  const progressPct = total === 0 ? 0 : Math.round((completed / total) * 100)

  const filtered = useMemo(() => {
    let result = goals
    if (categoryFilter !== 'all') result = result.filter((g) => g.category_id === categoryFilter)
    if (filter === 'active') result = result.filter((g) => !g.is_completed && !isOverdue(g.deadline))
    if (filter === 'completed') result = result.filter((g) => g.is_completed)
    if (filter === 'overdue') result = result.filter((g) => isOverdue(g.deadline) && !g.is_completed)
    return result
  }, [goals, filter, categoryFilter])

  const handleToggle = async (goal) => {
    const { data } = await supabase.from('goals').update({ is_completed: !goal.is_completed }).eq('id', goal.id).select('*, categories(*)').single()
    if (data) setGoals((prev) => prev.map((g) => (g.id === goal.id ? data : g)))
  }

  const handleDelete = async (id) => {
    await supabase.from('goals').delete().eq('id', id)
    setGoals((prev) => prev.filter((g) => g.id !== id))
    setDeleteConfirm(null)
  }

  const handleSaveGoal = (goal) => {
    setGoals((prev) => {
      const exists = prev.find((g) => g.id === goal.id)
      return exists ? prev.map((g) => (g.id === goal.id ? goal : g)) : [goal, ...prev]
    })
    setShowGoalModal(false)
    setEditingGoal(null)
  }

  const handleSaveCategory = (cat) => {
    setCategories((prev) => {
      const exists = prev.find((c) => c.id === cat.id)
      return exists ? prev.map((c) => (c.id === cat.id ? cat : c)) : [...prev, cat]
    })
    setShowCategoryModal(false)
  }

  const handleExport = async () => {
    setExporting(true)
    await exportGoalsToPDF(goals, profile?.full_name || 'Пользователь')
    setExporting(false)
  }

  const handleShare = (goal) => {
    if (!goal.is_public) return
    navigator.clipboard.writeText(`${window.location.origin}/goals/${goal.id}`)
    alert('Ссылка скопирована!')
  }

  const filters = [
    { key: 'all', label: 'Все', count: goals.length },
    { key: 'active', label: 'Активные', count: goals.filter((g) => !g.is_completed && !isOverdue(g.deadline)).length },
    { key: 'completed', label: 'Выполненные', count: completed },
    { key: 'overdue', label: 'Просроченные', count: goals.filter((g) => isOverdue(g.deadline) && !g.is_completed).length },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Привет, {displayName}! 👋</h1>
            <p className="text-gray-500 text-sm mt-0.5">{total === 0 ? 'Начните с добавления первой цели' : `Выполнено ${completed} из ${total} целей`}</p>
          </div>
        </div>
        {total > 0 && (
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-medium text-gray-500">Прогресс</span>
              <span className="text-xs font-bold text-blue-600">{progressPct}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowGoalModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Добавить цель
          </button>
          <button onClick={() => setShowCategoryModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition">
            Категории
          </button>
        </div>
        <button onClick={handleExport} disabled={exporting || goals.length === 0} className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition disabled:opacity-50">
          {exporting ? 'Генерация...' : 'Скачать PDF'}
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-1">
          {filters.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${filter === f.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {f.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === f.key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>{f.count}</span>
            </button>
          ))}
        </div>
        {categories.length > 0 && (
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">Все категории</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          {total === 0 ? (
            <>
              <p className="text-gray-900 font-semibold mb-1">У вас ещё нет целей</p>
              <p className="text-gray-400 text-sm mb-4">Добавьте первую цель и начните путь к успеху!</p>
              <button onClick={() => setShowGoalModal(true)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition">+ Добавить цель</button>
            </>
          ) : (
            <p className="text-gray-400 text-sm">Нет целей в этой категории</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onToggle={() => handleToggle(goal)} onEdit={() => { setEditingGoal(goal); setShowGoalModal(true) }} onDelete={() => setDeleteConfirm(goal.id)} onComment={() => setCommentGoal(goal)} onShare={() => handleShare(goal)} />
          ))}
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Удалить цель?</h3>
            <p className="text-gray-500 text-sm text-center mb-6">Это действие нельзя отменить</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition">Отмена</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition">Да, удалить</button>
            </div>
          </div>
        </div>
      )}

      {showGoalModal && <GoalModal goal={editingGoal} categories={categories} userId={userId} onSave={handleSaveGoal} onClose={() => { setShowGoalModal(false); setEditingGoal(null) }} />}
      {showCategoryModal && <CategoryModal categories={categories} userId={userId} onSave={handleSaveCategory} onClose={() => setShowCategoryModal(false)} onDelete={(id) => setCategories((prev) => prev.filter((c) => c.id !== id))} />}
      {commentGoal && <CommentsModal goal={commentGoal} userId={userId} onClose={() => setCommentGoal(null)} />}
    </div>
  )
}
