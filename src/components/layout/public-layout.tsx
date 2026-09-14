'use client'

import * as React from 'react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Phone, MapPin, Globe, Instagram, MessageCircle, ChevronLeft, ShoppingBag } from 'lucide-react'
import { cn, getStoreStatus } from '@/lib/utils'
import { Button } from './button'

const WA_NUMBER = '97123094707'
const waLink = (msg: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`

export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-normal',
        scrolled ? 'bg-background/95 backdrop-blur-md shadow-card' : 'bg-transparent'
      )}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Kanha's" className="w-9 h-9 object-contain" />
          <div className="leading-tight">
            <span className="text-base font-bold text-primary">Kanha's</span>
            <span className="block text-[0.65rem] text-text-secondary tracking-wider">VEG RESTAURANT</span>
          </div>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/menu"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-fast"
          >
            Menu
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-primary hover:text-primary-dim transition-colors duration-fast"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  )
}

export function StoreStatusPill() {
  const { isOpen, nextChange } = getStoreStatus()

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold',
        isOpen
          ? 'border-success/40 bg-success/10'
          : 'border-error/40 bg-error/10'
      )}
    >
      <span
        className={cn(
          'w-2 h-2 rounded-full animate-pulse-gold',
          isOpen ? 'bg-success' : 'bg-error'
        )}
      />
      <span className={isOpen ? 'text-success' : 'text-error'}>
        {isOpen ? 'Open Now' : 'Closed'}
      </span>
      <span className="text-text-muted">·</span>
      <span className="text-text-secondary">{isOpen ? `until ${nextChange}` : `opens ${nextChange}`}</span>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-5 pt-28 pb-12 bg-background">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />

      <div className="relative z-10 max-w-md w-full flex flex-col items-center gap-6">
        {/* Brand box */}
        <div className="card px-6 py-5 flex items-center gap-4 w-full backdrop-blur-sm">
          <img src="/logo.png" alt="Kanha's" className="w-16 h-16 object-contain" />
          <div className="text-left">
            <h1 className="text-display text-primary">Kanha's</h1>
            <p className="text-sm text-text-secondary tracking-wide">Veg Restaurant</p>
          </div>
        </div>

        {/* Status */}
        <StoreStatusPill />

        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
          One Number.<br />
          Zero Chasing.<br />
          <span className="text-primary">Guest Ready.</span>
        </h2>

        <p className="text-body max-w-sm">
          Musaffah, Shabiya 10 — Authentic North Indian veg flavors, fresh from the tandoor.
        </p>

        {/* CTA */}
        <Link href="/menu" className="w-full max-w-xs">
          <Button variant="gold" size="xl" className="w-full">
            <ShoppingBag className="w-5 h-5" />
            Browse Menu
          </Button>
        </Link>

        {/* Trust stats */}
        <div className="flex items-center gap-6 pt-4 border-t border-border w-full justify-center">
          <div className="text-center">
            <span className="block text-lg font-bold text-primary">★★★★★</span>
            <span className="text-xs text-text-muted">Google</span>
          </div>
          <div className="text-center">
            <span className="block text-lg font-bold text-primary">100%</span>
            <span className="text-xs text-text-muted">Veg</span>
          </div>
          <div className="text-center">
            <span className="block text-lg font-bold text-primary">200+</span>
            <span className="text-xs text-text-muted">Dishes</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function SocialLinks() {
  return (
    <section className="px-5 py-10 max-w-4xl mx-auto">
      <h2 className="text-section mb-4">Connect With Us</h2>
      <div className="grid grid-cols-2 gap-3">
        <a href="https://instagram.com/kanhas_veg" target="_blank" rel="noreferrer" className="card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors">
          <Instagram className="w-5 h-5 text-pink-500" />
          <div>
            <p className="text-sm font-semibold">Instagram</p>
            <p className="text-xs text-text-muted">@kanhas_veg</p>
          </div>
        </a>
        <a href="https://kanhasrestaurant.com" target="_blank" rel="noreferrer" className="card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors">
          <Globe className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">Website</p>
            <p className="text-xs text-text-muted">kanhasrestaurant.com</p>
          </div>
        </a>
        <a href="tel:023094707" className="card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors">
          <Phone className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-sm font-semibold">Call</p>
            <p className="text-xs text-text-muted">02 309 4707</p>
          </div>
        </a>
        <a href={waLink("Hi Kanha's, I'd like to place an order.")} target="_blank" rel="noreferrer" className="card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors">
          <MessageCircle className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm font-semibold">WhatsApp</p>
            <p className="text-xs text-text-muted">+971 2 309 4707</p>
          </div>
        </a>
        <a href="https://maps.app.goo.gl/3oLBVa3G7eKP9dJn9" target="_blank" rel="noreferrer" className="card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors col-span-2">
          <MapPin className="w-5 h-5 text-red-400" />
          <div>
            <p className="text-sm font-semibold">Musaffah Shabiya 10</p>
            <p className="text-xs text-text-muted">Opposite Hypermarket, Abu Dhabi</p>
          </div>
        </a>
      </div>
    </section>
  )
}

export function WhatsAppFAB() {
  return (
    <a
      href={waLink("Hi Kanha's, I'd like to place an order.")}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lift transition-all duration-fast hover:scale-110"
      aria-label="Order on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  )
}
