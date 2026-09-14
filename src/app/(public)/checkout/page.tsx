import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CheckoutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/checkout')
  }

  return (
    <div className="min-h-screen bg-background p-5">
      <h1 className="text-xl font-bold">Checkout</h1>
      <p className="text-body mt-2">Authenticated checkout coming soon.</p>
    </div>
  )
}
