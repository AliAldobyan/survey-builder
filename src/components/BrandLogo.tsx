import { useComputedColorScheme } from '@mantine/core'

export function BrandLogo({ width = 170 }: { width?: number }) {
  const colorScheme = useComputedColorScheme('light')
  const logo = colorScheme === 'dark'
    ? `${import.meta.env.BASE_URL}brand/channels-by-stc-white.png`
    : `${import.meta.env.BASE_URL}brand/channels-by-stc.webp`

  return (
    <img
      src={logo}
      alt="Channels by stc"
      width={width}
      style={{
        display: "block",
        height: "auto",
        maxWidth: "100%",
        borderRadius: 8,
        padding: 8,
      }}
    />
  );
}
