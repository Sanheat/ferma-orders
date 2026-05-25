'use client'
import Counterparties from '@/components/admin/Counterparties'
import AdminShell from '@/components/admin/AdminShell'

export default function CounterpartiesPage() {
  return <AdminShell active="counterparties"><Counterparties /></AdminShell>
}
