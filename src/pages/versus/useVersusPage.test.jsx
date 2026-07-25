import { useEffect } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { useGetPokemonIndexQuery, useGetPokemonDetailQuery } from '@/api/pokeApi'
import { useVersusPage } from './useVersusPage'

vi.mock('@/api/pokeApi', () => ({
  useGetPokemonIndexQuery: vi.fn(),
  useGetPokemonDetailQuery: vi.fn(),
}))

const indexFixture = [
  { name: 'pikachu', id: 25 },
  { name: 'raichu', id: 26 },
  { name: 'charmander', id: 4 },
  { name: 'charmeleon', id: 5 },
]

const buildStats = (hp) => [
  { name: 'hp', value: hp },
  { name: 'attack', value: 50 },
  { name: 'defense', value: 40 },
  { name: 'special-attack', value: 45 },
  { name: 'special-defense', value: 45 },
  { name: 'speed', value: 60 },
]

const pikachuDetail = { name: 'pikachu', types: ['electric'], stats: buildStats(35) }
const raichuDetail = { name: 'raichu', types: ['electric'], stats: buildStats(60) }

// Espía la location actual del MemoryRouter para poder afirmar el round-trip a la URL.
let currentLocation
const LocationSpy = () => {
  const location = useLocation()
  useEffect(() => {
    currentLocation = location
  }, [location])
  return null
}

const renderVersus = (route = '/versus') =>
  renderHook(() => useVersusPage(), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[route]}>
        {children}
        <LocationSpy />
      </MemoryRouter>
    ),
  })

