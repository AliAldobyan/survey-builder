import { SunIcon, MoonIcon } from '@radix-ui/react-icons'
import { ActionIcon, Tooltip, useComputedColorScheme, useMantineColorScheme } from '@mantine/core'

type ThemeToggleProps = {
  lightLabel: string
  darkLabel: string
}

export function ThemeToggle({ lightLabel, darkLabel }: ThemeToggleProps) {
  const scheme = useComputedColorScheme('light')
  const { setColorScheme } = useMantineColorScheme()
  const isDark = scheme === 'dark'
  const label = isDark ? lightLabel : darkLabel

  return (
    <Tooltip label={label}>
      <ActionIcon
        type="button"
        variant="default"
        size={36}
        aria-label={label}
        onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
      >
        {isDark
          ? <SunIcon width={20} height={20} aria-hidden="true" />
          : <MoonIcon width={20} height={20} aria-hidden="true" />}
      </ActionIcon>
    </Tooltip>
  )
}
