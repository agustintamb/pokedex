import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import {
  useGetPokemonIndexQuery,
  useGetPokemonByTypesQuery,
  useGetPokemonByGenerationsQuery,
  useGetTypesQuery,
  useGetGenerationsQuery,
} from '@/api/pokeApi'
import { POKEMON_TYPE_NAMES } from '@/utils/pokemon-types'
import { POKEMON_GENERATIONS } from '@/utils/generations'
import { usePokedexPage } from './usePokedexPage'

// Con renderHook (sin DOM) `sentinelRef.current` es siempre null, así que el efecto de
// IntersectionObserver nunca se arma: el infinite scroll se testea en PokedexPage.test.jsx.
vi.mock('@/api/pokeApi', () => ({
  useGetPokemonIndexQuery: vi.fn(),
  useGetPokemonByTypesQuery: vi.fn(),
  useGetPokemonByGenerationsQuery: vi.fn(),
  useGetTypesQuery: vi.fn(),
  useGetGenerationsQuery: vi.fn(),
}))

const indexFixture = [
  { name: 'bulbasaur', id: 1 },
  { name: 'ivysaur', id: 2 },
  { name: 'pikachu', id: 25 },
  { name: 'raichu', id: 26 },
]

const buildWrapper =
  (route = '/') =>
  ({ children }) => <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>

