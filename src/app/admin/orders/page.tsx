'use client'
import AdminOrders from '@/components/admin/AdminOrders'
import AdminShell from '@/components/admin/AdminShell'

export default function AdminOrdersPage() {
  return <AdminShell active="orders"><AdminOrders /></AdminShell>
}
