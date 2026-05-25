'use client'
import { PKG } from '@/lib/data'
import type { PackagingId } from '@/lib/types'

interface Props { pkgId: PackagingId; value: string; onChange: (v: string) => void }

export default function QtyField({ pkgId, value, onChange }: Props) {
  const p = PKG[pkgId]

  if (p.type === 'kg') {
    return (
      <input
        type="number" min="0.1" step="0.1" placeholder="кг"
        value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', fontFamily: "'PT Sans', sans-serif", fontSize: 13, color: '#3d2b1f', background: '#fff', border: '1.5px solid #e8d9c4', borderRadius: 8, padding: '8px 10px', outline: 'none', textAlign: 'center' }}
      />
    )
  }

  const step = p.step || 1
  let count = parseInt(value || String(step), 10) || step
  if (step > 1 && count % step !== 0) count = Math.max(step, Math.round(count / step) * step)

  return (
    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e8d9c4', borderRadius: 8, overflow: 'hidden', background: '#fff', height: 38 }}>
      <button type="button" onClick={() => onChange(String(Math.max(step, count - step)))}
        style={{ width: 34, flexShrink: 0, background: 'none', border: 'none', borderRight: '1px solid #e8d9c4', fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 16, color: '#6b5245', height: '100%' }}>−</button>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontFamily: "'PT Sans', sans-serif", fontSize: 13, color: '#3d2b1f', fontWeight: 700 }}>
        {count}
        <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 10, fontWeight: 700, color: '#9a8070' }}>{p.unit}</span>
        {step > 1 && <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 9, color: '#9a8070', marginLeft: 2 }}>×{step}</span>}
      </div>
      <button type="button" onClick={() => onChange(String(count + step))}
        style={{ width: 34, flexShrink: 0, background: 'none', border: 'none', borderLeft: '1px solid #e8d9c4', fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 16, color: '#c94030', height: '100%' }}>+</button>
    </div>
  )
}