describe('usePokedexPage', () => {
  beforeEach(() => {
    useGetPokemonIndexQuery.mockReturnValue({
      data: indexFixture,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })
    useGetPokemonByTypesQuery.mockReturnValue({ data: [], isFetching: false })
    useGetPokemonByGenerationsQuery.mockReturnValue({ data: [], isFetching: false })
    useGetTypesQuery.mockReturnValue({})
    useGetGenerationsQuery.mockReturnValue({})
  })

  describe('listas de tipos y generaciones', () => {
    it('cae a las listas estáticas mientras la API no respondió', () => {
      const { result } = renderHook(() => usePokedexPage(), { wrapper: buildWrapper() })

      expect(result.current.pokemonTypes).toBe(POKEMON_TYPE_NAMES)
      expect(result.current.pokemonGenerations).toBe(POKEMON_GENERATIONS)
    })

    it('usa las listas de la API cuando llegan', () => {
      useGetTypesQuery.mockReturnValue({ data: ['fire', 'water'] })
      useGetGenerationsQuery.mockReturnValue({ data: [1, 2] })
      const { result } = renderHook(() => usePokedexPage(), { wrapper: buildWrapper() })

      expect(result.current.pokemonTypes).toEqual(['fire', 'water'])
      expect(result.current.pokemonGenerations).toEqual([1, 2])
    })
  })

  it('exposes the loading state with no entries yet', () => {
    useGetPokemonIndexQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    })
    const { result } = renderHook(() => usePokedexPage(), { wrapper: buildWrapper() })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.entries).toEqual([])
    expect(result.current.isEmpty).toBe(false)
  })

  it('calls refetch on retry', () => {
    const refetch = vi.fn()
    useGetPokemonIndexQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    })
    const { result } = renderHook(() => usePokedexPage(), { wrapper: buildWrapper() })

    act(() => result.current.handleRetry())

    expect(refetch).toHaveBeenCalled()
  })

  it('is empty once the index has loaded with no matches', () => {
    useGetPokemonIndexQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })
    const { result } = renderHook(() => usePokedexPage(), { wrapper: buildWrapper() })

    expect(result.current.isEmpty).toBe(true)
  })

  it('lists every index entry with no filters applied', () => {
    const { result } = renderHook(() => usePokedexPage(), { wrapper: buildWrapper() })

    expect(result.current.entries.map((entry) => entry.name)).toEqual([
      'bulbasaur',
      'ivysaur',
      'pikachu',
      'raichu',
    ])
  })

  it('filters entries by the debounced search text', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => usePokedexPage(), { wrapper: buildWrapper() })

    act(() => result.current.handleSearchChange('pika'))
    expect(result.current.searchInput).toBe('pika')
    expect(result.current.entries).toHaveLength(4)

    act(() => vi.advanceTimersByTime(300))
    expect(result.current.entries.map((entry) => entry.name)).toEqual(['pikachu'])

    vi.useRealTimers()
  })

  it('suggests matching names immediately, without waiting for the debounce', () => {
    const { result } = renderHook(() => usePokedexPage(), { wrapper: buildWrapper() })

    act(() => result.current.handleSearchChange('rai'))

    expect(result.current.suggestions).toEqual(['raichu'])
  })

  it('selecting a suggestion fills the input and dismisses the suggestion list', () => {
    const { result } = renderHook(() => usePokedexPage(), { wrapper: buildWrapper() })

    act(() => result.current.handleSearchChange('rai'))
    act(() => result.current.handleSelectSuggestion('raichu'))

    expect(result.current.searchInput).toBe('raichu')
    expect(result.current.suggestions).toEqual([])
  })

  it('dismissing the suggestions clears the list without touching the search input', () => {
    const { result } = renderHook(() => usePokedexPage(), { wrapper: buildWrapper() })

    act(() => result.current.handleSearchChange('rai'))
    act(() => result.current.handleDismissSuggestions())

    expect(result.current.searchInput).toBe('rai')
    expect(result.current.suggestions).toEqual([])
  })

  it('re-focusing the search box reopens the suggestions for the current value', () => {
    const { result } = renderHook(() => usePokedexPage(), { wrapper: buildWrapper() })

    act(() => result.current.handleSearchChange('rai'))
    act(() => result.current.handleDismissSuggestions())
    expect(result.current.suggestions).toEqual([])

    act(() => result.current.handleSearchFocus())

    expect(result.current.suggestions).toEqual(['raichu'])
  })

  it('toggles a type filter on and off, querying pokeApi accordingly', () => {
    const { result } = renderHook(() => usePokedexPage(), { wrapper: buildWrapper() })

    act(() => result.current.handleToggleType('electric'))
    expect(result.current.selectedTypes).toEqual(['electric'])
    expect(useGetPokemonByTypesQuery).toHaveBeenLastCalledWith(['electric'], {
      skip: false,
    })

    act(() => result.current.handleToggleType('electric'))
    expect(result.current.selectedTypes).toEqual([])
    expect(useGetPokemonByTypesQuery).toHaveBeenLastCalledWith([], { skip: true })
  })

  it('toggles a generation filter on and off, querying pokeApi accordingly', () => {
    const { result } = renderHook(() => usePokedexPage(), { wrapper: buildWrapper() })

    act(() => result.current.handleToggleGeneration(1))
    expect(result.current.selectedGenerations).toEqual([1])
    expect(useGetPokemonByGenerationsQuery).toHaveBeenLastCalledWith([1], {
      skip: false,
    })

    act(() => result.current.handleToggleGeneration(1))
    expect(result.current.selectedGenerations).toEqual([])
  })

  it('keeps multiple selected generations numerically sorted regardless of toggle order', () => {
    const { result } = renderHook(() => usePokedexPage(), { wrapper: buildWrapper() })

    act(() => result.current.handleToggleGeneration(3))
    act(() => result.current.handleToggleGeneration(1))

    expect(result.current.selectedGenerations).toEqual([1, 3])
  })

  it('narrows entries to the intersection of the selected type matches', () => {
    useGetPokemonByTypesQuery.mockReturnValue({
      data: ['pikachu', 'raichu'],
      isFetching: false,
    })
    const { result } = renderHook(() => usePokedexPage(), { wrapper: buildWrapper() })

    act(() => result.current.handleToggleType('electric'))

    expect(result.current.entries.map((entry) => entry.name).sort()).toEqual([
      'pikachu',
      'raichu',
    ])
  })

  it('toggles the filters panel open state', () => {
    const { result } = renderHook(() => usePokedexPage(), { wrapper: buildWrapper() })

    expect(result.current.isFiltersOpen).toBe(false)
    act(() => result.current.toggleFilters())
    expect(result.current.isFiltersOpen).toBe(true)
  })
})
