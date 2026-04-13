'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

const COLORS = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#14B8A6','#F97316']

export default function CategoryModal({ categories, userId, onSave, onDelete, onClose }) {
  const supabase = createClient()
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    const { data } = await supabase.from('categories').insert({ name: name.trim(), color, user_id: userId }).select().single()
    if (data) { onSave(data); setName('') }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    await supabase.from('categories').delete().eq('id', id)
    onDelete(id)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Категории</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          {categories.length > 0 && (
            <div className="space-y-2">
              {categories.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-sm font-medium text-gray-700">{c.name}</span>
                  </div>
                  <button onClick={() => handleDelete(c.id)} className="p-1 rounded text-gray-400 hover:text-red-500 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={handleAdd} className="space-y-3 pt-2 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700">Новая категория</p>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Название" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)} className={`w-7 h-7 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-1 ring-gray-400' : 'hover:scale-110'}`} style={{ backgroundColor: c }} />
              ))}
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition">
              {loading ? 'Создание...' : '+ Добавить'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
