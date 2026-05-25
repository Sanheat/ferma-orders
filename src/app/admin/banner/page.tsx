'use client'
import BannerEditor from '@/components/admin/BannerEditor'
import AdminShell from '@/components/admin/AdminShell'

export default function BannerPage() {
  return <AdminShell active="banner"><BannerEditor /></AdminShell>
}
