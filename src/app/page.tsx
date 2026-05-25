'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getClient, getCounterparties } from '@/lib/storage'
import ClientLogin from '@/components/client/ClientLogin'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const saved = getClient()
    if (saved) {
      const cp = getCounterparties().find(c => c.id === saved.id)
      if (cp) router.replace('/order')
    }
  }, [router])

  return <ClientLogin />
}
