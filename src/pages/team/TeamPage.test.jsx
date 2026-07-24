import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@/test/render'
import { useGetPokemonDetailsQuery } from '@/api/pokeApi'
import { TeamPage } from './index'

// TeamRadarChart (montado de verdad acá, no mockeado — es lo que se está testeando: que la
// página realmente compone grid + counter + chart) llama a este hook de pokeApi por su
// cuenta. Se lo mockea en loading para no repetir fixtures de stats ya cubiertas en
// TeamRadarChart.test.jsx — acá solo importa que la página lo monta sin romperse.
vi.mock('@/api/pokeApi', () => ({
  useGetPokemonDetailsQuery: vi.fn(),
}))

const twoFavorites = [
  { id: 25, name: 'pikachu' },
  { id: 4, name: 'charmander' },
]

describe('TeamPage', () => {
  beforeEach(() => {
    useGetPokemonDetailsQuery.mockReturnValue({ data: undefined, isLoading: true })
  })

  it('renders the full-panel empty state when there are no favorites', () => {
    renderWithProviders(<TeamPage />, { preloadedState: { favorites: { entries: [] } } })

    expect(
      screen.getByText(
        "Oops! Your team is empty. Add some Pokémon to see your team's stats.",
      ),
    ).toBeInTheDocument()
    expect(screen.queryByText('Empty slot')).not.toBeInTheDocument()
  })

  it('renders a card per favorite plus empty slots up to the max team size', () => {
    renderWithProviders(<TeamPage />, {
      preloadedState: { favorites: { entries: twoFavorites } },
    })

    expect(screen.getByText('2/6')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'pikachu' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'charmander' })).toBeInTheDocument()
    expect(screen.getAllByText('Empty slot')).toHaveLength(4)
  })

  it('shows no empty slots and the complete count at the max team size', () => {
    const entries = Array.from({ length: 6 }, (_, index) => ({
      id: index,
      name: `mon-${index}`,
    }))
    renderWithProviders(<TeamPage />, { preloadedState: { favorites: { entries } } })

    expect(screen.getByText('6/6')).toBeInTheDocument()
    expect(screen.queryByText('Empty slot')).not.toBeInTheDocument()
  })

  it('toggles the chart section without crashing', async () => {
    const user = userEvent.setup()
    renderWithProviders(<TeamPage />, {
      preloadedState: { favorites: { entries: twoFavorites } },
    })

    await user.click(screen.getByRole('button', { name: /Team stats/ }))

    expect(screen.getByRole('button', { name: /Team stats/ })).toBeInTheDocument()
  })

  it('removes a favorite end-to-end via the card pokeball and the confirm modal', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<TeamPage />, {
      preloadedState: { favorites: { entries: [{ id: 25, name: 'pikachu' }] } },
    })

    await user.click(screen.getByRole('button', { name: 'Remove pikachu from team' }))
    await user.click(screen.getByRole('button', { name: 'Remove' }))

    expect(store.getState().favorites.entries).toEqual([])
    expect(
      screen.getByText(
        "Oops! Your team is empty. Add some Pokémon to see your team's stats.",
      ),
    ).toBeInTheDocument()
  })
})
