import type { Order, Counterparty, Banner, SavedClient } from './types'
import { DEFAULT_CP, DEFAULT_BANNER } from './data'
import { isoDate, firstShipmentFrom, addWorkDays } from './dates'

const LS_O      = 'lp_orders4'
const LS_C      = 'lp_client2'
const LS_CP     = 'lp_counterparties2'
const LS_BANNER = 'lp_banner'

// ── Orders ──────────────────────────────────────────────────────────────────

export const getOrders = (): Order[] => {
  try { return JSON.parse(localStorage.getItem(LS_O) || '[]') } catch { return [] }
}
export const saveOrders = (orders: Order[]): void =>
  localStorage.setItem(LS_O, JSON.stringify(orders))

export const addOrder = (o: Order): void => {
  const all = getOrders()
  all.unshift(o)
  saveOrders(all)
}

export const updateOrder = (id: string, patch: Partial<Order>): void => {
  const all = getOrders()
  const i = all.findIndex(o => o.id === id)
  if (i > -1) { all[i] = { ...all[i], ...patch }; saveOrders(all) }
}

export const setOrderStatus = (id: string, status: Order['status']): void =>
  updateOrder(id, { status })

// ── Client session ──────────────────────────────────────────────────────────

export const getClient = (): SavedClient | null => {
  try { return JSON.parse(localStorage.getItem(LS_C) || 'null') } catch { return null }
}
export const saveClient = (c: SavedClient | null): void =>
  c ? localStorage.setItem(LS_C, JSON.stringify(c)) : localStorage.removeItem(LS_C)

// ── Counterparties ──────────────────────────────────────────────────────────

const migrateCp = (c: Counterparty & { addresses?: { address: string }[] }): Counterparty => {
  if (c.addresses && !c.address) {
    return { id: c.id, name: c.name, login: c.login, password: c.password, address: c.addresses[0]?.address || '' }
  }
  return { id: c.id, name: c.name, login: c.login, password: c.password, address: c.address || '' }
}

export const getCounterparties = (): Counterparty[] => {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_CP) || 'null')
    if (!raw) return DEFAULT_CP
    return raw.map(migrateCp)
  } catch { return DEFAULT_CP }
}

export const saveCounterparties = (list: Counterparty[]): void =>
  localStorage.setItem(LS_CP, JSON.stringify(list.map(migrateCp)))

// ── Banner ──────────────────────────────────────────────────────────────────

export const getBanner = (): Banner => {
  try { return JSON.parse(localStorage.getItem(LS_BANNER) || 'null') || DEFAULT_BANNER }
  catch { return DEFAULT_BANNER }
}
export const saveBanner = (b: Banner): void =>
  localStorage.setItem(LS_BANNER, JSON.stringify(b))

// ── Utils ────────────────────────────────────────────────────────────────────

export const genId = (): string =>
  Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase()

export const orderVolumeKg = (order: Order): number =>
  order.items.reduce((sum, it) => {
    const q = parseFloat(it.qty) || 0
    if (it.packaging === 'yasik') return sum + q * 14
    if (it.packaging === 'lotok') return sum + q * 0.9
    return sum + q
  }, 0)

// ── Demo seed ────────────────────────────────────────────────────────────────

export const seedDemo = (): void => {
  if (getOrders().length > 0) return
  const cp = getCounterparties()
  const t = Date.now()
  saveOrders([
    {
      id: 'DEMO01', clientId: cp[0].id, clientName: cp[0].name,
      deliveryAddress: cp[0].address, deliveryType: 'delivery',
      shipmentDate: isoDate(firstShipmentFrom()),
      createdAt: new Date(t - 2 * 3600 * 1000).toISOString(),
      items: [
        { product: 'Филе грудки ЦБ', packaging: 'yasik', qty: '2',  frozen: false, frozenComment: '' },
        { product: 'Бедро ЦБ',       packaging: 'paket', qty: '14', frozen: false, frozenComment: '' },
      ],
      comment: 'Доставить до 12:00', status: 'pending',
    },
    {
      id: 'DEMO02', clientId: cp[1].id, clientName: cp[1].name,
      deliveryAddress: cp[1].address, deliveryType: 'delivery',
      shipmentDate: isoDate(firstShipmentFrom()),
      createdAt: new Date(t - 5 * 3600 * 1000).toISOString(),
      items: [
        { product: 'Тушка ЦБ 1 сорт', packaging: 'yasik', qty: '3',  frozen: true,  frozenComment: 'Можно заморозку' },
        { product: 'Голень ЦБ',        packaging: 'lotok', qty: '20', frozen: false, frozenComment: '' },
        { product: 'Печень ЦБ',        packaging: 'paket', qty: '5',  frozen: false, frozenComment: '' },
      ],
      comment: '', status: 'accepted',
    },
    {
      id: 'DEMO03', clientId: cp[1].id, clientName: cp[1].name,
      deliveryAddress: cp[1].address, deliveryType: 'pickup',
      shipmentDate: isoDate(addWorkDays(firstShipmentFrom(), 1)),
      createdAt: new Date(t - 25 * 60 * 1000).toISOString(),
      items: [
        { product: 'Окорочка ЦБ', packaging: 'paket', qty: '20', frozen: false, frozenComment: '' },
        { product: 'Крылья ЦБ',   packaging: 'paket', qty: '10', frozen: false, frozenComment: '' },
      ],
      comment: 'Самовывоз после 11:00', status: 'pending',
    },
    {
      id: 'DEMO04', clientId: cp[2].id, clientName: cp[2].name,
      deliveryAddress: cp[2].address, deliveryType: 'delivery',
      shipmentDate: isoDate(addWorkDays(firstShipmentFrom(), -2)),
      createdAt: new Date(t - 3 * 86400 * 1000).toISOString(),
      items: [
        { product: 'Сердце ЦБ',  packaging: 'paket', qty: '4',  frozen: false, frozenComment: '' },
        { product: 'Печень ЦБ',  packaging: 'paket', qty: '10', frozen: false, frozenComment: '' },
        { product: 'Желудок ЦБ', packaging: 'paket', qty: '7',  frozen: false, frozenComment: '' },
      ],
      comment: '', status: 'shipped',
    },
    {
      id: 'DEMO05', clientId: cp[3].id, clientName: cp[3].name,
      deliveryAddress: cp[3].address, deliveryType: 'delivery',
      shipmentDate: isoDate(addWorkDays(firstShipmentFrom(), -5)),
      createdAt: new Date(t - 7 * 86400 * 1000).toISOString(),
      items: [
        { product: 'Тушка ЦБ 1 сорт', packaging: 'yasik', qty: '5', frozen: false, frozenComment: '' },
      ],
      comment: '', status: 'archive',
    },
  ])
}
