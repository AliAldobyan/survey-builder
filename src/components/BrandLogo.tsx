export function BrandLogo({ width = 170 }: { width?: number }) {
  return (
    <img
      src="/brand/channels-by-stc.webp"
      alt="Channels by stc"
      width={width}
      style={{ display: 'block', height: 'auto', maxWidth: '100%' }}
    />
  )
}
