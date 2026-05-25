interface Props { light?: boolean }

export default function Logo({ light }: Props) {
  const t1  = light ? '#fae0dc' : '#c94030'
  const t2  = light ? '#f5bdb6' : '#a8331f'
  const txt = light ? '#f5edd6' : '#3d2b1f'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width="28" height="28" viewBox="0 0 52 46" fill="none">
        <ellipse cx="28" cy="32" rx="14" ry="10" fill={t1} />
        <circle cx="36" cy="20" r="10" fill={t1} />
        <polygon points="45,17 52,20 45,23" fill="#e8a838" />
        <circle cx="38" cy="18" r="2.5" fill="white" />
        <path d="M14,30 Q7,18 26,14 Q22,24 14,30Z" fill={t2} />
      </svg>
      <span style={{ fontFamily: "'PT Serif', Georgia, serif", fontWeight: 700, fontSize: 17, color: txt, lineHeight: 1 }}>
        Ферма Лычкиных
      </span>
    </div>
  )
}
