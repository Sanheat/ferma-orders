import type { Banner } from '@/lib/types'

export default function ClientBanner({ banner }: { banner: Banner }) {
  const hasImage = !!banner.image
  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', background: hasImage ? '#000' : banner.bg, color: '#fff', position: 'relative', minHeight: 168, marginBottom: 18 }}>
      {hasImage && (
        <img src={banner.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
      )}
      <div style={{ position: 'relative', padding: '22px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 168 }}>
        <div style={{ display: 'inline-block', alignSelf: 'flex-start', background: 'rgba(255,255,255,.16)', backdropFilter: 'blur(4px)', padding: '4px 10px', borderRadius: 9999, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase' }}>
          {banner.badge}
        </div>
        <div>
          <div style={{ fontFamily: "'PT Serif', serif", fontWeight: 700, fontSize: 24, lineHeight: 1.15, marginBottom: 4, textShadow: hasImage ? '0 2px 8px rgba(0,0,0,.4)' : 'none' }}>{banner.title}</div>
          <div style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 13, opacity: 0.92 }}>{banner.subtitle}</div>
        </div>
      </div>
    </div>
  )
}