describe('useVersusPage', () => {
  beforeEach(() => {
    currentLocation = undefined
    useGetPokemonIndexQuery.mockReturnValue({
      data: indexFixture,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })
    useGetPokemonDetailQuery.mockReturnValue({ data: undefined, isLoading: false })
  })

  it('starts with both slots empty and comparison unavailable', () => {
    const { result } = renderVersus()

    expect(result.current.canCompare).toBe(false)
    expect(result.current.slotA.detail).toBeUndefined()
    expect(result.current.slotB.detail).toBeUndefined()
    expect(result.current.displayNameA).toBe('Pokemon 1')
    expect(result.current.displayNameB).toBe('Pokemon 2')
    expect(result.current.statRows).toHaveLength(6)
    result.current.statRows.forEach((row) => {
      expect(row.valueA).toBe(0)
      expect(row.valueB).toBe(0)
      expect(row.winner).toBeNull()
    })
  })

  it('suggests matching names as the user types, excluding the other slot pick', () => {
    const { result } = renderVersus()

    act(() => result.current.slotB.onSelectOption('raichu'))
    act(() => result.current.slotA.onQueryChange('cha'))

    expect(result.current.slotA.suggestions).toEqual(['charmander', 'charmeleon'])

    act(() => result.current.slotB.onQueryChange('cha'))
    expect(result.current.slotB.suggestions).toEqual(['charmander', 'charmeleon'])
  })

  it('typing does not confirm a pick, even when it exactly matches a known name', () => {
    useGetPokemonDetailQuery.mockImplementation((name) => ({
      data: name === 'pikachu' ? pikachuDetail : undefined,
      isLoading: false,
    }))
    const { result } = renderVersus()

    act(() => result.current.slotA.onQueryChange('pikachu'))

    expect(result.current.slotA.detail).toBeUndefined()
    expect(useGetPokemonDetailQuery).toHaveBeenLastCalledWith('', { skip: true })
  })

  it('selecting a suggestion confirms the pick via onSelectOption', () => {
    useGetPokemonDetailQuery.mockImplementation((name) => ({
      data: name === 'raichu' ? raichuDetail : undefined,
      isLoading: false,
    }))
    const { result } = renderVersus()

    act(() => result.current.slotB.onSelectOption('raichu'))

    expect(result.current.slotB.detail).toEqual(raichuDetail)
    expect(result.current.displayNameB).toBe('raichu')
  })

  it('clears a confirmed pick as soon as the user types again', () => {
    useGetPokemonDetailQuery.mockImplementation((name) => ({
      data: name === 'pikachu' ? pikachuDetail : undefined,
      isLoading: false,
    }))
    const { result } = renderVersus()

    act(() => result.current.slotA.onSelectOption('pikachu'))
    expect(result.current.slotA.detail).toEqual(pikachuDetail)

    act(() => result.current.slotA.onQueryChange('pikachu-x'))

    expect(result.current.slotA.detail).toBeUndefined()
    expect(useGetPokemonDetailQuery).toHaveBeenLastCalledWith('', { skip: true })
  })

  it('dismisses and reopens the suggestion list per slot independently', () => {
    const { result } = renderVersus()

    act(() => result.current.slotA.onQueryChange('pika'))
    act(() => result.current.slotB.onQueryChange('cha'))
    expect(result.current.slotA.suggestions).not.toEqual([])
    expect(result.current.slotB.suggestions).not.toEqual([])

    act(() => result.current.slotA.onDismiss())
    expect(result.current.slotA.suggestions).toEqual([])
    expect(result.current.slotB.suggestions).not.toEqual([])

    act(() => result.current.slotB.onDismiss())
    expect(result.current.slotB.suggestions).toEqual([])

    act(() => result.current.slotA.onFocus())
    expect(result.current.slotA.suggestions).not.toEqual([])

    act(() => result.current.slotB.onFocus())
    expect(result.current.slotB.suggestions).not.toEqual([])
  })

  it('flags the other slot pick as a disabled option and shows the duplicate error while typing it', () => {
    const { result } = renderVersus()

    act(() => result.current.slotA.onSelectOption('pikachu'))

    expect(result.current.slotB.disabledOptions).toEqual(['pikachu'])
    expect(result.current.slotB.isError).toBe(false)

    act(() => result.current.slotB.onQueryChange('pikachu'))

    expect(result.current.slotB.isError).toBe(true)
    expect(result.current.slotB.errorMessage).toBe('You have already picked this Pokémon')
  })

  it('blocks comparison when both slots are confirmed to the same Pokémon', () => {
    useGetPokemonDetailQuery.mockImplementation((name) => ({
      data: name === 'pikachu' ? pikachuDetail : undefined,
      isLoading: false,
    }))
    const { result } = renderVersus()

    // La UI real lo bloquea (disabledOptions); se llama directo para cubrir la guarda del hook
    act(() => result.current.slotA.onSelectOption('pikachu'))
    act(() => result.current.slotB.onSelectOption('pikachu'))

    expect(result.current.canCompare).toBe(false)
  })

  it('builds stat rows with the correct winner once both are valid and different', () => {
    useGetPokemonDetailQuery.mockImplementation((name) => {
      if (name === 'pikachu') return { data: pikachuDetail, isLoading: false }
      if (name === 'raichu') return { data: raichuDetail, isLoading: false }
      return { data: undefined, isLoading: false }
    })
    const { result } = renderVersus()

    act(() => result.current.slotA.onSelectOption('pikachu'))
    act(() => result.current.slotB.onSelectOption('raichu'))

    expect(result.current.canCompare).toBe(true)
    expect(result.current.displayNameA).toBe('pikachu')
    expect(result.current.displayNameB).toBe('raichu')

    const hpRow = result.current.statRows.find((row) => row.stat === 'hp')
    expect(hpRow).toMatchObject({ label: 'HP', valueA: 35, valueB: 60, winner: 'B' })

    const attackRow = result.current.statRows.find((row) => row.stat === 'attack')
    expect(attackRow.winner).toBeNull()
  })

  it('marks slot A as the winner when it has the higher value, and defaults a missing stat to 0', () => {
    const strongPikachu = {
      name: 'pikachu',
      types: ['electric'],
      stats: [{ name: 'hp', value: 35 }], // sin el resto de STAT_ORDER a propósito
    }
    const weakRaichu = { name: 'raichu', types: ['electric'], stats: buildStats(10) }
    useGetPokemonDetailQuery.mockImplementation((name) => {
      if (name === 'pikachu') return { data: strongPikachu, isLoading: false }
      if (name === 'raichu') return { data: weakRaichu, isLoading: false }
      return { data: undefined, isLoading: false }
    })
    const { result } = renderVersus()

    act(() => result.current.slotA.onSelectOption('pikachu'))
    act(() => result.current.slotB.onSelectOption('raichu'))

    const hpRow = result.current.statRows.find((row) => row.stat === 'hp')
    expect(hpRow).toMatchObject({ valueA: 35, valueB: 10, winner: 'A' })

    const attackRow = result.current.statRows.find((row) => row.stat === 'attack')
    expect(attackRow).toMatchObject({ valueA: 0, valueB: 50, winner: 'B' })
  })

  it('picks two distinct Pokémon via onRandomize', () => {
    useGetPokemonDetailQuery.mockImplementation((name) => ({
      data: indexFixture.some((entry) => entry.name === name)
        ? { name, types: ['normal'], stats: buildStats(50) }
        : undefined,
      isLoading: false,
    }))
    const originalRandom = Math.random
    Math.random = vi.fn().mockReturnValue(0)
    const { result } = renderVersus()

    act(() => result.current.onRandomize())

    expect(result.current.slotA.query).toBe('pikachu')
    expect(result.current.slotB.query).toBe('raichu')
    expect(result.current.canCompare).toBe(true)

    Math.random = originalRandom
  })

  it('refetches the index when randomizing without cached data, then picks once it loads', async () => {
    const freshIndex = [
      { name: 'pikachu', id: 25 },
      { name: 'raichu', id: 26 },
    ]
    const refetch = vi.fn(() => ({ unwrap: () => Promise.resolve(freshIndex) }))
    useGetPokemonIndexQuery.mockReturnValue({ data: [], isError: false, refetch })
    useGetPokemonDetailQuery.mockImplementation((name) => ({
      data: freshIndex.some((entry) => entry.name === name)
        ? { name, types: ['normal'], stats: buildStats(50) }
        : undefined,
      isLoading: false,
    }))
    const originalRandom = Math.random
    Math.random = vi.fn().mockReturnValue(0)
    const { result } = renderVersus()

    await act(async () => {
      result.current.onRandomize()
    })

    expect(refetch).toHaveBeenCalled()
    expect(result.current.slotA.query).toBe('pikachu')
    expect(result.current.slotB.query).toBe('raichu')

    Math.random = originalRandom
  })

  it('exposes isRandomizing while the randomize refetch is in flight', async () => {
    let resolveUnwrap
    const unwrapPromise = new Promise((resolve) => {
      resolveUnwrap = resolve
    })
    const refetch = vi.fn(() => ({ unwrap: () => unwrapPromise }))
    useGetPokemonIndexQuery.mockReturnValue({ data: [], isError: false, refetch })
    const { result } = renderVersus()

    expect(result.current.isRandomizing).toBe(false)

    act(() => {
      result.current.onRandomize()
    })
    expect(result.current.isRandomizing).toBe(true)

    await act(async () => {
      resolveUnwrap([])
      await unwrapPromise
    })
    expect(result.current.isRandomizing).toBe(false)
  })

  it('surfaces the index error and a working retry', () => {
    const refetch = vi.fn()
    useGetPokemonIndexQuery.mockReturnValue({
      data: undefined,
      isError: true,
      refetch,
    })
    const { result } = renderVersus()

    expect(result.current.isError).toBe(true)

    act(() => result.current.onRetry())

    expect(refetch).toHaveBeenCalled()
  })

  it('exposes the index loading state', () => {
    useGetPokemonIndexQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    })
    const { result } = renderVersus()

    expect(result.current.isLoading).toBe(true)
  })

  it('hydrates both picks from the URL query params on load', () => {
    useGetPokemonDetailQuery.mockImplementation((name) => {
      if (name === 'pikachu') return { data: pikachuDetail, isLoading: false }
      if (name === 'raichu') return { data: raichuDetail, isLoading: false }
      return { data: undefined, isLoading: false }
    })
    const { result } = renderVersus('/versus?a=pikachu&b=raichu')

    expect(result.current.slotA.query).toBe('pikachu')
    expect(result.current.slotB.query).toBe('raichu')
    expect(result.current.canCompare).toBe(true)
  })

  it('ignores unknown names in the URL', () => {
    const { result } = renderVersus('/versus?a=missingno&b=charmander')

    expect(result.current.slotA.query).toBe('')
    expect(result.current.slotB.query).toBe('charmander')
  })

  it('ignores the second URL pick when it duplicates the first', () => {
    const { result } = renderVersus('/versus?a=pikachu&b=pikachu')

    expect(result.current.slotA.query).toBe('pikachu')
    expect(result.current.slotB.query).toBe('')
  })

  it('writes the confirmed picks back to the URL when they change', () => {
    const { result } = renderVersus()

    act(() => result.current.slotA.onSelectOption('pikachu'))
    expect(currentLocation.search).toContain('a=pikachu')

    act(() => result.current.slotB.onSelectOption('raichu'))
    expect(currentLocation.search).toContain('a=pikachu')
    expect(currentLocation.search).toContain('b=raichu')

    act(() => result.current.slotA.onQueryChange('pik'))
    expect(currentLocation.search).not.toContain('a=pikachu')
    expect(currentLocation.search).toContain('b=raichu')
  })
})
