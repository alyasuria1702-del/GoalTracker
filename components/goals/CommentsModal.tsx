'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

export default function CommentsModal({ goal, userId, onClose }) {
  const supabase = createClient()
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('goal_comments').select('*').eq('goal_id', goal.id).order('created_at').then(({ data }) => {
      setComments(data || [])
      setLoading(false)
    })
  }, [goal.id])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setSaving(true)
    const { data } = await supabase.from('goal_comments').insert({ goal_id: goal.id, user_id: userId, content: text.trim() }).select().single()
    if (data) setComments((prev) => [...prev, data])
    setText('')
    setSaving(false)
  }

  const handleDelete = async (id) => {
    await supabase.from('goal_comments').delete().eq('id', id)
    setComments((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Заметки</h2>
            <p className="text-xs text-gray-400 truncate max-w-[250px]">{goal.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? <p className="text-sm text-gray-400 text-center py-8">Загрузка...</p>
          : comments.length === 0 ? <p className="text-gray-400 text-sm text-center py-8">Нет заметок</p>
          : comments.map((c) => (
            <div key={c.id} className="group bg-gray-50 rounded-xl p-3">
              <div className="flex justify-between items-start gap-2">
                <p className="text-sm text-gray-800">{c.content}</p>
                <button onClick={() => handleDelete(c.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">{formatDate(c.created_at)}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleAdd} className="p-4 border-t border-gray-100 flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Добавить заметку..." className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" disabled={saving || !text.trim()} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-xl transition">OK</button>
        </form>
      </div>
    </div>
  )
}
