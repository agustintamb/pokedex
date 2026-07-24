import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { store, persistor } from '@/store'
import { theme } from '@/styles/theme'
import { GlobalStyle } from '@/styles/GlobalStyle'
import { Navbar } from '@/components/Navbar'
import { SnackbarViewport } from '@/components/Snackbar'
import { AppRouter } from '@/router'

export const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Navbar />
          <AppRouter />
          <SnackbarViewport />
        </BrowserRouter>
      </PersistGate>
    </ThemeProvider>
  </Provider>
)
