export const RU_MONTHS = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']
export const RU_MONTHS_SHORT = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек']
export const RU_WEEK_FULL = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота']

export const isoDate = (d: Date): string => {
  const z = new Date(d)
  z.setHours(12, 0, 0, 0)
  return z.toISOString().slice(0, 10)
}

export const parseISO = (s: string): Date => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d, 12, 0, 0, 0)
}

export const sameDay = (a: Date | string, b: Date | string): boolean =>
  isoDate(a instanceof Date ? a : new Date(a)) === isoDate(b instanceof Date ? b : new Date(b))

export const isWeekday = (d: Date): boolean => d.getDay() !== 0 && d.getDay() !== 6

export const addWorkDays = (date: Date, n: number): Date => {
  const d = new Date(date)
  const dir = n >= 0 ? 1 : -1
  let remaining = Math.abs(n)
  while (remaining > 0) {
    d.setDate(d.getDate() + dir)
    if (isWeekday(d)) remaining--
  }
  return d
}

export const firstShipmentFrom = (now = new Date()): Date => {
  const past = now.getHours() > 15 || (now.getHours() === 15 && now.getMinutes() > 0)
  let anchor = new Date(now)
  if (past) anchor.setDate(anchor.getDate() + 1)
  while (!isWeekday(anchor)) anchor.setDate(anchor.getDate() + 1)
  return addWorkDays(anchor, 2)
}

export const fmtDateTime = (iso: string): string => {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export const fmtShort = (d: Date | string): string => {
  const dd = d instanceof Date ? d : new Date(d)
  return `${String(dd.getDate()).padStart(2, '0')} ${RU_MONTHS_SHORT[dd.getMonth()]} ${dd.getFullYear()}`
}

export const fmtLong = (d: Date | string): string => {
  const dd = d instanceof Date ? d : new Date(d)
  return `${dd.getDate()} ${RU_MONTHS[dd.getMonth()]}, ${RU_WEEK_FULL[dd.getDay()]}`
}
