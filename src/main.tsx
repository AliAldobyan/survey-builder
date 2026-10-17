import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { DirectionProvider, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import './index.css'
import App from './app/App.tsx'
import { theme } from './app/theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <DirectionProvider>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <App />
        </MantineProvider>
      </DirectionProvider>
    </Provider>
  </StrictMode>,
)
