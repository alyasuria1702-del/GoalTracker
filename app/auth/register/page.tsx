'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function RegisterPage() {
  const supabase = createClient()
  const [form, setForm] = useState({ email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) { setError('Пароль должен содержать минимум 8 символов'); return }
    setLoading(true)
    const username = form.email.split('@')[0].replace(/[^a-z0-9_]/gi, '_').toLowerCase()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { full_name: form.full_name } },
    })
    if (signUpError) { setError('Ошибка регистрации. Попробуйте снова.'); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, username, full_name: form.full_name, avatar_url: null, created_at: new Date().toISOString() })
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Почти готово!</h2>
        <p className="text-gray-600 mb-6">Мы отправили письмо на <strong>{form.email}</strong>.<br />Проверьте email для подтверждения аккаунта.</p>
        <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium text-sm">Перейти ко входу →</Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Создать аккаунт</h2>
      <p className="text-sm text-gray-500 mb-6">Начните отслеживать свои цели уже сегодня</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Полное имя</label>
          <input type="text" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Иван Иванов" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="ivan@example.com" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Минимум 8 символов" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</p>}
        <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition text-sm">
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        Уже есть аккаунт? <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">Войти</Link>
      </p>
    </div>
  )
}
