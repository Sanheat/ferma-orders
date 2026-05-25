'use client'
import { useState } from 'react'
import { getCounterparties, saveCounterparties, genId } from '@/lib/storage'
import type { Counterparty } from '@/lib/types'

const inp: React.CSSProperties = { width: '100%', fontFamily: "'PT Sans', sans-serif", fontSize: 14, color: '#3d2b1f', background: '#fff', border: '1.5px solid #e8d9c4', borderRadius: 8, padding: '9px 12px', outline: 'none' }
const lbl: React.CSSProperties = { display: 'block', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: '#6b5245', marginBottom: 4 }
const thS: React.CSSProperties = { fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: '#9a8070', padding: '10px 14px', textAlign: 'left', background: '#f5edd6', borderBottom: '1px solid #e8d9c4', whiteSpace: 'nowrap' }
const tdS: React.CSSProperties = { fontFamily: "'PT Sans', sans-serif", fontSize: 13, color: '#3d2b1f', padding: '12px 14px', borderBottom: '1px solid #e8d9c4', verticalAlign: 'middle' }

export default function Counterparties() {
  const [list, setList] = useState<Counterparty[]>(getCounterparties)
  const [editing, setEditing] = useState<Counterparty | null>(null)
  const [reveal, setReveal] = useState<Record<string, boolean>>({})

  const persist = (next: Counterparty[]) => { setList(next); saveCounterparties(next) }
  const startNew = () => setEditing({ id: 'cp_' + genId(), name: '', login: '', password: '', address: '' })
  const startEdit = (c: Counterparty) => setEditing({ ...c })

  const save = () => {
    if (!editing) return
    if (!editing.name.trim() || !editing.login.trim() || !editing.password.trim()) { alert('Заполните название, логин и пароль'); return }
    const cleaned = { ...editing, address: (editing.address ?? '').trim() }
    const next = list.find(c => c.id === cleaned.id) ? list.map(c => c.id === cleaned.id ? cleaned : c) : [...list, cleaned]
    persist(next); setEditing(null)
  }

  const remove = (id: string) => { if (!confirm('Удалить контрагента?')) return; persist(list.filter(c => c.id !== id)) }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 14, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: "'PT Serif', serif", fontSize: 20, fontWeight: 700, color: '#3d2b1f' }}>Контрагенты</div>
          <div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 13, color: '#6b5245' }}>Логины, пароли и точки доставки · одна точка на контрагента</div>
        </div>
        <button onClick={startNew} style={{ background: '#c94030', color: '#fff', padding: '9px 18px', borderRadius: 8, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, border: 'none' }}>+ Добавить контрагента</button>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(61,43,31,.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            <th style={thS}>Контрагент</th><th style={thS}>Логин</th><th style={thS}>Пароль</th><th style={thS}>Точка доставки</th>
            <th style={{ ...thS, width: 160, textAlign: 'right' }}>Действия</th>
          </tr></thead>
          <tbody>{list.map(c => (
            <tr key={c.id}>
              <td style={{ ...tdS, fontWeight: 700 }}>{c.name}</td>
              <td style={{ ...tdS, fontFamily: 'monospace', fontSize: 12 }}>{c.login}</td>
              <td style={{ ...tdS, fontFamily: 'monospace', fontSize: 12, whiteSpace: 'nowrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span>{reveal[c.id] ? c.password : '••••••••'}</span>
                  <button onClick={() => setReveal(r => ({ ...r, [c.id]: !r[c.id] }))} style={{ background: 'none', border: 'none', color: '#c94030', cursor: 'pointer', fontSize: 11 }}>{reveal[c.id] ? 'скрыть' : 'показать'}</button>
                  <button onClick={() => { navigator.clipboard.writeText(c.password); alert('Скопировано') }} style={{ background: 'none', border: 'none', color: '#9a8070', cursor: 'pointer', fontSize: 11 }}>копировать</button>
                </span>
              </td>
              <td style={tdS}>{c.address || <span style={{ color: '#9a8070' }}>— не указана —</span>}</td>
              <td style={{ ...tdS, textAlign: 'right', whiteSpace: 'nowrap' }}>
                <div style={{ display: 'inline-flex', gap: 6 }}>
                  <button onClick={() => startEdit(c)} style={{ background: 'none', border: '1px solid #e8d9c4', color: '#3d2b1f', padding: '5px 12px', borderRadius: 6, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11 }}>Изменить</button>
                  <button onClick={() => remove(c.id)} style={{ background: 'none', border: '1px solid #e8d9c4', color: '#c94030', padding: '5px 12px', borderRadius: 6, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11 }}>Удалить</button>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(61,43,31,.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => e.target === e.currentTarget && setEditing(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 520 }}>
            <div style={{ fontFamily: "'PT Serif', serif", fontSize: 18, fontWeight: 700, color: '#3d2b1f', marginBottom: 16 }}>
              {list.find(c => c.id === editing.id) ? 'Редактирование' : 'Новый контрагент'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div style={{ gridColumn: '1 / span 2' }}>
                <label style={lbl}>Название</label>
                <input style={inp} value={editing.name} onChange={e => setEditing(p => p && ({ ...p, name: e.target.value }))} placeholder="ИП Иванов И.И." />
              </div>
              <div>
                <label style={lbl}>Логин</label>
                <input style={inp} value={editing.login} onChange={e => setEditing(p => p && ({ ...p, login: e.target.value.replace(/\s/g, '') }))} placeholder="ivanov" />
              </div>
              <div>
                <label style={lbl}>Пароль</label>
                <input style={inp} value={editing.password} onChange={e => setEditing(p => p && ({ ...p, password: e.target.value }))} placeholder="••••••••" />
              </div>
              <div style={{ gridColumn: '1 / span 2' }}>
                <label style={lbl}>Точка доставки</label>
                <input style={inp} value={editing.address ?? ''} onChange={e => setEditing(p => p && ({ ...p, address: e.target.value }))} placeholder="г. Москва, ул., д." />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: '1.5px solid #e8d9c4', color: '#3d2b1f', padding: '10px 20px', borderRadius: 8, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13 }}>Отмена</button>
              <button onClick={save} style={{ background: '#c94030', color: '#fff', padding: '10px 24px', borderRadius: 8, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, border: 'none' }}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
