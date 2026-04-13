'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function GoalModal({ goal, categories, userId, onSave, onClose }) {
  const supabase = createClient()
  const [form, setForm] = useState({ title: goal?.title || '', description: goal?.description || '', deadline: goal?.deadline || '', category_id: goal?.category_id || '', is_public: goal?.is_public || false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Введите заголовок цели'); return }
    setLoading(true)
    const payload = { title: form.title.trim(), description: form.description.trim() || null, deadline: form.deadline || null, category_id: form.category_id || null, is_public: form.is_public, user_id: userId }
    if (goal) {
      const { data, error: err } = await supabase.from('goals').update(payload).eq('id', goal.id).select('*, categories(*)').single()
      if (err) { setError('Ошибка при сохранении'); setLoading(false); return }
      onSave(data)
    } else {
      const { data, error: err } = await supabase.from('goals').insert({ ...payload, is_completed: false }).select('*, categories(*)').single()
      if (err) { setError('Ошибка при создании'); setLoading(false); return }
      onSave(data)
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{goal ? 'Редактировать цель' : 'Новая цель'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Например: Прочитать 12 книг за год" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Детали, заметки..." rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дедлайн</label>
              <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option value="">Без категории</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => setForm({ ...form, is_public: !form.is_public })} className={`relative w-10 h-5 rounded-full transition-colors ${form.is_public ? 'bg-blue-600' : 'bg-gray-200'}`}>
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_public ? 'translate-x-5' : ''}`} />
            </div>
            <span className="text-sm text-gray-700">Публичная цель</span>
          </label>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition">Отмена</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition">{loading ? 'Сохранение...' : 'Сохранить'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
