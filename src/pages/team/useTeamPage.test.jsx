import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createTestStore } from '@/test/render'
import { MAX_TEAM_SIZE } from '@/store/slices/favorites.slice'
import { useTeamPage } from './useTeamPage'

const wrapper =
  (store) =>
  ({ children }) => <Provider store={store}>{children}</Provider>

const twoFavorites = [
  { id: 25, name: 'pikachu' },
  { id: 4, name: 'charmander' },
]

describe('useTeamPage', () => {
  it('reports empty with 6 null slots when there are no favorites', () => {
    const store = createTestStore()
    const { result } = renderHook(() => useTeamPage(), { wrapper: wrapper(store) })

    expect(result.current.isEmpty).toBe(true)
    expect(result.current.slots).toEqual(Array(MAX_TEAM_SIZE).fill(null))
    expect(result.current.maxTeamSize).toBe(MAX_TEAM_SIZE)
  })

  it('fills slots with favorites and pads the rest with null', () => {
    const store = createTestStore({ favorites: { entries: twoFavorites } })
    const { result } = renderHook(() => useTeamPage(), { wrapper: wrapper(store) })

    expect(result.current.isEmpty).toBe(false)
    expect(result.current.slots).toEqual([...twoFavorites, null, null, null, null])
  })

  it('configures a pointer and a keyboard sensor', () => {
    const store = createTestStore()
    const { result } = renderHook(() => useTeamPage(), { wrapper: wrapper(store) })

    expect(result.current.sensors).toHaveLength(2)
  })

  it('toggles the chart open state', () => {
    const store = createTestStore()
    const { result } = renderHook(() => useTeamPage(), { wrapper: wrapper(store) })

    expect(result.current.isChartOpen).toBe(false)
    act(() => result.current.handleToggleChart())
    expect(result.current.isChartOpen).toBe(true)
    act(() => result.current.handleToggleChart())
    expect(result.current.isChartOpen).toBe(false)
  })

  describe('handleDragEnd', () => {
    it('reorders favorites when dropped onto another slot', () => {
      const store = createTestStore({ favorites: { entries: twoFavorites } })
      const { result } = renderHook(() => useTeamPage(), { wrapper: wrapper(store) })

      act(() => result.current.handleDragEnd({ active: { id: 25 }, over: { id: 4 } }))

      expect(store.getState().favorites.entries).toEqual([
        { id: 4, name: 'charmander' },
        { id: 25, name: 'pikachu' },
      ])
    })

    it('does nothing when dropped outside any droppable', () => {
      const store = createTestStore({ favorites: { entries: twoFavorites } })
      const { result } = renderHook(() => useTeamPage(), { wrapper: wrapper(store) })

      act(() => result.current.handleDragEnd({ active: { id: 25 }, over: null }))

      expect(store.getState().favorites.entries).toEqual(twoFavorites)
    })

    it('does nothing when dropped onto itself', () => {
      const store = createTestStore({ favorites: { entries: twoFavorites } })
      const { result } = renderHook(() => useTeamPage(), { wrapper: wrapper(store) })

      act(() => result.current.handleDragEnd({ active: { id: 25 }, over: { id: 25 } }))

      expect(store.getState().favorites.entries).toEqual(twoFavorites)
    })

    it('does nothing when the dragged id is unknown', () => {
      const store = createTestStore({ favorites: { entries: twoFavorites } })
      const { result } = renderHook(() => useTeamPage(), { wrapper: wrapper(store) })

      act(() => result.current.handleDragEnd({ active: { id: 999 }, over: { id: 4 } }))

      expect(store.getState().favorites.entries).toEqual(twoFavorites)
    })
  })
})
