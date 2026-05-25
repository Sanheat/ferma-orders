import { parseISO, fmtLong } from '@/lib/dates'

export default function DeadlineHint({ shipDate }: { shipDate: string }) {
  return (
    <div style={{ background: '#f2f7f3', border: '1.5px solid #7a9e7e', borderRadius: 10, padding: '10px 14px', display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: '#384e3e' }}>Отгрузка</div>
      <div style={{ fontFamily: "'PT Serif', serif", fontWeight: 700, fontSize: 15, color: '#3d2b1f' }}>{fmtLong(parseISO(shipDate))}</div>
      <div style={{ flex: 1 }} />
      <div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 11, color: '#9a8070' }}>
        Заявки до 15:00 → отгрузка через 2 рабочих дня
      </div>
    </div>
  )
}
