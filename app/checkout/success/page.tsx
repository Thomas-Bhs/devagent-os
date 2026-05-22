'use client'

import { useTheme } from '@/app/context/ThemeContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PLANS } from '@/app/lib/plans'
import { PlanId } from '@/app/types/subscription'
import { Suspense } from 'react'

interface SessionData {
  planId: PlanId
  customerEmail: string
}

function SuccessContent() {
  const { t } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) {
      router.push('/')
      return
    }

    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/stripe/session?session_id=${sessionId}`)
        if (!res.ok) throw new Error('Session not found')
        const data = await res.json()
        setSessionData(data)
      } catch {
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [sessionId, router])

  if (loading) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: t.bg }}
      >
        <p
          className={t.pricingGlowAnimation ? 'fallout-blink' : ''}
          style={{ color: t.textSecondary, fontFamily: t.fontFamily }}
        >
          {t.pricingGlowAnimation ? 'LOADING...' : 'Loading...'}
        </p>
      </main>
    )
  }

  const plan = sessionData ? PLANS[sessionData.planId] : null

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: t.bg, fontFamily: t.fontFamily }}
    >
      <div
        className="max-w-md w-full rounded-xl p-8 text-center flex flex-col gap-6"
        style={{
          backgroundColor: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
        }}
      >
        {/* Icon */}
        <div
          className="text-4xl mx-auto"
          style={{ color: t.accent }}
        >
          {t.pricingGlowAnimation ? '[ OK ]' : '✓'}
        </div>

        {/* Title */}
        <h1
          className="text-2xl font-bold"
          style={{ color: t.text }}
        >
          {t.pricingGlowAnimation
            ? '>> ACCESS GRANTED <<'
            : 'Welcome aboard!'}
        </h1>

        {/* Plan */}
        {plan && (
          <div
            className="rounded-lg px-4 py-3"
            style={{
              backgroundColor: t.subtleBg,
              border: `1px solid ${t.cardBorder}`,
            }}
          >
            <p
              className="text-xs uppercase mb-1"
              style={{ color: t.textSecondary }}
            >
              {t.pricingGlowAnimation ? '>> ACTIVE PLAN' : 'Active plan'}
            </p>
            <p
              className="text-lg font-bold"
              style={{ color: t.accent }}
            >
              {plan.name} — €{plan.price}/month
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: t.textSecondary }}
            >
              {plan.requestsPerMonth.toLocaleString()} requests / month
            </p>
          </div>
        )}

        {/* Email */}
        {sessionData?.customerEmail && (
          <p
            className="text-sm"
            style={{ color: t.textSecondary }}
          >
            {t.pricingGlowAnimation
              ? `CONFIRMATION SENT TO: ${sessionData.customerEmail}`
              : `Confirmation sent to ${sessionData.customerEmail}`}
          </p>
        )}

        {/* Button */}
        <button
          onClick={() => router.push('/')}
          className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200"
          style={{
            backgroundColor: t.accent,
            color: t.bg,
          }}
        >
          {t.pricingGlowAnimation
            ? 'LAUNCH DEVAGENT OS'
            : 'Start using DevAgent OS'}
        </button>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}