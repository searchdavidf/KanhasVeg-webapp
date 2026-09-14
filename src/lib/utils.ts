import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return `AED ${Math.round(amount)}`
}

export function generateOrderId(sequence: number): string {
  return `KVR-${sequence.toString().padStart(4, '0')}`
}

export function getStoreStatus(): { isOpen: boolean; nextChange: string } {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const openMinutes = 7 * 60 // 07:00
  const closeMinutes = 23 * 60 + 30 // 23:30

  const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes
  const nextChange = isOpen ? '23:30' : '07:00'

  return { isOpen, nextChange }
}
