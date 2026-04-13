import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import GoalsDashboard from '@/components/goals/GoalsDashboard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/auth/login')

  const [{ data: profile }, { data: goals }, { data: categories }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', session.user.id).single(),
    supabase.from('goals').select('*, categories(*)').eq('user_id', session.user.id).order('created_at', { ascending: false }),
    supabase.from('categories').select('*').eq('user_id', session.user.id).order('name'),
  ])

  return <GoalsDashboard profile={profile} initialGoals={goals || []} initialCategories={categories || []} userId={session.user.id} />
}
