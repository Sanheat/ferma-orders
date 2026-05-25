'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getOrders, saveClient } from '@/lib/storage'
import { PKG } from '@/lib/data'
import { fmtDateTime, fmtShort, parseISO } from '@/lib/dates'
import type { Counterparty } from '@/lib/types'
import Logo from '@/components/ui/Logo'
import Badge from '@/components/ui/Badge'

const thS: React.CSSProperties = { fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: '#9a8070', padding: '8px 16px', textAlign: 'left', background: '#f5edd6', borderBottom: '1px solid #e8d9c4' }
const tdS: React.CSSProperties = { fontFamily: "'PT Sans', sans-serif", fontSize: 13, color: '#3d2b1f', padding: '10px 16px', borderBottom: '1px solid #e8d9c4' }

export default function OrderHistory({ counterparty }: { counterparty: Counterparty }) {
  const router = useRouter()
  const orders = getOrders().filter(o => o.clientId === counterparty.id || o.clientName === counterparty.name)
  const logout = () => { saveClient(null); router.push('/') }

  return (
    <div style={{ background: '#fdfaf4', minHeight: '100vh', paddingBottom: 60 }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e8d9c4', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <button onClick={() => router.push('/order')} style={{ background: 'none', border: 'none', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, color: '#c94030' }}>← Новый заказ</button>
            <button onClick={logout} style={{ background: 'none', border: '1px solid #e8d9c4', borderRadius: 6, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11, color: '#9a8070', padding: '5px 12px' }}>Выйти</button>
          </div>
        </div>
      </div>

      <div className="cp-hist-page">
        <div className="cp-hist-title">История заказов</div>
        <div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 13, color: '#6b5245', marginTop: -20 }}>{counterparty.name}</div>

        {orders.length === 0
          ? <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'PT Sans', sans-serif", fontSize: 15, color: '#9a8070' }}>Заказов пока нет</div>
          : <div className="cp-hist-orders">
              {orders.map(order => (
                <div key={order.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(61,43,31,.08)', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e8d9c4', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11, color: '#9a8070' }}>№ {order.id}</span>
                      <span style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 12, color: '#9a8070' }}>создан {fmtDateTime(order.createdAt)}</span>
                      {order.shipmentDate && <span style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 12, color: '#3d2b1f', fontWeight: 700 }}>отгрузка {fmtShort(parseISO(order.shipmentDate))}</span>}
                      <span style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 12, color: '#6b5245' }}>{order.deliveryType === 'pickup' ? 'самовывоз' : 'доставка'}</span>
                    </div>
                    <Badge status={order.status} />
                  </div>
                  <div style={{ padding: '4px 18px', fontFamily: "'PT Sans', sans-serif", fontSize: 12, color: '#6b5245' }}>{order.deliveryAddress}</div>
                  <div className="cp-hist-expand">
                    <table className="cp-hist-table" style={{ borderCollapse: 'collapse' }}>
                      <thead><tr><th style={thS}>Продукт</th><th style={thS}>Тара</th><th style={thS}>Кол-во</th><th style={thS}>Заморозка</th></tr></thead>
                      <tbody>{order.items.map((it, i) => (
                        <tr key={i}>
                          <td style={tdS}>{it.product}</td>
                          <td style={tdS}>{PKG[it.packaging]?.label ?? it.packaging}</td>
                          <td style={tdS}>{it.qty} {PKG[it.packaging]?.unit ?? ''}</td>
                          <td style={tdS}>{it.frozen ? <span style={{ color: '#4a7da8' }}>❄ да{it.frozenComment ? ` · ${it.frozenComment}` : ''}</span> : <span style={{ color: '#9a8070' }}>—</span>}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                  {order.comment && <div style={{ padding: '8px 18px', fontFamily: "'PT Sans', sans-serif", fontSize: 12, color: '#6b5245', background: '#f5edd6' }}>💬 {order.comment}</div>}
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  )
}
