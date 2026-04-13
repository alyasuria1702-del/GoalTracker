import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ProfileClient from '@/components/layout/ProfileClient'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/auth/login')

  const [{ data: profile }, { data: goals }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', session.user.id).single(),
    supabase.from('goals').select('id, is_completed, created_at').eq('user_id', session.user.id),
  ])

  return <ProfileClient profile={profile} userEmail={session.user.email || ''} goals={goals || []} userId={session.user.id} />
}
