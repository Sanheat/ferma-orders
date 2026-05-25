'use client'
import { PRODUCTS } from '@/lib/data'
import { getCounterparties } from '@/lib/storage'
import { parseISO, RU_MONTHS_SHORT } from '@/lib/dates'
import type { Order } from '@/lib/types'

interface Props { orders: Order[]; onClose: () => void }

const PRINT_CSS = `
  @page { size: A4 landscape; margin: 6mm; }
  @media print {
    html, body { background: white !important; }
    .lp-print-root { background: white !important; position: static !important; }
    .lp-print-toolbar { display: none !important; }
    .lp-blank-page { box-shadow: none !important; margin: 0 !important; page-break-after: always; }
    .lp-blank-page:last-child { page-break-after: auto; }
  }
  .lp-blank-page { background:white; width:285mm; height:200mm; margin:14px auto; box-shadow:0 4px 24px rgba(0,0,0,.25); padding:4mm; box-sizing:border-box; display:grid; grid-template-columns:1fr 1fr; gap:4mm; }
  .lp-blank { border:1.2px solid #000; display:flex; flex-direction:column; font-family:'PT Serif','Times New Roman',serif; color:#000; overflow:hidden; }
  .lp-blank-driver-label { padding:1.4mm 2mm; font-weight:700; font-size:11pt; border-bottom:1.2px solid #000; }
  .lp-blank-driver-write { display:grid; grid-template-columns:1fr 1fr; height:7mm; border-bottom:1.2px solid #000; }
  .lp-blank-driver-write > div:first-child { border-right:1.2px solid #000; }
  .lp-blank-meta { padding:1mm 2mm; font-size:7.5pt; color:#333; border-bottom:1.2px solid #000; display:flex; justify-content:space-between; gap:4mm; font-family:'PT Sans',Arial,sans-serif; }
  .lp-blank-head,.lp-blank-row { display:grid; grid-template-columns:1fr 7mm 7mm 7mm 7mm 11mm; border-bottom:1px solid #000; }
  .lp-blank-head > div,.lp-blank-row > div { border-right:1px solid #000; padding:0.6mm 1mm; font-size:8pt; line-height:1.1; display:flex; align-items:center; }
  .lp-blank-head > div { font-weight:700; justify-content:center; text-align:center; min-height:14mm; }
  .lp-blank-head > div:first-child { justify-content:flex-start; padding-left:2mm; }
  .lp-blank-head > div:last-child,.lp-blank-row > div:last-child { border-right:none; }
  .lp-blank-row { min-height:5.4mm; }
  .lp-blank-row .name { font-weight:700; font-size:8.5pt; font-family:'PT Sans',Arial,sans-serif; letter-spacing:-0.01em; }
  .lp-blank-row .qty { justify-content:center; font-weight:700; color:#b6231b; font-family:'PT Sans',Arial,sans-serif; }
  .lp-blank-vert { writing-mode:vertical-rl; transform:rotate(180deg); text-align:center; font-size:7pt; line-height:1; letter-spacing:0.5px; }
  .lp-blank-etk { padding:1mm 2mm; font-weight:700; font-size:8.5pt; border-bottom:1px solid #000; background:#fafafa; font-family:'PT Sans',Arial,sans-serif; }
`

export default function PrintBlanks({ orders, onClose }: Props) {
  const today = new Date()
  const todayStr = `${String(today.getDate()).padStart(2, '0')} ${RU_MONTHS_SHORT[today.getMonth()].toUpperCase()} ${today.getFullYear()}`

  const blanks = orders.map(order => {
    const cp = getCounterparties().find(c => c.id === order.clientId)
    const addrLabel = cp?.address ?? order.deliveryAddress ?? ''
    const rows = PRODUCTS.map(p => {
      const items = order.items.filter(it => it.product === p.name)
      let podl = '', yashik = '', kg = ''
      items.forEach(it => {
        const q = it.qty
        if (it.packaging === 'yasik')      yashik = (yashik ? yashik + '+' : '') + q
        else if (it.packaging === 'lotok') podl   = (podl   ? podl   + '+' : '') + q
        else if (it.packaging === 'paket') kg     = (kg     ? kg     + '+' : '') + q
      })
      return { name: p.blank, podl, yashik, kg }
    })
    const shipD = order.shipmentDate ? parseISO(order.shipmentDate) : null
    const dateStr = shipD ? `${String(shipD.getDate()).padStart(2,'0')} ${RU_MONTHS_SHORT[shipD.getMonth()].toUpperCase()} ${shipD.getFullYear()}` : todayStr
    return { rows, addr: addrLabel, dateStr, id: order.id, cpName: order.clientName }
  })

  const pages: (typeof blanks[0] | undefined)[][] = []
  for (let i = 0; i < blanks.length; i += 2) pages.push([blanks[i], blanks[i + 1]])

  return (
    <div className="lp-print-root" style={{ position: 'fixed', inset: 0, background: '#666', zIndex: 500, overflowY: 'auto' }}>
      <style>{PRINT_CSS}</style>

      <div className="lp-print-toolbar" style={{ background: '#3d2b1f', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 1 }}>
        <div style={{ color: '#fff', fontFamily: "'PT Serif', serif", fontWeight: 700, fontSize: 14 }}>🖨 Бланки · {blanks.length} шт. (2 на лист)</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => window.print()} style={{ background: '#c94030', color: '#fff', padding: '8px 18px', borderRadius: 6, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, border: 'none' }}>Печать / PDF</button>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid #5e4426', color: '#c9b299', padding: '8px 18px', borderRadius: 6, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12 }}>Закрыть</button>
        </div>
      </div>

      {pages.map((pair, pi) => (
        <div key={pi} className="lp-blank-page">
          {[0, 1].map(bi => {
            const b = pair[bi]
            if (!b) return <div key={bi} style={{ visibility: 'hidden' }} />
            return (
              <div key={bi} className="lp-blank">
                <div className="lp-blank-driver-label">Водитель:</div>
                <div className="lp-blank-driver-write"><div /><div /></div>
                <div className="lp-blank-meta">
                  <span>Контрагент: <b>{b.cpName}</b> · {b.addr}</span>
                  <span>№{b.id}</span>
                  <span>{b.dateStr}</span>
                </div>
                <div className="lp-blank-etk">ЭТИКЕТКА:</div>
                <div className="lp-blank-head">
                  <div>Наименование товара</div>
                  <div className="lp-blank-vert">П О Д Л</div>
                  <div className="lp-blank-vert">Я Щ И К</div>
                  <div className="lp-blank-vert">Ш Т У К</div>
                  <div className="lp-blank-vert">К Г</div>
                  <div className="lp-blank-vert">Накл. №</div>
                </div>
                {b.rows.map((r, ri) => (
                  <div key={ri} className="lp-blank-row">
                    <div className="name">{r.name}</div>
                    <div className="qty">{r.podl}</div>
                    <div className="qty">{r.yashik}</div>
                    <div className="qty"></div>
                    <div className="qty">{r.kg}</div>
                    <div></div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
