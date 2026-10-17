import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DirectionProvider, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import './index.css'
import App from './app/App.tsx'
import { theme } from './app/theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DirectionProvider>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <App />
      </MantineProvider>
    </DirectionProvider>
  </StrictMode>,
)
