'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, Check, X, Clock, ChefHat, Truck, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface Order {
  id: string
  order_number: string
  customer_name: string | null
  customer_phone: string | null
  fulfillment: 'pickup' | 'delivery'
  address: string | null
  notes: string | null
  total: number
  status: string
  payment_status: string
  created_at: string
  items: { id: string; name: string; quantity: number; price: number; line_total: number }[]
}

// Map Supabase result to Order type
function mapToOrder(data: any): Order {
  return {
    ...data,
    items: data.order_items || [],
  }
}

const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']
const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'New', color: 'bg-warning/20 text-warning', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-500/20 text-blue-400', icon: Check },
  preparing: { label: 'Preparing', color: 'bg-orange-500/20 text-orange-400', icon: ChefHat },
  ready: { label: 'Ready', color: 'bg-success/20 text-success', icon: Check },
  delivered: { label: 'Delivered', color: 'bg-success/20 text-success', icon: Truck },
  cancelled: { label: 'Cancelled', color: 'bg-error/20 text-error', icon: X },
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = createClient()
    
    async function loadOrders() {
      const { data } = await sb
        .from('orders')
        .select(`
          id, order_number, customer_name, customer_phone,
          fulfillment, address, notes, total, status,
          payment_status, created_at,
          order_items:order_items(id, name, quantity, price, line_total)
        `)
        .order('created_at', { ascending: false })
        .limit(50)
      
      if (data) setOrders(data.map(mapToOrder))
      setLoading(false)
    }
    loadOrders()

    // Subscribe to realtime updates
    const channel = sb
      .channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, loadOrders)
      .subscribe()

    return () => { sb.removeChannel(channel) }
  }, [])

  async function updateStatus(orderId: string, status: string) {
    const sb = createClient()
    await sb.from('orders').update({ status }).eq('id', orderId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text-muted">Loading orders...</p>
      </div>
    )
  }

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status))
  const completedOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status))

  return (
    <div className="min-h-screen bg-background p-5 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-background" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Kanha's Admin</h1>
            <p className="text-xs text-text-muted">Live order dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse-gold" />
          <span className="text-xs text-success font-semibold">Live</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-primary">{activeOrders.length}</p>
          <p className="text-xs text-text-muted">Active</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-success">{completedOrders.length}</p>
          <p className="text-xs text-text-muted">Done</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-primary">
            {activeOrders.reduce((sum, o) => sum + Number(o.total), 0).toFixed(0)}
          </p>
          <p className="text-xs text-text-muted">AED Active</p>
        </div>
      </div>

      {/* Active orders */}
      <h2 className="text-section mb-3">Active Orders</h2>
      <div className="space-y-3">
        {activeOrders.length === 0 ? (
          <p className="text-text-muted text-center py-8">No active orders</p>
        ) : (
          activeOrders.map(order => {
            const config = statusConfig[order.status]
            const Icon = config?.icon || Clock
            return (
              <div key={order.id} className="card p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-bold text-primary">{order.order_number}</p>
                    <p className="text-sm text-text-secondary">{order.customer_name || 'Walk-in'}</p>
                    <p className="text-xs text-text-muted">{order.customer_phone}</p>
                  </div>
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1', config?.color)}>
                    <Icon className="w-3.5 h-3.5" />
                    {config?.label}
                  </span>
                </div>
                <div className="text-sm text-text-secondary mb-3">
                  {order.items?.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.quantity}× {item.name}</span>
                      <span>AED {item.line_total}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <p className="font-bold">AED {order.total}</p>
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <>
                        <Button size="sm" variant="default" onClick={() => updateStatus(order.id, 'confirmed')}>
                          Accept
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => updateStatus(order.id, 'cancelled')}>
                          Reject
                        </Button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <Button size="sm" variant="default" onClick={() => updateStatus(order.id, 'preparing')}>
                        Start Prep
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button size="sm" variant="default" onClick={() => updateStatus(order.id, 'ready')}>
                        Mark Ready
                      </Button>
                    )}
                    {order.status === 'ready' && (
                      <Button size="sm" variant="default" onClick={() => updateStatus(order.id, 'delivered')}>
                        Delivered
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
