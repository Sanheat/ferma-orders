'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getBanner, addOrder, saveClient, genId } from '@/lib/storage'
import { isoDate, firstShipmentFrom, parseISO, fmtLong } from '@/lib/dates'
import type { Counterparty, OrderItem } from '@/lib/types'
import Logo from '@/components/ui/Logo'
import Calendar from '@/components/ui/Calendar'
import ClientBanner from './ClientBanner'
import LineItem from './LineItem'
import DeadlineHint from './DeadlineHint'

type Item = OrderItem & { uid: string }

const mkItem = (): Item => ({ uid: Math.random().toString(36).slice(2), product: '', packaging: 'yasik', qty: '1', frozen: false, frozenComment: '' })

const lbl = { display: 'block', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase' as const, color: '#514C4B', marginBottom: 4 }

export default function OrderForm({ counterparty }: { counterparty: Counterparty }) {
  const router = useRouter()
  const banner = getBanner()
  const [shipDate, setShipDate] = useState(() => isoDate(firstShipmentFrom()))
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery')
  const [items, setItems] = useState<Item[]>([mkItem()])
  const [comment, setComment] = useState('')
  const [showCal, setShowCal] = useState(false)
  const [done, setDone] = useState<{ id: string; address: string; shipmentDate: string } | null>(null)

  const handleChange = (idx: number, ni: Item) => setItems(p => p.map((it, i) => i === idx ? ni : it))
  const handleRemove = (idx: number) => setItems(p => p.filter((_, i) => i !== idx))

  const submit = () => {
    if (items.some(it => !it.product || !it.qty || Number(it.qty) <= 0)) { alert('Заполните все позиции'); return }
    const id = genId()
    addOrder({
      id, clientId: counterparty.id, clientName: counterparty.name,
      deliveryAddress: counterparty.address, deliveryType,
      shipmentDate: shipDate,
      createdAt: new Date().toISOString(),
      items: items.map(({ uid, ...it }) => it),
      comment, status: 'pending',
    })
    setDone({ id, address: counterparty.address, shipmentDate: shipDate })
  }

  const reset = () => { setItems([mkItem()]); setComment(''); setDone(null); setDeliveryType('delivery'); setShipDate(isoDate(firstShipmentFrom())) }
  const logout = () => { saveClient(null); router.push('/') }

  const inp = { width: '100%', fontFamily: "'PT Sans', sans-serif", fontSize: 14, color: '#191414', background: '#fff', border: '1.5px solid #e8d9c4', borderRadius: 8, padding: '9px 12px', outline: 'none' }

  if (done) return (
    <div style={{ minHeight: '100vh', background: '#fdfaf4', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e8d9c4', padding: '0 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center' }}><Logo /></div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14, padding: 24 }}>
        <div style={{ width: 64, height: 64, background: '#f2f7f3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#7a9e7e' }}>✓</div>
        <div style={{ fontFamily: "'PT Serif', serif", fontSize: 26, fontWeight: 700, color: '#3d2b1f' }}>Заявка №{done.id} принята</div>
        <div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 14, color: '#6b5245', textAlign: 'center', maxWidth: 420 }}>
          {done.address}<br />Отгрузка — <b>{fmtLong(parseISO(done.shipmentDate))}</b>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button onClick={reset} style={{ background: '#c94030', color: '#fff', padding: '12px 24px', borderRadius: 8, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 14, border: 'none' }}>Новый заказ</button>
          <button onClick={() => router.push('/history')} style={{ background: 'none', color: '#c94030', padding: '12px 24px', borderRadius: 8, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 14, border: '2px solid #c94030' }}>История</button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ background: '#fdfaf4', minHeight: '100vh', paddingBottom: 60 }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e8d9c4', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <button onClick={() => router.push('/history')} style={{ background: 'none', border: 'none', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '.04em', color: '#c94030' }}>История заказов →</button>
            <button onClick={logout} style={{ background: 'none', border: '1px solid #e8d9c4', borderRadius: 6, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11, color: '#9a8070', padding: '5px 12px' }}>Выйти</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '18px 24px' }}>
        <ClientBanner banner={banner} />

        <div style={{ fontFamily: "'PT Serif', serif", fontSize: 20, fontWeight: 700, color: '#3d2b1f', marginBottom: 2 }}>Новая заявка</div>
        <div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 13, color: '#6b5245', marginBottom: 16 }}>{counterparty.name}</div>

        <div style={{ marginBottom: 14 }}>
          <div style={lbl}>Точка доставки</div>
          <div style={{ background: '#fff', border: '1.5px solid #e8d9c4', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fef0ed', color: '#c94030', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>📍</div>
            <div>
              <div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 14, color: '#3d2b1f', fontWeight: 700 }}>
                {counterparty.address || <span style={{ color: '#9a8070', fontWeight: 400 }}>— адрес не указан —</span>}
              </div>
              <div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 11, color: '#9a8070', marginTop: 2 }}>Изменение адреса — через менеджера фермы</div>
            </div>
          </div>
        </div>

        <div className="content-parent" style={{ marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={lbl}>Дата отгрузки</div>
            <div style={{ position: 'relative' }}>
              <button type="button" onClick={() => setShowCal(s => !s)}
                style={{ ...inp, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>{fmtLong(parseISO(shipDate))}</span>
                <span style={{ color: '#9a8070', fontSize: 12 }}>📅</span>
              </button>
              {showCal && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 20 }}>
                  <Calendar value={shipDate} minDate={firstShipmentFrom()} onChange={d => { setShipDate(d); setShowCal(false) }} />
                </div>
              )}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={lbl}>Способ получения</div>
            <div style={{ display: 'flex', border: '1.5px solid #e8d9c4', borderRadius: 8, overflow: 'hidden', height: 38, background: '#fff' }}>
              {(['delivery', 'pickup'] as const).map((v, i) => {
                const on = deliveryType === v
                return (
                  <button key={v} type="button" onClick={() => setDeliveryType(v)}
                    style={{ flex: 1, border: 'none', borderLeft: i ? '1px solid #e8d9c4' : 'none', background: on ? '#c94030' : 'transparent', color: on ? '#fff' : '#3d2b1f', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    {v === 'delivery' ? 'Доставка' : 'Самовывоз'}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}><DeadlineHint shipDate={shipDate} /></div>

        <div style={{ display: 'block', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: '#514C4B', marginBottom: 8 }}>Позиции заказа</div>
        {items.map((item, idx) => <LineItem key={item.uid} item={item} idx={idx} total={items.length} onChange={handleChange} onRemove={handleRemove} />)}

        <button type="button" onClick={() => setItems(p => [...p, mkItem()])}
          className="content-divider"
          style={{ background: 'none', border: '1.5px dashed #e8d9c4', borderRadius: 8, padding: '10px', width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, color: '#6b5245', marginBottom: 18 }}>
          + Добавить позицию
        </button>

        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Комментарий к заказу</label>
          <textarea style={{ ...inp, resize: 'vertical', minHeight: 68 }} placeholder="Особые пожелания, удобное время доставки..." value={comment} onChange={e => setComment(e.target.value)} />
        </div>

        <button onClick={submit} style={{ background: '#c94030', color: '#fff', padding: '14px 32px', borderRadius: 8, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: '.04em', border: 'none' }}>
          Отправить заявку
        </button>
      </div>
    </div>
  )
}
