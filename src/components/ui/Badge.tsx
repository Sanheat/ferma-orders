import { STATUSES } from '@/lib/data'
import type { OrderStatus } from '@/lib/types'

export default function Badge({ status }: { status: OrderStatus }) {
  const s = STATUSES[status] ?? STATUSES.pending
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: s.bg, color: s.color,
      fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '.04em',
      padding: '3px 10px', borderRadius: 9999,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
      {s.label}
    </span>
  )
}
