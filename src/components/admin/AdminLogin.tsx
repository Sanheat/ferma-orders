'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ADMIN_PASSWORD } from '@/lib/data'
import Logo from '@/components/ui/Logo'

const inp = { width: '100%', fontFamily: "'PT Sans', sans-serif", fontSize: 14, color: '#3d2b1f', background: '#fff', border: '1.5px solid #e8d9c4', borderRadius: 8, padding: '9px 12px', outline: 'none' }
const lbl = { display: 'block', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase' as const, color: '#6b5245', marginBottom: 4 }

interface Props { onLogin?: () => void }

export default function AdminLogin({ onLogin }: Props) {
  const router = useRouter()
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      onLogin ? onLogin() : router.push('/admin/orders')
    } else {
      setErr(true)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#3d2b1f', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 16px 48px rgba(0,0,0,.25)', padding: '40px 36px', width: '100%', maxWidth: 360 }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: '#9a8070', background: '#f5edd6', display: 'inline-block', padding: '4px 10px', borderRadius: 9999, marginBottom: 18 }}>ПАНЕЛЬ МЕНЕДЖЕРА</div>
        <div style={{ fontFamily: "'PT Serif', serif", fontSize: 22, fontWeight: 700, color: '#3d2b1f', marginBottom: 6 }}>Вход для сотрудников</div>
        <div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 13, color: '#6b5245', marginBottom: 26 }}>Ферма Лычкиных · Система заявок</div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: err ? 4 : 16 }}>
            <label style={lbl}>Пароль</label>
            <input style={{ ...inp, borderColor: err ? '#c94030' : '#e8d9c4' }}
              type="password" value={pw}
              onChange={e => { setPw(e.target.value); setErr(false) }} required />
          </div>
          {err && <div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 12, color: '#c94030', marginBottom: 12 }}>Неверный пароль</div>}
          <button type="submit" style={{ width: '100%', background: '#3d2b1f', color: '#fdfaf4', padding: '13px', borderRadius: 8, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 15, border: 'none', marginTop: 4 }}>Войти</button>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <a href="/" style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 12, color: '#9a8070', textDecoration: 'underline' }}>← К форме заказа</a>
        </div>
      </div>
    </div>
  )
}
