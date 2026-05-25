'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCounterparties, saveClient } from '@/lib/storage'
import Logo from '@/components/ui/Logo'

const s = {
  inp: { width: '100%', fontFamily: "'PT Sans', sans-serif", fontSize: 14, color: '#191414', background: '#fff', border: '1.5px solid #C6C3C3', borderRadius: 8, padding: '9px 12px', outline: 'none' } as React.CSSProperties,
  lbl: { display: 'block', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase' as const, color: '#514C4B', marginBottom: 4 },
}

export default function ClientLogin() {
  const router = useRouter()
  const [login, setLogin] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const cps = getCounterparties()
    const found = cps.find(c => c.login === login.trim() && c.password === pw)
    if (!found) { setErr('Неверный логин или пароль'); return }
    saveClient({ id: found.id })
    router.push('/order')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-beige-50)', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(16,24,40,.12)', padding: '40px 36px', width: '100%', maxWidth: 440 }}>
        <div style={{ marginBottom: 24 }}><Logo /></div>
        <div style={{ fontFamily: "'PT Serif', serif", fontSize: 22, fontWeight: 700, color: '#191414', marginBottom: 6 }}>Личный кабинет</div>
        <div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 14, color: '#514C4B', marginBottom: 28 }}>Введите логин и пароль контрагента</div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: 14 }}>
            <label style={s.lbl}>Логин</label>
            <input style={{ ...s.inp, borderColor: err ? '#C94030' : '#C6C3C3' }}
              value={login} onChange={e => { setLogin(e.target.value); setErr('') }}
              placeholder="например, sokolova" required />
          </div>
          <div style={{ marginBottom: err ? 6 : 20 }}>
            <label style={s.lbl}>Пароль</label>
            <input type="password" style={{ ...s.inp, borderColor: err ? '#C94030' : '#C6C3C3' }}
              value={pw} onChange={e => { setPw(e.target.value); setErr('') }} required />
          </div>
          {err && <div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 12, color: '#C94030', marginBottom: 14 }}>{err}</div>}
          <button type="submit" style={{ width: '100%', background: '#C94030', color: '#fff', padding: '13px', borderRadius: 8, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: '.04em', border: 'none' }}>
            Войти
          </button>
        </form>

        <div style={{ marginTop: 18, padding: '10px 12px', background: '#F5F0DF', borderRadius: 8, fontFamily: "'PT Sans', sans-serif", fontSize: 11, color: '#514C4B' }}>
          Демо-доступ: <b>sokolova / sok-2026</b>, <b>plus / plus-prod-26</b>
        </div>
        <div style={{ marginTop: 14, textAlign: 'center', fontFamily: "'PT Sans', sans-serif", fontSize: 12, color: '#7E7979' }}>
          Сотрудникам:{' '}
          <a href="/admin" style={{ color: '#C94030', textDecoration: 'underline' }}>панель менеджера</a>
        </div>
      </div>
    </div>
  )
}
