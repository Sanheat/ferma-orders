'use client'
import { useRef, useState } from 'react'
import { getBanner, saveBanner } from '@/lib/storage'
import type { Banner } from '@/lib/types'
import ClientBanner from '@/components/client/ClientBanner'

const inp: React.CSSProperties = { width: '100%', fontFamily: "'PT Sans', sans-serif", fontSize: 14, color: '#3d2b1f', background: '#fff', border: '1.5px solid #e8d9c4', borderRadius: 8, padding: '9px 12px', outline: 'none' }
const lbl: React.CSSProperties = { display: 'block', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: '#6b5245', marginBottom: 4 }

export default function BannerEditor() {
  const [b, setB] = useState<Banner>(getBanner)
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (k: keyof Banner, v: string) => {
    const next = { ...b, [k]: v }
    setB(next)
    saveBanner(next)
  }

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = ev => set('image', ev.target?.result as string)
    reader.readAsDataURL(f)
  }

  const swatches = ['#c94030', '#e8a838', '#7a9e7e', '#3d2b1f', '#4a7da8']

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 24px' }}>
      <div style={{ fontFamily: "'PT Serif', serif", fontSize: 20, fontWeight: 700, color: '#3d2b1f', marginBottom: 4 }}>Баннер на главной клиента</div>
      <div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 13, color: '#6b5245', marginBottom: 16 }}>Меняйте картинку и текст — клиенты увидят изменения сразу</div>

      <div style={{ marginBottom: 16 }}><ClientBanner banner={b} /></div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px rgba(61,43,31,.07)' }}>
        <div><label style={lbl}>Заголовок</label><input style={inp} value={b.title} onChange={e => set('title', e.target.value)} /></div>
        <div><label style={lbl}>Подпись над заголовком</label><input style={inp} value={b.badge} onChange={e => set('badge', e.target.value)} /></div>
        <div style={{ gridColumn: '1 / span 2' }}><label style={lbl}>Описание</label><input style={inp} value={b.subtitle} onChange={e => set('subtitle', e.target.value)} /></div>
        <div>
          <label style={lbl}>Цвет фона</label>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            {swatches.map(s => (
              <button key={s} onClick={() => set('bg', s)}
                style={{ width: 30, height: 30, borderRadius: '50%', border: b.bg === s ? `3px solid #3d2b1f` : '1px solid #e8d9c4', background: s, cursor: 'pointer' }} />
            ))}
          </div>
        </div>
        <div>
          <label style={lbl}>Изображение</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="button" onClick={() => fileRef.current?.click()} style={{ background: '#3d2b1f', color: '#fff', padding: '9px 14px', borderRadius: 8, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, border: 'none' }}>Загрузить файл</button>
            {b.image && <button onClick={() => set('image', '')} style={{ background: 'none', border: 'none', color: '#c94030', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12 }}>Убрать</button>}
            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
