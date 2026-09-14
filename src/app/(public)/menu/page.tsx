'use client'

import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, Plus, Minus, ShoppingBag, X, ChevronRight } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface MenuItem {
  id: string
  category_id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
  sort_order: number
}

interface MenuCategory {
  id: string
  name: string
  slug: string
  sort_order: number
}

interface CartItem {
  id: string
  name: string
  price: number
  qty: number
}

const CART_KEY = 'kanhas_cart_v1'

export default function MenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Load menu from Supabase
  useEffect(() => {
    async function loadMenu() {
      const sb = createClient()
      const [catRes, itemRes] = await Promise.all([
        sb.from('menu_categories').select('*').eq('is_active', true).order('sort_order'),
        sb.from('menu_items').select('*').eq('is_available', true).order('sort_order'),
      ])
      if (catRes.data) setCategories(catRes.data)
      if (itemRes.data) setItems(itemRes.data)
      setLoading(false)
    }
    loadMenu()
  }, [])

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY)
      if (saved) setCart(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
    } catch { /* ignore */ }
  }, [cart])

  const addToCart = useCallback((item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        if (existing.qty >= 20) return prev
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      }
      if (prev.length >= 40) return prev
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id)
      if (!existing) return prev
      if (existing.qty <= 1) return prev.filter(i => i.id !== id)
      return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i)
    })
  }, [])

  const cartTotal = cart.reduce((sum, i) => sum + i.qty * i.price, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  const filteredItems = items.filter(item => {
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !activeCategory || item.category_id === activeCategory
    return matchesSearch && matchesCategory
  })

  const groupedItems = categories.map(cat => ({
    ...cat,
    items: filteredItems.filter(i => i.category_id === cat.id),
  })).filter(g => g.items.length > 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Kanha's" className="w-8 h-8 object-contain" />
            <span className="font-bold text-primary">Kanha's</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDrawerOpen(true)}
            className="relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-background text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </div>

        {/* Search */}
        <div className="max-w-4xl mx-auto px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background-surface border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="max-w-4xl mx-auto px-4 pb-3 overflow-x-auto">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                'pill-toggle whitespace-nowrap',
                !activeCategory ? 'pill-toggle-active' : 'pill-toggle-inactive'
              )}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
                className={cn(
                  'pill-toggle whitespace-nowrap',
                  activeCategory === cat.id ? 'pill-toggle-active' : 'pill-toggle-inactive'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Menu content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-32" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {groupedItems.map(group => (
              <section key={group.id} id={group.slug}>
                <h2 className="text-section mb-3">{group.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.items.map(item => {
                    const cartItem = cart.find(i => i.id === item.id)
                    const qty = cartItem?.qty || 0
                    return (
                      <div key={item.id} className="card p-4 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{item.name}</p>
                          <p className="text-primary font-bold text-sm mt-1">{formatCurrency(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {qty > 0 ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="w-8 h-8 rounded-full bg-background-lift flex items-center justify-center hover:bg-primary/20 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-6 text-center font-bold text-primary">{qty}</span>
                              <button
                                onClick={() => addToCart(item)}
                                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary-dim transition-colors"
                              >
                                <Plus className="w-4 h-4 text-background" />
                              </button>
                            </div>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => addToCart(item)}
                            >
                              <Plus className="w-4 h-4" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Sticky cart bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-30 p-4 bg-background/95 backdrop-blur-md border-t border-border">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">{cartCount} items</p>
              <p className="text-primary font-bold">{formatCurrency(cartTotal)}</p>
            </div>
            <Button variant="gold" size="lg" onClick={() => setDrawerOpen(true)}>
              View Cart
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Cart drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-full max-w-lg bg-background-surface border-t border-border rounded-t-lg p-5 max-h-[80vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Your Order</h3>
              <button onClick={() => setDrawerOpen(false)} className="p-1 hover:bg-background-lift rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            {cart.length === 0 ? (
              <p className="text-text-muted text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between gap-3 p-3 bg-background rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-text-muted">{formatCurrency(item.price)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-7 h-7 rounded-full bg-background-lift flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-bold text-sm">{item.qty}</span>
                        <button
                          onClick={() => addToCart(item as unknown as MenuItem)}
                          className="w-7 h-7 rounded-full bg-primary flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3 text-background" />
                        </button>
                      </div>
                      <p className="font-bold text-primary text-sm w-16 text-right">
                        {formatCurrency(item.qty * item.price)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="font-bold">{formatCurrency(cartTotal)}</span>
                  </div>
                  <Link href="/checkout">
                    <Button variant="gold" size="lg" className="w-full mt-3">
                      Checkout
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
