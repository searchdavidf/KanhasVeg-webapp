import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/dashboard')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-background p-5 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <p className="text-body mt-2">Welcome, {profile?.full_name || 'Customer'}!</p>
      <div className="card p-5 mt-5">
        <p className="text-section mb-1">Loyalty Points</p>
        <p className="text-3xl font-bold text-primary">{profile?.loyalty_points || 0}</p>
        <p className="text-sm text-text-muted capitalize mt-1">Tier: {profile?.tier || 'bronze'}</p>
      </div>
      <p className="text-body mt-6">More features coming soon: order history, tracking, and more.</p>
    </div>
  )
}
