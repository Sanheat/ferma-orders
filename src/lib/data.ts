import type { Packaging, PackagingId, Product, StatusMeta, OrderStatus } from './types'

export const PKG: Record<PackagingId, Packaging> = {
  yasik: { id: 'yasik', label: 'Ящик монолит', note: '≈14 кг',    unit: 'ящ.',  type: 'counter', step: 1 },
  paket: { id: 'paket', label: 'Пакет',         note: 'любой вес',  unit: 'кг',   type: 'kg',      step: 0.1 },
  lotok: { id: 'lotok', label: 'Лоток',          note: '≈0.8–1 кг', unit: 'лот.', type: 'counter', step: 2 },
}

export const PRODUCTS: Product[] = [
  { name: 'Тушка ЦБ 1 сорт',                  price: 235, blank: '1.ТУШКА 1 СОРТ',        pkg: ['yasik', 'paket', 'lotok'] },
  { name: 'Тушка ЦБ 2 сорт',                  price: 215, blank: '2.ТУШКА 2 СОРТ',        pkg: ['yasik', 'paket', 'lotok'] },
  { name: 'Бескостное мясо ЦБ',                price: 350, blank: '3.БЕСКОСТНОЕ МЯСО',    pkg: ['yasik'] },
  { name: 'Грудка ЦБ',                         price: 270, blank: '4.ГРУДКА',             pkg: ['yasik', 'paket', 'lotok'] },
  { name: 'Филе грудки ЦБ',                    price: 385, blank: '5.ФИЛЕ ГРУДКИ',        pkg: ['yasik', 'paket', 'lotok'] },
  { name: 'Окорочка ЦБ',                       price: 195, blank: '6.ОКОРОЧКА',           pkg: ['yasik', 'paket', 'lotok'] },
  { name: 'Бескостные окорочка ЦБ',            price: 380, blank: '7.БЕСКОСТ. ОКОРОЧКА', pkg: ['yasik', 'paket', 'lotok'] },
  { name: 'Голень ЦБ',                         price: 225, blank: '8.ГОЛЕНИ',             pkg: ['yasik', 'paket', 'lotok'] },
  { name: 'Бедро ЦБ',                          price: 210, blank: '9.БЕДРА',              pkg: ['yasik', 'paket', 'lotok'] },
  { name: 'Фарш ЦБ',                           price: 360, blank: '10.ФАРШ',              pkg: ['yasik', 'paket', 'lotok'] },
  { name: 'Крылья ЦБ',                         price: 240, blank: '11.КРЫЛЬЯ',            pkg: ['yasik', 'paket', 'lotok'] },
  { name: 'Набор для шашлыка ЦБ',              price: 290, blank: '12.НАБОР ШАШЛЫК',      pkg: ['yasik', 'paket', 'lotok'] },
  { name: 'Набор для рагу ЦБ',                 price: 235, blank: '13.НАБОР РАГУ',        pkg: ['yasik', 'paket', 'lotok'] },
  { name: 'Набор для бульона ЦБ (хребты)',     price: 50,  blank: '14.НАБОР ДЛЯ БУЛЬОНА', pkg: ['yasik', 'paket', 'lotok'] },
  { name: 'Набор для супа ЦБ (килевая кость)', price: 45,  blank: '15.НАБОР ДЛЯ СУПА',    pkg: ['yasik', 'paket'] },
  { name: 'Шеи ЦБ',                            price: 65,  blank: '16.ШЕИ',               pkg: ['yasik', 'paket', 'lotok'] },
  { name: 'Шеи без кожи ЦБ',                   price: 90,  blank: '17.ШЕИ БЕЗ КОЖИ',      pkg: ['yasik', 'paket'] },
  { name: 'Головы ЦБ',                         price: 60,  blank: '18.ГОЛОВЫ',            pkg: ['yasik', 'paket', 'lotok'] },
  { name: 'Ноги ЦБ',                           price: 50,  blank: '19.НОГИ',              pkg: ['yasik', 'paket'] },
  { name: 'Сердце ЦБ',                         price: 390, blank: '20.СЕРДЦЕ',            pkg: ['yasik', 'paket', 'lotok'] },
  { name: 'Печень ЦБ',                         price: 210, blank: '21.ПЕЧЕНЬ',            pkg: ['yasik', 'paket', 'lotok'] },
  { name: 'Желудок ЦБ',                        price: 175, blank: '22.ЖЕЛУДКИ',           pkg: ['yasik', 'paket', 'lotok'] },
  { name: 'Жир-сырец ЦБ',                      price: 80,  blank: '23.ЖИР-СЫРЕЦ',         pkg: ['yasik', 'paket'] },
  { name: 'Кожа ЦБ',                           price: 45,  blank: '24.КОЖА',              pkg: ['yasik', 'paket'] },
]

export const STATUSES: Record<OrderStatus, StatusMeta> = {
  pending:  { label: 'В обработке', color: '#e8a838', bg: '#fef9ec' },
  accepted: { label: 'Принята',     color: '#7a9e7e', bg: '#f2f7f3' },
  shipped:  { label: 'Отгружена',   color: '#4a7da8', bg: '#eef4f9' },
  archive:  { label: 'В архиве',    color: '#8a7a90', bg: '#f3eff5' },
}

export const DEFAULT_CP = [
  { id: 'cp1', name: 'ИП Соколова А.В.',  login: 'sokolova', password: 'sok-2026',     address: 'г. Москва, ул. Садовая, д. 12' },
  { id: 'cp2', name: 'ООО Продукты Плюс', login: 'plus',     password: 'plus-prod-26', address: 'г. Москва, пр-т Мира, д. 45' },
  { id: 'cp3', name: 'ИП Краснов П.И.',   login: 'krasnov',  password: 'kr-2026',      address: 'г. Подольск, ул. Ленина, д. 3' },
  { id: 'cp4', name: 'ООО Мясной Двор',   login: 'dvor',     password: 'dvor-26',      address: 'г. Химки, Ленинградское ш., 16' },
]

export const DEFAULT_BANNER = {
  kind: 'promo',
  title: 'Свежее мясо птицы — каждую неделю',
  subtitle: 'Принимаем заявки до 15:00 · отгрузка через 2 рабочих дня',
  badge: 'Ферма Лычкиных',
  bg: '#c94030',
  image: '',
}

export const ADMIN_PASSWORD = 'лычкины2024'
