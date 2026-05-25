'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getClient, getCounterparties } from '@/lib/storage'
import type { Counterparty } from '@/lib/types'
import OrderHistory from '@/components/client/OrderHistory'

export default function HistoryPage() {
  const router = useRouter()
  const [cp, setCp] = useState<Counterparty | null>(null)

  useEffect(() => {
    const saved = getClient()
    if (!saved) { router.replace('/'); return }
    const found = getCounterparties().find(c => c.id === saved.id)
    if (!found) { router.replace('/'); return }
    setCp(found)
  }, [router])

  if (!cp) return null
  return <OrderHistory counterparty={cp} />
}
