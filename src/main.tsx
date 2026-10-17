import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { DirectionProvider, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import './index.css'
import App from './app/App.tsx'
import { theme } from './app/theme'

async function startApp() {
  // Static hosting uses browser mocks because there is no Node server.
  if (import.meta.env.PROD) {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
      onUnhandledFrame: 'bypass',
      quiet: true,
    })
  }

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

}

void startApp().catch(() => {
  const root = document.getElementById('root')
  if (root) root.textContent = 'Unable to start the app. Please refresh the page.'
})
