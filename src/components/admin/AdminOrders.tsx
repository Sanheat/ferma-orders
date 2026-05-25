'use client'
import { useState, useEffect, useMemo } from 'react'
import { getOrders, setOrderStatus, updateOrder, getCounterparties, orderVolumeKg } from '@/lib/storage'
import { PKG, STATUSES } from '@/lib/data'
import { fmtDateTime, fmtShort, parseISO } from '@/lib/dates'
import type { Order } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import OrderEditModal from './OrderEditModal'
import PrintBlanks from './PrintBlanks'

const thS: React.CSSProperties = { fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: '#9a8070', padding: '10px 14px', textAlign: 'left', background: '#f5edd6', borderBottom: '1px solid #e8d9c4' }
const tdS: React.CSSProperties = { fontFamily: "'PT Sans', sans-serif", fontSize: 13, color: '#3d2b1f', padding: '11px 14px', borderBottom: '1px solid #e8d9c4' }
const inp: React.CSSProperties = { width: '100%', fontFamily: "'PT Sans', sans-serif", fontSize: 13, color: '#3d2b1f', background: '#fff', border: '1.5px solid #e8d9c4', borderRadius: 8, padding: '8px 10px', outline: 'none' }
const lbl: React.CSSProperties = { display: 'block', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: '#6b5245', marginBottom: 4 }

