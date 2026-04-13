'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { getInitials, formatDate } from '@/lib/utils'

export default function ProfileClient({ profile, userEmail, goals, userId }) {
  const supabase = createClient()
  const fileRef = useRef(null)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const totalGoals = goals.length
  const completedGoals = goals.filter((g) => g.is_completed).length
  const lastActivity = goals.length > 0
    ? formatDate(goals.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at)
    : '—'

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${userId}/avatar.${ext}`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (uploadError) { setError('Ошибка загрузки фото'); setUploading(false); return }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    setAvatarUrl(data.publicUrl + '?t=' + Date.now())
    setUploading(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    const { error: updateError } = await supabase.from('profiles').update({ full_name: fullName.trim(), avatar_url: avatarUrl || null }).eq('id', userId)
    if (updateError) { setError('Ошибка сохранения'); setSaving(false); return }
    setSuccess('Профиль обновлён!')
    setTimeout(() => setSuccess(''), 3000)
    setSaving(false)
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Профиль</h1>
        <p className="text-sm text-gray-500 mt-1">Управляйте своими данными</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Всего целей', value: totalGoals, icon: '🎯' },
          { label: 'Выполнено', value: completedGoals, icon: '✅' },
          { label: 'Прогресс', value: totalGoals > 0 ? `${Math.round((completedGoals / totalGoals) * 100)}%` : '0%', icon: '📈' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Личные данные</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            {avatarUrl
              ? <img src={avatarUrl} alt="Аватар" className="w-18 h-18 w-[72px] h-[72px] rounded-2xl object-cover border-2 border-gray-100" />
              : <div className="w-[72px] h-[72px] rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">{getInitials(fullName || userEmail)}</div>
            }
            {uploading && <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>}
          </div>
          <div>
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition">
              {uploading ? 'Загрузка...' : 'Изменить фото'}
            </button>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG до 5 МБ</p>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Полное имя</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={userEmail} disabled className="w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50 text-gray-400 text-sm cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Последняя активность</label>
            <input value={lastActivity} disabled className="w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50 text-gray-400 text-sm cursor-not-allowed" />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</p>}
          {success && <p className="text-sm text-green-600 bg-green-50 rounded-xl px-4 py-2">✓ {success}</p>}
          <button type="submit" disabled={saving} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition">
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </form>
      </div>
    </div>
  )
}
