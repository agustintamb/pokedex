import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, fireEvent, act } from '@/test/render'
import {
  useGetPokemonIndexQuery,
  useGetPokemonByTypesQuery,
  useGetPokemonByGenerationsQuery,
  useGetPokemonDetailQuery,
} from '@/api/pokeApi'
import { PokedexPage } from './index'

// Se mockean los 4 hooks de pokeApi que llegan a llamarse: los 3 de usePokedexPage más el
// de PokemonCard, que se monta de verdad dentro del grid.
vi.mock('@/api/pokeApi', () => ({
  useGetPokemonIndexQuery: vi.fn(),
  useGetPokemonByTypesQuery: vi.fn(),
  useGetPokemonByGenerationsQuery: vi.fn(),
  useGetPokemonDetailQuery: vi.fn(),
}))

// jsdom no implementa IntersectionObserver: el stub guarda el callback para dispararlo a mano
class IntersectionObserverStub {
  constructor(callback) {
    this.callback = callback
    IntersectionObserverStub.instances.push(this)
  }

  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}
IntersectionObserverStub.instances = []

const smallIndex = [
  { name: 'bulbasaur', id: 1 },
  { name: 'ivysaur', id: 2 },
  { name: 'pikachu', id: 25 },
]

describe('PokedexPage', () => {
  beforeEach(() => {
    IntersectionObserverStub.instances = []
    vi.stubGlobal('IntersectionObserver', IntersectionObserverStub)
    useGetPokemonIndexQuery.mockReturnValue({
      data: smallIndex,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })
    useGetPokemonByTypesQuery.mockReturnValue({ data: [], isFetching: false })
    useGetPokemonByGenerationsQuery.mockReturnValue({ data: [], isFetching: false })
    useGetPokemonDetailQuery.mockReturnValue({
      data: { types: ['electric'] },
      isLoading: false,
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    // Evita que se filtren timers falsos al siguiente test si una assertion tiró antes de tiempo
    vi.useRealTimers()
  })

  it('renders an error state and retries on click', async () => {
    const refetch = vi.fn()
    useGetPokemonIndexQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    })
    const user = userEvent.setup()
    renderWithProviders(<PokedexPage />)

    expect(
      screen.getByText('Ups! Something went wrong while fetching the Pokémons data.'),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(refetch).toHaveBeenCalled()
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
    renderWithProviders(<PokedexPage />)

    expect(
      screen.getByText('Ups! Something went wrong while fetching the Pokémons data.'),
    ).toBeInTheDocument()
    expect(
      screen.queryByText("Who's that Pokémon? Not in your search results!"),
    ).not.toBeInTheDocument()

    const retryButton = screen.getByRole('button')
    expect(retryButton).toBeDisabled()
    expect(retryButton).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByText('Retry')).not.toBeInTheDocument()
  })

  it('shows skeletons instead of cards while loading', () => {
    useGetPokemonIndexQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      isError: false,
      refetch: vi.fn(),
    })
    renderWithProviders(<PokedexPage />)

    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })

  it('renders the empty state when there are no matches', () => {
    useGetPokemonIndexQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })
    renderWithProviders(<PokedexPage />)

    expect(
      screen.getByText("Who's that Pokémon? Not in your search results!"),
    ).toBeInTheDocument()
  })

  it('renders a card per index entry', () => {
    renderWithProviders(<PokedexPage />)

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/pokemon/bulbasaur',
      '/pokemon/ivysaur',
      '/pokemon/pikachu',
    ])
  })

  it('filters the grid by search text once the debounce fires', () => {
    vi.useFakeTimers()
    renderWithProviders(<PokedexPage />)

    fireEvent.change(screen.getByPlaceholderText('e.g. Pikachu'), {
      target: { value: 'pika' },
    })
    expect(screen.getAllByRole('link')).toHaveLength(3)

    act(() => vi.advanceTimersByTime(300))
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', '/pokemon/pikachu')
  })

  it('shows a suggestion while typing and selecting it fills the search box', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PokedexPage />)

    await user.type(screen.getByPlaceholderText('e.g. Pikachu'), 'pika')
    await user.click(screen.getByRole('button', { name: 'pikachu', hidden: true }))

    expect(screen.getByPlaceholderText('e.g. Pikachu')).toHaveValue('pikachu')
  })

  it('dismisses the suggestions when clicking outside the search box', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PokedexPage />)

    await user.type(screen.getByPlaceholderText('e.g. Pikachu'), 'pika')
    expect(
      screen.getByRole('button', { name: 'pikachu', hidden: true }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^Filters/ }))

    expect(
      screen.queryByRole('button', { name: 'pikachu', hidden: true }),
    ).not.toBeInTheDocument()
  })

  it('reopens the suggestions when the search box is focused again', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PokedexPage />)

    const searchInput = screen.getByPlaceholderText('e.g. Pikachu')
    await user.type(searchInput, 'pika')
    await user.click(screen.getByRole('button', { name: /^Filters/ }))
    expect(
      screen.queryByRole('button', { name: 'pikachu', hidden: true }),
    ).not.toBeInTheDocument()

    await user.click(searchInput)

    expect(
      screen.getByRole('button', { name: 'pikachu', hidden: true }),
    ).toBeInTheDocument()
  })

  it('expands the filters panel and toggles a type filter', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PokedexPage />)

    const toggle = screen.getByRole('button', { name: /^Filters/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByRole('button', { name: 'electric' }))
    expect(screen.getByRole('button', { name: /^Filters \(1\)/ })).toBeInTheDocument()
  })

  it('toggles a generation filter chip', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PokedexPage />)

    await user.click(screen.getByRole('button', { name: '1' }))

    expect(screen.getByRole('button', { name: /^Filters \(1\)/ })).toBeInTheDocument()
  })

  it('loads the next page once the sentinel intersects', () => {
    const bigIndex = Array.from({ length: 30 }, (_, index) => ({
      name: `mon-${String(index).padStart(2, '0')}`,
      id: index + 1,
    }))
    useGetPokemonIndexQuery.mockReturnValue({
      data: bigIndex,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })
    renderWithProviders(<PokedexPage />)

    expect(screen.getAllByRole('link')).toHaveLength(24)

    const [observer] = IntersectionObserverStub.instances
    act(() => observer.callback([{ isIntersecting: false }]))
    expect(screen.getAllByRole('link')).toHaveLength(24)

    act(() => observer.callback([{ isIntersecting: true }]))
    expect(screen.getAllByRole('link')).toHaveLength(30)
  })
})
