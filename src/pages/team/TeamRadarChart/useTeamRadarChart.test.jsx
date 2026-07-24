import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createTestStore } from '@/test/render'
import { useGetPokemonDetailsQuery } from '@/api/pokeApi'
import { useTeamRadarChart } from './useTeamRadarChart'

vi.mock('@/api/pokeApi', () => ({
  useGetPokemonDetailsQuery: vi.fn(),
}))

const wrapper =
  (store) =>
  ({ children }) => <Provider store={store}>{children}</Provider>

describe('useTeamRadarChart', () => {
  beforeEach(() => {
    useGetPokemonDetailsQuery.mockReturnValue({ data: undefined, isLoading: true })
  })

  it('queries the detail of every favorited name', () => {
    const store = createTestStore({
      favorites: { entries: [{ id: 25, name: 'pikachu' }] },
    })
    renderHook(() => useTeamRadarChart(), { wrapper: wrapper(store) })

    expect(useGetPokemonDetailsQuery).toHaveBeenCalledWith(['pikachu'], { skip: false })
  })

  it('skips the query when there are no favorites', () => {
    const store = createTestStore()
    renderHook(() => useTeamRadarChart(), { wrapper: wrapper(store) })

    expect(useGetPokemonDetailsQuery).toHaveBeenCalledWith([], { skip: true })
  })

  it('builds chart data and a colored series once details resolve', () => {
    useGetPokemonDetailsQuery.mockReturnValue({
      data: [
        { name: 'pikachu', types: ['electric'], stats: [{ name: 'hp', value: 35 }] },
      ],
      isLoading: false,
    })
    const store = createTestStore({
      favorites: { entries: [{ id: 25, name: 'pikachu' }] },
    })
    const { result } = renderHook(() => useTeamRadarChart(), { wrapper: wrapper(store) })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.series).toEqual([{ name: 'pikachu', color: '#F8D030' }])
    expect(result.current.chartData.find((entry) => entry.stat === 'hp').average).toBe(35)
  })

  it('toggles a name in and out of visibleNames', () => {
    const store = createTestStore({
      favorites: { entries: [{ id: 25, name: 'pikachu' }] },
    })
    const { result } = renderHook(() => useTeamRadarChart(), { wrapper: wrapper(store) })

    expect(result.current.visibleNames).toEqual([])
    act(() => result.current.handleToggle('pikachu'))
    expect(result.current.visibleNames).toEqual(['pikachu'])
    act(() => result.current.handleToggle('pikachu'))
    expect(result.current.visibleNames).toEqual([])
  })
})
