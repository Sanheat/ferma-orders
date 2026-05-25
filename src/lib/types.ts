export type PackagingId = 'yasik' | 'paket' | 'lotok'

export interface Packaging {
  id: PackagingId
  label: string
  note: string
  unit: string
  type: 'counter' | 'kg'
  step: number
}

export interface Product {
  name: string
  price: number
  blank: string
  pkg: PackagingId[]
}

export type OrderStatus = 'pending' | 'accepted' | 'shipped' | 'archive'

export interface StatusMeta {
  label: string
  color: string
  bg: string
}

export interface OrderItem {
  product: string
  packaging: PackagingId
  qty: string
  frozen: boolean
  frozenComment: string
}

export interface Order {
  id: string
  clientId: string
  clientName: string
  deliveryAddress: string
  deliveryType: 'delivery' | 'pickup'
  shipmentDate: string
  createdAt: string
  items: OrderItem[]
  comment: string
  status: OrderStatus
}

export interface Counterparty {
  id: string
  name: string
  login: string
  password: string
  address: string
}

export interface Banner {
  kind: string
  title: string
  subtitle: string
  badge: string
  bg: string
  image: string
}

export interface SavedClient {
  id: string
}
