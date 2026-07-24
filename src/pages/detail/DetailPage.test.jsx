import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { theme } from '@/styles/theme'
import { createTestStore } from '@/test/render'
import { useGetPokemonDetailQuery } from '@/api/pokeApi'
import { DetailPage } from './index'

// Mismo mock-por-hook que useDetailPage.test.jsx. Se arma un render propio (en vez de
// renderWithProviders) porque esta página necesita el :name en la URL resuelto por una
// Route real para que useParams funcione.
vi.mock('@/api/pokeApi', () => ({
  useGetPokemonDetailQuery: vi.fn(),
}))

const renderDetailPage = ({ preloadedState, route = '/pokemon/pikachu' } = {}) => {
  const store = createTestStore(preloadedState)
  return {
    store,
    ...render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <MemoryRouter initialEntries={[route]}>
            <Routes>
              <Route path="/pokemon/:name" element={<DetailPage />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      </ThemeProvider>,
    ),
  }
}

const detailFixture = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  types: ['electric'],
  abilities: [{ name: 'static', isHidden: false }],
  stats: [{ name: 'hp', value: 35 }],
  sprites: {
    front: 'front.png',
    frontShiny: 'front-shiny.png',
    frontFemale: null,
    frontShinyFemale: null,
    back: 'back.png',
    backShiny: 'back-shiny.png',
    backFemale: null,
    backShinyFemale: null,
    artwork: 'artwork.png',
    artworkShiny: 'artwork-shiny.png',
  },
}

describe('DetailPage', () => {
  it('renders skeletons while loading, with no name or error content', () => {
    useGetPokemonDetailQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    })
    renderDetailPage()

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    expect(screen.queryByText("Couldn't load this Pokémon.")).not.toBeInTheDocument()
  })

  it('renders an error state and retries on click', async () => {
    const refetch = vi.fn()
    useGetPokemonDetailQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    })
    const user = userEvent.setup()
    renderDetailPage()

    expect(screen.getByText("Couldn't load this Pokémon.")).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(refetch).toHaveBeenCalled()
  })

  describe('once the detail has loaded', () => {
    beforeEach(() => {
      useGetPokemonDetailQuery.mockReturnValue({
        data: detailFixture,
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      })
    })

    it('renders the name, dex number, type and stats', () => {
      renderDetailPage()

      expect(
        screen.getByRole('heading', { level: 1, name: 'pikachu' }),
      ).toBeInTheDocument()
      expect(screen.getByText('N.º 025')).toBeInTheDocument()
      expect(screen.getByText('electric')).toBeInTheDocument()
      expect(screen.getByText('HP')).toBeInTheDocument()
      expect(screen.getByText('static')).toBeInTheDocument()
    })

    it('marks a hidden ability with the "(hidden)" suffix', () => {
      useGetPokemonDetailQuery.mockReturnValue({
        data: {
          ...detailFixture,
          abilities: [{ name: 'lightning-rod', isHidden: true }],
        },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      })
      renderDetailPage()

      expect(screen.getByText('lightning-rod (hidden)')).toBeInTheDocument()
    })

    it('collapses the physical data and abilities sections independently', async () => {
      const user = userEvent.setup()
      renderDetailPage()

      expect(screen.getByText('0.4 m')).toBeInTheDocument()
      expect(screen.getByText('static')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: /Physical data/ }))
      expect(screen.queryByText('0.4 m')).not.toBeInTheDocument()
      expect(screen.getByText('static')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: /Abilities/ }))
      expect(screen.queryByText('static')).not.toBeInTheDocument()
    })

    it('opens the add-to-team modal from the favorite toggle', async () => {
      const user = userEvent.setup()
      renderDetailPage()

      await user.click(screen.getByRole('button', { name: 'Add pikachu to team' }))

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Add pikachu to your team?')).toBeInTheDocument()
    })

    it('offers to remove instead of add when already a favorite', async () => {
      const user = userEvent.setup()
      renderDetailPage({
        preloadedState: { favorites: { entries: [{ id: 25, name: 'pikachu' }] } },
      })

      await user.click(screen.getByRole('button', { name: 'Remove pikachu from team' }))

      expect(screen.getByText('Remove pikachu from your team?')).toBeInTheDocument()
    })

    it('switches to shiny artwork/sprites via the shiny switch', async () => {
      const user = userEvent.setup()
      renderDetailPage()

      const shinySwitch = screen.getByRole('switch', { name: 'Toggle shiny sprites' })
      expect(shinySwitch).toHaveAttribute('aria-checked', 'false')

      await user.click(shinySwitch)

      expect(shinySwitch).toHaveAttribute('aria-checked', 'true')
      expect(screen.getByRole('img', { name: 'pikachu' })).toHaveAttribute(
        'src',
        'artwork-shiny.png',
      )
    })

    it('selects a different sprite tab via SpriteViewer', async () => {
      const user = userEvent.setup()
      renderDetailPage()

      await user.click(screen.getByRole('button', { name: 'Back' }))

      expect(screen.getByRole('img', { name: 'pikachu Back' })).toBeInTheDocument()
    })
  })
})
