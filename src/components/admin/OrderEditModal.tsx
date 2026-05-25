'use client'
import { useState } from 'react'
import { updateOrder, getCounterparties, genId } from '@/lib/storage'
import { STATUSES } from '@/lib/data'
import { fmtDateTime, fmtLong, parseISO, isoDate } from '@/lib/dates'
import type { Order, OrderItem } from '@/lib/types'
import Calendar from '@/components/ui/Calendar'
import LineItem from '@/components/client/LineItem'

type Item = OrderItem & { uid: string }

const sel: React.CSSProperties = { width: '100%', fontFamily: "'PT Sans', sans-serif", fontSize: 13, color: '#3d2b1f', background: '#fff', border: '1.5px solid #e8d9c4', borderRadius: 8, padding: '8px 10px', outline: 'none' }
const lbl: React.CSSProperties = { display: 'block', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: '#6b5245', marginBottom: 4 }

interface Props { order: Order; onClose: () => void; onSave: (updated: Order) => void }

export default function OrderEditModal({ order, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<Omit<Order, 'items'> & { items: Item[] }>({
    ...order,
    items: order.items.map(it => ({ ...it, uid: genId() })),
  })
  const [showCal, setShowCal] = useState(false)

  const cps = getCounterparties()
  const cp = cps.find(c => c.id === draft.clientId) ?? cps.find(c => c.name === draft.clientName)
  const cpAddress = cp?.address ?? draft.deliveryAddress ?? ''

  const setItem = (i: number, ni: Item) => setDraft(d => ({ ...d, items: d.items.map((it, j) => j === i ? ni : it) }))
  const addItem = () => setDraft(d => ({ ...d, items: [...d.items, { uid: genId(), product: '', packaging: 'yasik' as const, qty: '1', frozen: false, frozenComment: '' }] }))
  const removeItem = (i: number) => setDraft(d => ({ ...d, items: d.items.filter((_, j) => j !== i) }))

  const save = () => {
    if (draft.items.length === 0) { alert('Минимум одна позиция'); return }
    if (draft.items.some(it => !it.product || !it.qty)) { alert('Заполните все позиции'); return }
    const patch = {
      deliveryAddress: cpAddress, deliveryType: draft.deliveryType,
      shipmentDate: draft.shipmentDate,
      items: draft.items.map(({ uid: _uid, ...rest }) => rest),
      comment: draft.comment, status: draft.status,
    }
    updateOrder(order.id, patch)
    onSave({ ...order, ...patch })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(61,43,31,.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 16px 48px rgba(61,43,31,.2)', width: '100%', maxWidth: 760, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #e8d9c4', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
          <div>
            <div style={{ fontFamily: "'PT Serif', serif", fontSize: 18, fontWeight: 700, color: '#3d2b1f' }}>Редактирование заявки № {order.id}</div>
            <div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 12, color: '#9a8070', marginTop: 3 }}>{order.clientName} · создана {fmtDateTime(order.createdAt)}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, color: '#9a8070', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: '18px 22px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={lbl}>Адрес <span style={{ textTransform: 'none', color: '#9a8070', fontSize: 10, letterSpacing: 0, fontWeight: 400 }}>· из раздела «Контрагенты»</span></label>
              <div style={{ ...sel, background: '#f5edd6', display: 'flex', alignItems: 'center', minHeight: 36 }}>{cpAddress || <span style={{ color: '#9a8070' }}>— не указан —</span>}</div>
            </div>
            <div>
              <label style={lbl}>Способ получения</label>
              <select style={sel} value={draft.deliveryType ?? 'delivery'} onChange={e => setDraft(d => ({ ...d, deliveryType: e.target.value as 'delivery' | 'pickup' }))}>
                <option value="delivery">Доставка</option>
                <option value="pickup">Самовывоз</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div style={{ position: 'relative' }}>
              <label style={lbl}>Дата отгрузки</label>
              <button type="button" onClick={() => setShowCal(s => !s)}
                style={{ ...sel, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>{draft.shipmentDate ? fmtLong(parseISO(draft.shipmentDate)) : '— не указана —'}</span>
                <span style={{ color: '#9a8070', fontSize: 12 }}>📅</span>
              </button>
              {showCal && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 20 }}>
                  <Calendar value={draft.shipmentDate ?? isoDate(new Date())} onChange={d => { setDraft(p => ({ ...p, shipmentDate: d })); setShowCal(false) }} />
                </div>
              )}
            </div>
            <div>
              <label style={lbl}>Статус</label>
              <select style={sel} value={draft.status} onChange={e => setDraft(d => ({ ...d, status: e.target.value as Order['status'] }))}>
                {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>

          <div style={lbl}>Позиции</div>
          {draft.items.map((it, i) => <LineItem key={it.uid} item={it} idx={i} total={draft.items.length} onChange={setItem} onRemove={removeItem} />)}
          <button type="button" onClick={addItem}
            style={{ background: 'none', border: '1.5px dashed #e8d9c4', borderRadius: 8, padding: '10px', width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, color: '#6b5245', marginBottom: 14 }}>
            + Добавить позицию
          </button>

          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Комментарий</label>
            <textarea style={{ ...sel, resize: 'vertical', minHeight: 60 }} value={draft.comment ?? ''} onChange={e => setDraft(d => ({ ...d, comment: e.target.value }))} />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ background: 'none', border: '1.5px solid #e8d9c4', color: '#3d2b1f', padding: '10px 20px', borderRadius: 8, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13 }}>Отмена</button>
            <button onClick={save} style={{ background: '#c94030', color: '#fff', padding: '10px 24px', borderRadius: 8, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, border: 'none' }}>Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  )
}
