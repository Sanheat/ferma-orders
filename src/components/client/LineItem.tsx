'use client'
import { PRODUCTS, PKG } from '@/lib/data'
import type { OrderItem, PackagingId } from '@/lib/types'
import QtyField from '@/components/ui/QtyField'

interface Props {
  item: OrderItem & { uid: string }
  idx: number
  total: number
  onChange: (idx: number, item: OrderItem & { uid: string }) => void
  onRemove: (idx: number) => void
}

const sel = { width: '100%', fontFamily: "'PT Sans', sans-serif", fontSize: 13, color: '#191414', background: '#fff', border: '1.5px solid #e8d9c4', borderRadius: 8, padding: '8px 10px', outline: 'none' }
const lbl = { display: 'block', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase' as const, color: '#514C4B', marginBottom: 4 }

export default function LineItem({ item, idx, total, onChange, onRemove }: Props) {
  const prod = PRODUCTS.find(p => p.name === item.product)
  const availPkg = prod ? prod.pkg : (['yasik', 'paket', 'lotok'] as PackagingId[])

  const setProduct = (name: string) => {
    const p = PRODUCTS.find(x => x.name === name)
    const newPkg: PackagingId = p && !p.pkg.includes(item.packaging) ? p.pkg[0] : item.packaging
    const newQty = PKG[newPkg].type === 'counter' ? String(PKG[newPkg].step || 1) : ''
    onChange(idx, { ...item, product: name, packaging: newPkg, qty: newQty })
  }

  const setPkg = (pkgId: PackagingId) => {
    const newQty = PKG[pkgId].type === 'counter' ? String(PKG[pkgId].step || 1) : ''
    onChange(idx, { ...item, packaging: pkgId, qty: newQty })
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(61,43,31,.07)', marginBottom: 10, padding: '14px 16px' }}>
      <div className="input-dropdown-parent">
        <div style={{ flex: 2 }}>
          <label style={lbl}>Продукт</label>
          <select style={sel} value={item.product} onChange={e => setProduct(e.target.value)}>
            <option value="">— Выберите позицию —</option>
            {PRODUCTS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>
        </div>
        <div className="input-dropdown-group" style={{ flex: 1, minWidth: 0 }}>
          <div style={{ flex: '1 1 140px' }}>
            <label style={lbl}>Тара</label>
            <select style={sel} value={item.packaging} onChange={e => setPkg(e.target.value as PackagingId)}>
              {availPkg.map(pid => <option key={pid} value={pid}>{PKG[pid].label} ({PKG[pid].note})</option>)}
            </select>
          </div>
          <div className="frame-parent" style={{ flex: '0 0 auto', alignItems: 'flex-end' }}>
            <div>
              <label style={lbl}>{PKG[item.packaging].type === 'kg' ? 'Кол-во, кг' : 'Количество'}</label>
              <QtyField pkgId={item.packaging} value={item.qty} onChange={v => onChange(idx, { ...item, qty: v })} />
            </div>
            {total > 1 && (
              <button type="button" onClick={() => onRemove(idx)}
                style={{ background: 'none', border: 'none', color: '#9a8070', fontSize: 20, lineHeight: 1, paddingBottom: 6 }}>×</button>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'PT Sans', sans-serif", fontSize: 12, color: '#514C4B', cursor: 'pointer' }}>
          <input type="checkbox" checked={!!item.frozen}
            onChange={e => onChange(idx, { ...item, frozen: e.target.checked, frozenComment: e.target.checked ? item.frozenComment : '' })}
            style={{ accentColor: '#C94030', width: 16, height: 16, flexShrink: 0 }} />
          <span style={{ fontWeight: 700, color: item.frozen ? '#4a7da8' : '#514C4B' }}>Замороженное</span>
          <span style={{ color: '#9a8070', fontSize: 11 }}>(по умолчанию — охлаждённое)</span>
        </label>
        {item.frozen && (
          <input
            style={{ width: '100%', fontFamily: "'PT Sans', sans-serif", fontSize: 12, color: '#191414', background: '#fff', border: '1.5px solid #e8d9c4', borderRadius: 8, padding: '6px 10px', outline: 'none' }}
            placeholder="Комментарий к заморозке (опционально)"
            value={item.frozenComment || ''}
            onChange={e => onChange(idx, { ...item, frozenComment: e.target.value })}
          />
        )}
      </div>
    </div>
  )
}
