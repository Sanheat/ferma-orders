'use client'
import { useRouter } from 'next/navigation'
import Logo from '@/components/ui/Logo'

const NAV = [
  { key: 'orders',           label: 'Заявки',       href: '/admin/orders' },
  { key: 'counterparties',   label: 'Контрагенты',  href: '/admin/counterparties' },
  { key: 'banner',           label: 'Баннер',       href: '/admin/banner' },
]

interface Props { active: string; children: React.ReactNode }

export default function AdminShell({ active, children }: Props) {
  const router = useRouter()
  const navBtn = (isActive: boolean): React.CSSProperties => ({
    background: isActive ? '#5e4426' : 'transparent',
    color: isActive ? '#fff' : '#c9b299',
    border: 'none', padding: '6px 14px', borderRadius: 6,
    fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, cursor: 'pointer',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fdfaf4' }}>
      <div style={{ background: '#3d2b1f', padding: '0 24px', flexShrink: 0 }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Logo light />
            <div style={{ display: 'flex', gap: 4, marginLeft: 14 }}>
              {NAV.map(n => (
                <button key={n.key} style={navBtn(active === n.key)} onClick={() => router.push(n.href)}>
                  {n.label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: '1px solid #5e4426', borderRadius: 6, padding: '5px 14px', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11, color: '#9a8070' }}>Выйти</button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
    </div>
  )
}
