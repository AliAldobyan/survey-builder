import { createTheme } from '@mantine/core'

export const brandColors = {
  purple: '#4f008c',
  coral: '#ff375e',
  onyx: '#1d252d',
  white: '#ffffff',
} as const

const fontFamily = 'var(--survey-font-family)'

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: { light: 6, dark: 3 },
  colors: {
    brand: [
      '#f7f0fc',
      '#ecddf6',
      '#d7b9ec',
      '#bd8bde',
      '#a15cce',
      '#8032b5',
      brandColors.purple,
      '#430077',
      '#370062',
      '#2b004d',
    ],
    coral: [
      '#fff0f3',
      '#ffdde4',
      '#ffb9c7',
      '#ff8fa5',
      '#ff6684',
      '#ff4b6e',
      brandColors.coral,
      '#d92247',
      '#b81739',
      '#980d2c',
    ],
  },
  black: brandColors.onyx,
  white: brandColors.white,
  fontFamily,
  headings: { fontFamily, fontWeight: '700' },
  defaultRadius: 'md',
  focusRing: 'auto',
  autoContrast: true,
})