type Tab = 'pending' | 'accepted' | 'shipped' | 'archive'

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(getOrders)
  const [tab, setTab] = useState<Tab>('pending')
  const [search, setSearch] = useState('')
  const [cpFilter, setCpFilter] = useState('')
  const [volMin, setVolMin] = useState('')
  const [volMax, setVolMax] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selected, setSelected] = useState<Order | null>(null)
  const [editing, setEditing] = useState<Order | null>(null)
  const [printing, setPrinting] = useState<Order[] | null>(null)

  useEffect(() => { const t = setInterval(() => setOrders(getOrders()), 5000); return () => clearInterval(t) }, [])

  const cps = getCounterparties()

  const counts = useMemo(() => ({
    pending:  orders.filter(o => o.status === 'pending').length,
    accepted: orders.filter(o => o.status === 'accepted').length,
    shipped:  orders.filter(o => o.status === 'shipped').length,
    archive:  orders.filter(o => o.status === 'archive').length,
  }), [orders])

  const filtered = useMemo(() => orders.filter(o => {
    if (o.status !== tab) return false
    if (cpFilter && o.clientId !== cpFilter && o.clientName !== cpFilter) return false
    if (search) {
      const q = search.toLowerCase()
      const hit = o.clientName.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) ||
        o.deliveryAddress?.toLowerCase().includes(q) || o.items.some(it => it.product.toLowerCase().includes(q))
      if (!hit) return false
    }
    const v = orderVolumeKg(o)
    if (volMin && v < parseFloat(volMin)) return false
    if (volMax && v > parseFloat(volMax)) return false
    if (dateFrom && o.shipmentDate && o.shipmentDate < dateFrom) return false
    if (dateTo   && o.shipmentDate && o.shipmentDate > dateTo)   return false
    return true
  }), [orders, tab, cpFilter, search, volMin, volMax, dateFrom, dateTo])

  const changeStatus = (id: string, st: Order['status']) => {
    setOrderStatus(id, st)
    setOrders(p => p.map(o => o.id === id ? { ...o, status: st } : o))
    setSelected(p => p?.id === id ? { ...p, status: st } : p)
  }

  const onEditSave = (updated: Order) => {
    setOrders(p => p.map(o => o.id === updated.id ? updated : o))
    setEditing(null)
    setSelected(updated)
  }

  const exportXLSX = async () => {
    const XLSX = (await import('xlsx')).default
    const rows: Record<string, string>[] = []
    filtered.forEach(o => o.items.forEach(it => rows.push({
      'Номер': o.id, 'Дата создания': fmtDateTime(o.createdAt),
      'Дата отгрузки': o.shipmentDate ? fmtShort(parseISO(o.shipmentDate)) : '',
      'Способ': o.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка',
      'Контрагент': o.clientName, 'Адрес': o.deliveryAddress,
      'Продукт': it.product, 'Заморозка': it.frozen ? 'да' : '',
      'Тара': PKG[it.packaging]?.label ?? it.packaging,
      'Кол-во': it.qty, 'Ед.': PKG[it.packaging]?.unit ?? '',
      'Объём, кг': orderVolumeKg(o).toFixed(1),
      'Комментарий': o.comment || '', 'Статус': STATUSES[o.status]?.label ?? o.status,
    })))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Заявки')
    XLSX.writeFile(wb, `Заявки_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.xlsx`)
  }

  const tabBtn = (a: boolean): React.CSSProperties => ({ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '.04em', padding: '8px 16px', borderRadius: 9999, border: `1.5px solid ${a ? '#c94030' : '#e8d9c4'}`, background: a ? '#c94030' : 'transparent', color: a ? 'white' : '#3d2b1f', cursor: 'pointer' })

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '20px 24px' }}>
      {/* Filters */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', boxShadow: '0 2px 8px rgba(61,43,31,.07)', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
          {(['pending', 'accepted', 'shipped', 'archive'] as Tab[]).map(t => (
            <button key={t} style={tabBtn(tab === t)} onClick={() => setTab(t)}>
              {STATUSES[t].label} ({counts[t]})
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button onClick={() => setPrinting(filtered)} style={{ background: '#3d2b1f', color: 'white', padding: '8px 16px', borderRadius: 7, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, border: 'none', whiteSpace: 'nowrap' }}>🖨 Бланки</button>
          <button onClick={exportXLSX} style={{ background: '#1D6F42', color: 'white', padding: '8px 16px', borderRadius: 7, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, border: 'none', whiteSpace: 'nowrap' }}>↓ Excel</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px,1.4fr) minmax(180px,1.2fr) minmax(180px,1fr) minmax(220px,1.2fr)', gap: 10, alignItems: 'end' }}>
          <div><div style={lbl}>Поиск</div><input style={inp} placeholder="🔍 Номер, адрес, продукт…" value={search} onChange={e => setSearch(e.target.value)} /></div>
          <div><div style={lbl}>Контрагент</div>
            <select style={inp} value={cpFilter} onChange={e => setCpFilter(e.target.value)}>
              <option value="">Все контрагенты</option>
              {cps.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div><div style={lbl}>Объём, кг</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input style={inp} placeholder="от" type="number" value={volMin} onChange={e => setVolMin(e.target.value)} />
              <span style={{ color: '#9a8070' }}>–</span>
              <input style={inp} placeholder="до" type="number" value={volMax} onChange={e => setVolMax(e.target.value)} />
            </div>
          </div>
          <div><div style={lbl}>Дата отгрузки</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="date" style={inp} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
              <span style={{ color: '#9a8070' }}>–</span>
              <input type="date" style={inp} value={dateTo} onChange={e => setDateTo(e.target.value)} />
              {(dateFrom || dateTo) && <button onClick={() => { setDateFrom(''); setDateTo('') }} style={{ background: 'none', border: 'none', color: '#9a8070', fontSize: 18, padding: '0 4px' }}>×</button>}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 18 }}>
        {Object.entries(STATUSES).map(([k, v]) => (
          <div key={k} style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', boxShadow: '0 2px 8px rgba(61,43,31,.07)', borderLeft: `3px solid ${v.color}` }}>
            <div style={{ fontFamily: "'PT Serif', serif", fontSize: 24, fontWeight: 700, color: '#3d2b1f' }}>{counts[k as Tab]}</div>
            <div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 12, color: '#9a8070' }}>{v.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0
        ? <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'PT Sans', sans-serif", fontSize: 15, color: '#9a8070' }}>Заявок не найдено</div>
        : <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(61,43,31,.07)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                {['№', 'Создан', 'Отгрузка', 'Контрагент', 'Адрес / способ', 'Позиции', 'Объём', 'Статус'].map(h => <th key={h} style={thS}>{h}</th>)}
              </tr></thead>
              <tbody>{filtered.map(o => {
                const isNew = Date.now() - new Date(o.createdAt).getTime() < 10 * 60 * 1000 && o.status === 'pending'
                return (
                  <tr key={o.id} style={{ cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fef9f8')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                    onClick={() => setSelected(o)}>
                    <td style={tdS}>{isNew && <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#c94030', marginRight: 5 }} />}<span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11, color: '#9a8070' }}>{o.id}</span></td>
                    <td style={{ ...tdS, fontSize: 11, color: '#6b5245' }}>{fmtDateTime(o.createdAt)}</td>
                    <td style={{ ...tdS, fontWeight: 700 }}>{o.shipmentDate ? fmtShort(parseISO(o.shipmentDate)) : '—'}</td>
                    <td style={{ ...tdS, fontWeight: 700 }}>{o.clientName}</td>
                    <td style={{ ...tdS, fontSize: 12, color: '#6b5245' }}>
                      <div>{o.deliveryAddress}</div>
                      <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 10, color: '#9a8070', textTransform: 'uppercase', letterSpacing: '.05em', marginTop: 2 }}>{o.deliveryType === 'pickup' ? 'самовывоз' : 'доставка'}</div>
                    </td>
                    <td style={{ ...tdS, color: '#6b5245', fontSize: 12 }}>{o.items.length} поз.</td>
                    <td style={tdS}><span style={{ fontFamily: "'PT Serif', serif", fontWeight: 700 }}>{Math.round(orderVolumeKg(o))}</span> <span style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 11, color: '#9a8070' }}>кг</span></td>
                    <td style={tdS}><Badge status={o.status} /></td>
                  </tr>
                )
              })}</tbody>
            </table>
          </div>
      }

      {/* Detail modal */}
      {selected && !editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(61,43,31,.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 16px 48px rgba(61,43,31,.2)', width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #e8d9c4', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: "'PT Serif', serif", fontSize: 18, fontWeight: 700, color: '#3d2b1f' }}>Заявка № {selected.id}</div>
                <div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 12, color: '#9a8070', marginTop: 3 }}>создана {fmtDateTime(selected.createdAt)}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 22, color: '#9a8070' }}>×</button>
            </div>
            <div style={{ padding: '18px 22px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div><div style={{ ...lbl, marginBottom: 3 }}>Контрагент</div><div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 14, color: '#3d2b1f' }}>{selected.clientName}</div></div>
                <div><div style={{ ...lbl, marginBottom: 3 }}>Способ</div><div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 14, color: '#3d2b1f' }}>{selected.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'}</div></div>
                <div style={{ gridColumn: '1 / span 2' }}><div style={{ ...lbl, marginBottom: 3 }}>Адрес</div><div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 14, color: '#3d2b1f' }}>{selected.deliveryAddress}</div></div>
                {selected.shipmentDate && <div><div style={{ ...lbl, marginBottom: 3 }}>Дата отгрузки</div><div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 14, color: '#3d2b1f', fontWeight: 700 }}>{fmtShort(parseISO(selected.shipmentDate))}</div></div>}
                <div><div style={{ ...lbl, marginBottom: 3 }}>Объём</div><div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 14, color: '#3d2b1f', fontWeight: 700 }}>{Math.round(orderVolumeKg(selected))} кг</div></div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 14 }}>
                <thead><tr>{['Продукт', 'Тара', 'Кол-во', 'Заморозка'].map(h => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                <tbody>{selected.items.map((it, i) => (
                  <tr key={i}>
                    <td style={tdS}>{it.product}</td>
                    <td style={tdS}>{PKG[it.packaging]?.label ?? it.packaging}</td>
                    <td style={tdS}>{it.qty} {PKG[it.packaging]?.unit ?? ''}</td>
                    <td style={tdS}>{it.frozen ? <span style={{ color: '#4a7da8' }}>❄ {it.frozenComment || 'да'}</span> : <span style={{ color: '#9a8070' }}>—</span>}</td>
                  </tr>
                ))}</tbody>
              </table>

              {selected.comment && <div style={{ background: '#f5edd6', borderRadius: 8, padding: '10px 14px', fontFamily: "'PT Sans', sans-serif", fontSize: 13, color: '#6b5245', marginBottom: 14 }}>💬 {selected.comment}</div>}

              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <button onClick={() => setEditing(selected)} style={{ background: '#3d2b1f', color: '#fff', padding: '9px 18px', borderRadius: 8, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, border: 'none' }}>✎ Редактировать</button>
                <button onClick={() => setPrinting([selected])} style={{ background: 'none', border: '1.5px solid #e8d9c4', color: '#3d2b1f', padding: '9px 18px', borderRadius: 8, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12 }}>🖨 Печать бланка</button>
              </div>

              <div style={{ ...lbl, marginBottom: 8 }}>Статус</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Object.entries(STATUSES).map(([k, v]) => (
                  <button key={k} onClick={() => changeStatus(selected.id, k as Order['status'])}
                    style={{ flex: '1 1 calc(50% - 4px)', padding: '10px', borderRadius: 8, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, border: `2px solid ${v.color}`, background: selected.status === k ? v.color : 'transparent', color: selected.status === k ? 'white' : v.color, cursor: 'pointer' }}>
                    {v.label}{selected.status === k ? ' ✓' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {editing && <OrderEditModal order={editing} onClose={() => setEditing(null)} onSave={onEditSave} />}
      {printing && <PrintBlanks orders={printing} onClose={() => setPrinting(null)} />}
    </div>
  )
}
