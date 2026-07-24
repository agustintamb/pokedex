import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@/test/render'
import { useGetPokemonDetailsQuery } from '@/api/pokeApi'
import { TeamRadarChart } from './index'

// Mismo criterio que PokemonCard: se mockea el hook de pokeApi, no la capa de red.
// Recharts (ResponsiveContainer) necesita layout/ResizeObserver real que jsdom no da, así
// que este test no verifica el SVG del chart en sí — solo la UI de alrededor (caption,
// chips de toggle) que sí es DOM real independiente de Recharts.
vi.mock('@/api/pokeApi', () => ({
  useGetPokemonDetailsQuery: vi.fn(),
}))

const preloadedState = { favorites: { entries: [{ id: 25, name: 'pikachu' }] } }

describe('TeamRadarChart', () => {
  it('shows a loading skeleton while details are loading', () => {
    useGetPokemonDetailsQuery.mockReturnValue({ data: undefined, isLoading: true })
    renderWithProviders(<TeamRadarChart />, { preloadedState })
    expect(screen.queryByText('Team average')).not.toBeInTheDocument()
  })

  it('renders the team-average caption and a toggle chip per Pokémon once loaded', () => {
    useGetPokemonDetailsQuery.mockReturnValue({
      data: [
        { name: 'pikachu', types: ['electric'], stats: [{ name: 'hp', value: 35 }] },
      ],
      isLoading: false,
    })
    renderWithProviders(<TeamRadarChart />, { preloadedState })

    expect(screen.getByText('Team average')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'pikachu' })).toBeInTheDocument()
  })

  it('does not crash when a toggle chip is clicked', async () => {
    useGetPokemonDetailsQuery.mockReturnValue({
      data: [
        { name: 'pikachu', types: ['electric'], stats: [{ name: 'hp', value: 35 }] },
      ],
      isLoading: false,
    })
    const user = userEvent.setup()
    renderWithProviders(<TeamRadarChart />, { preloadedState })

    await user.click(screen.getByRole('button', { name: 'pikachu' }))

    expect(screen.getByRole('button', { name: 'pikachu' })).toBeInTheDocument()
  })
})
