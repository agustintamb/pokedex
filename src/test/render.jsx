import { render as rtlRender } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import { theme } from '@/styles/theme'
import { favoritesReducer } from '@/store/slices/favorites.slice'
import { uiReducer } from '@/store/slices/ui.slice'

const withTheme = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

const customRender = (ui, options) => rtlRender(ui, { wrapper: withTheme, ...options })

export const createTestStore = (preloadedState) =>
  configureStore({
    reducer: { favorites: favoritesReducer, ui: uiReducer },
    preloadedState,
  })

// Para componentes/hooks que necesitan Redux (favorites/ui, sin pokeApi — los que llaman
// a un endpoint de pokeApi mockean el hook directo, ver PokemonCard/TeamRadarChart) y/o
// Router (Link/NavLink/useParams/useSearchParams). Un solo store nuevo por render salvo
// que se pase uno con preloadedState/store explícito, para no compartir estado entre tests.
export const renderWithProviders = (
  ui,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    route = '/',
    ...options
  } = {},
) => {
  const Wrapper = ({ children }) => (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    </ThemeProvider>
  )

  return { store, ...rtlRender(ui, { wrapper: Wrapper, ...options }) }
}

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react'
export { customRender as render }
