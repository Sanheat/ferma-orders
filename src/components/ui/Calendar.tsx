'use client'
import { useState } from 'react'
import { parseISO, isoDate, sameDay, isWeekday, RU_MONTHS } from '@/lib/dates'

interface Props {
  value: string
  minDate?: Date
  onChange: (iso: string) => void
}

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export default function Calendar({ value, minDate, onChange }: Props) {
  const sel = value ? parseISO(value) : null
  const [view, setView] = useState(() => {
    const base = sel ?? minDate ?? new Date()
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  const first = new Date(view.getFullYear(), view.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.getFullYear(), view.getMonth(), d))
  while (cells.length % 7 !== 0) cells.push(null)

  const min = minDate ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()) : null
  const today = new Date(); today.setHours(0, 0, 0, 0)

  return (
    <div style={{ background: '#fff', border: '1.5px solid #e8d9c4', borderRadius: 12, padding: 14, width: 300, fontFamily: "'PT Sans', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <button type="button" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
          style={{ background: 'none', border: 'none', fontSize: 18, color: '#6b5245', padding: '4px 8px' }}>‹</button>
        <div style={{ fontFamily: "'PT Serif', serif", fontWeight: 700, fontSize: 14, color: '#3d2b1f' }}>
          {RU_MONTHS[view.getMonth()][0].toUpperCase() + RU_MONTHS[view.getMonth()].slice(1)} {view.getFullYear()}
        </div>
        <button type="button" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
          style={{ background: 'none', border: 'none', fontSize: 18, color: '#6b5245', padding: '4px 8px' }}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 6 }}>
        {DAYS.map(w => (
          <div key={w} style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 10, color: '#9a8070', textAlign: 'center', padding: '4px 0' }}>{w}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
        {cells.map((c, i) => {
          if (!c) return <div key={i} style={{ height: 32 }} />
          const disabled = !isWeekday(c) || (min !== null && min !== undefined && c < min)
          const isSel = sel ? sameDay(c, sel) : false
          const isToday = sameDay(c, today)
          return (
            <button key={i} type="button" disabled={disabled} onClick={() => onChange(isoDate(c))}
              style={{
                height: 32, borderRadius: 8, border: 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontFamily: "'PT Sans', sans-serif", fontSize: 13, fontWeight: isSel ? 700 : 500,
                background: isSel ? '#c94030' : isToday ? '#fef0ed' : 'transparent',
                color: disabled ? '#d4c5b3' : isSel ? 'white' : '#3d2b1f',
                opacity: disabled ? 0.5 : 1,
              }}>
              {c.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
