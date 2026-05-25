'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLogin from '@/components/admin/AdminLogin'

export default function AdminPage() {
  const router = useRouter()

  return <AdminLogin onLogin={() => router.push('/admin/orders')} />
}
