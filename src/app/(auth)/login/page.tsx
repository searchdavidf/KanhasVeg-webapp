'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Phone, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOtp = async () => {
    if (!phone) return
    setLoading(true)
    setError('')

    const sb = createClient()
    const { error } = await sb.auth.signInWithOtp({
      phone: `+${phone}`,
      options: {
        shouldCreateUser: true,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setStep('otp')
    setLoading(false)
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) return
    setLoading(true)
    setError('')

    const sb = createClient()
    const { error } = await sb.auth.verifyOtp({
      phone: `+${phone}`,
      token: otp,
      type: 'sms',
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-5">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <img src="/logo.png" alt="Kanha's" className="w-12 h-12 object-contain" />
          </Link>
          <h1 className="text-xl font-bold">
            {step === 'phone' ? 'Welcome back' : 'Verify OTP'}
          </h1>
          <p className="text-body">
            {step === 'phone'
              ? 'Enter your phone number to login or create an account'
              : `Enter the 6-digit code sent to +971 ${phone}`}
          </p>
        </div>

        {step === 'phone' ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold px-3 py-2.5 bg-background-surface border border-border rounded-md">
                +971
              </span>
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="tel"
                  value={formatPhone(phone)}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="5X XXX XXXX"
                  maxLength={12}
                  className="w-full pl-10 pr-4 py-2.5 bg-background-surface border border-border rounded-md text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            {error && <p className="text-sm text-error">{error}</p>}
            <Button
              variant="gold"
              size="lg"
              className="w-full"
              onClick={handleSendOtp}
              disabled={loading || phone.length < 9}
            >
              {loading ? 'Sending...' : 'Continue'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="w-full text-center text-2xl tracking-widest py-4 bg-background-surface border border-border rounded-md focus:outline-none focus:border-primary transition-colors"
            />
            {error && <p className="text-sm text-error">{error}</p>}
            <Button
              variant="gold"
              size="lg"
              className="w-full"
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
            <button
              onClick={() => setStep('phone')}
              className="w-full text-sm text-text-secondary hover:text-primary"
            >
              Change phone number
            </button>
          </div>
        )}

        <div className="text-center">
          <p className="text-xs text-text-muted">
            By continuing, you agree to Kanha's Terms of Service
          </p>
        </div>
      </div>
    </div>
  )
}
