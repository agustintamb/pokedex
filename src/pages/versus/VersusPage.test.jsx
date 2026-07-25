import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, within } from '@/test/render'
import { useGetPokemonIndexQuery, useGetPokemonDetailQuery } from '@/api/pokeApi'
import { VersusPage } from './index'

// Mock pokeApi hooks, no la red. useVersusPage: React state + Formik (sin Redux/Router).
vi.mock('@/api/pokeApi', () => ({
  useGetPokemonIndexQuery: vi.fn(),
  useGetPokemonDetailQuery: vi.fn(),
}))

// lottie-react depende de canvas/rAF que jsdom no provee bien — se mockea entero
vi.mock('lottie-react', () => ({
  default: () => <div>lottie-mock</div>,
}))

const indexFixture = [
  { name: 'pikachu', id: 25 },
  { name: 'raichu', id: 26 },
  { name: 'charmander', id: 4 },
]

const buildDetail = (name, hp) => ({
  id: 1,
  name,
  types: ['electric'],
  sprites: { artwork: 'artwork.png', front: 'front.png' },
  stats: [
    { name: 'hp', value: hp },
    { name: 'attack', value: 50 },
    { name: 'defense', value: 40 },
    { name: 'special-attack', value: 45 },
    { name: 'special-defense', value: 45 },
    { name: 'speed', value: 60 },
  ],
})

const detailByName = {
  pikachu: buildDetail('pikachu', 35),
  raichu: buildDetail('raichu', 60),
}

describe('VersusPage', () => {
  beforeEach(() => {
    useGetPokemonIndexQuery.mockReturnValue({
      data: indexFixture,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })
    useGetPokemonDetailQuery.mockImplementation((name) => ({
      data: detailByName[name],
      isLoading: false,
    }))
  })

  it('shows the loader while the index is loading', () => {
    useGetPokemonIndexQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      isError: false,
      refetch: vi.fn(),
    })
    renderWithProviders(<VersusPage />)

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
    expect(screen.queryByText('VS')).not.toBeInTheDocument()
  })

  // RTK Query apaga isError apenas arranca el refetch: este es el estado real del reintento
  it('keeps the error state with a spinning retry button while retrying', () => {
    useGetPokemonIndexQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: true,
      isError: false,
      refetch: vi.fn(),
    })
    renderWithProviders(<VersusPage />)

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    expect(screen.queryByText('VS')).not.toBeInTheDocument()

    const retryButton = screen.getByRole('button')
    expect(retryButton).toBeDisabled()
    expect(retryButton).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByText('Retry')).not.toBeInTheDocument()
  })

  it('shows the error state with a retry when the index fails to load', async () => {
    const refetch = vi.fn()
    useGetPokemonIndexQuery.mockReturnValue({
      data: undefined,
      isError: true,
      refetch,
    })
    const user = userEvent.setup()
    renderWithProviders(<VersusPage />)

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    expect(screen.queryByText('VS')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(refetch).toHaveBeenCalled()
  })

  it('shows the "Pokemon 1"/"Pokemon 2" empty placeholders and the VS badge before any pick', () => {
    renderWithProviders(<VersusPage />)

    // "Pokemon 1"/"Pokemon 2" salen en el placeholder del slot y en la leyenda del chart
    expect(screen.getAllByText('Pokemon 1').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Pokemon 2').length).toBeGreaterThan(0)
    expect(screen.getByText('VS')).toBeInTheDocument()
  })

  it('compares two different Pokémon once both are picked from the suggestions', async () => {
    const user = userEvent.setup()
    renderWithProviders(<VersusPage />)

    await user.type(screen.getByPlaceholderText('Search Pokemon 1'), 'pikachu')
    await user.click(screen.getByRole('button', { name: 'pikachu', hidden: true }))

    await user.type(screen.getByPlaceholderText('Search Pokemon 2'), 'raichu')
    await user.click(screen.getByRole('button', { name: 'raichu', hidden: true }))

    expect(screen.getAllByText('pikachu').length).toBeGreaterThan(0)
    expect(screen.getAllByText('raichu').length).toBeGreaterThan(0)

    const hpRow = within(screen.getByText('HP').closest('div'))
    expect(hpRow.getByText('35')).toHaveAttribute('data-winner', 'false')
    expect(hpRow.getByText('60')).toHaveAttribute('data-winner', 'true')
  })

  it('shows the duplicate-pick error and keeps the second slot empty when typing an already-picked name', async () => {
    const user = userEvent.setup()
    renderWithProviders(<VersusPage />)

    await user.type(screen.getByPlaceholderText('Search Pokemon 1'), 'pikachu')
    await user.click(screen.getByRole('button', { name: 'pikachu', hidden: true }))

    await user.type(screen.getByPlaceholderText('Search Pokemon 2'), 'pikachu')

    expect(screen.getByText('You have already picked this Pokémon')).toBeInTheDocument()
    // "Pokemon 2" sale en el placeholder del slot y en la leyenda del chart
    expect(screen.getAllByText('Pokemon 2').length).toBeGreaterThan(0)
  })

  it('hydrates a shared comparison straight from the URL query params', () => {
    renderWithProviders(<VersusPage />, { route: '/versus?a=pikachu&b=raichu' })

    expect(screen.getAllByText('pikachu').length).toBeGreaterThan(0)
    expect(screen.getAllByText('raichu').length).toBeGreaterThan(0)

    const hpRow = within(screen.getByText('HP').closest('div'))
    expect(hpRow.getByText('35')).toHaveAttribute('data-winner', 'false')
    expect(hpRow.getByText('60')).toHaveAttribute('data-winner', 'true')
  })

  it('generates a random matchup when the random-versus button is clicked', async () => {
    const user = userEvent.setup()
    const originalRandom = Math.random
    Math.random = vi.fn().mockReturnValue(0)
    renderWithProviders(<VersusPage />)

    await user.click(screen.getByRole('button', { name: 'Generate random versus' }))

    expect(screen.getAllByText('pikachu').length).toBeGreaterThan(0)
    expect(screen.getAllByText('raichu').length).toBeGreaterThan(0)

    Math.random = originalRandom
  })
})
