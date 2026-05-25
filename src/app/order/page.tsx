'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getClient, getCounterparties, seedDemo } from '@/lib/storage'
import type { Counterparty } from '@/lib/types'
import OrderForm from '@/components/client/OrderForm'

export default function OrderPage() {
  const router = useRouter()
  const [cp, setCp] = useState<Counterparty | null>(null)

  useEffect(() => {
    seedDemo()
    const saved = getClient()
    if (!saved) { router.replace('/'); return }
    const found = getCounterparties().find(c => c.id === saved.id)
    if (!found) { router.replace('/'); return }
    setCp(found)
  }, [router])

  if (!cp) return null
  return <OrderForm counterparty={cp} />
}
