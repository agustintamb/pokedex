import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createTestStore } from '@/test/render'
import { MAX_TEAM_SIZE } from '@/store/slices/favorites.slice'
import { useFavoriteToggle } from './useFavoriteToggle'

const wrapper =
  (store) =>
  ({ children }) => <Provider store={store}>{children}</Provider>

describe('useFavoriteToggle', () => {
  it('opens the add-to-team modal when not yet a favorite', () => {
    const store = createTestStore()
    const { result } = renderHook(() => useFavoriteToggle({ id: 25, name: 'pikachu' }), {
      wrapper: wrapper(store),
    })

    expect(result.current.isFavorite).toBe(false)
    act(() => result.current.handleToggleClick())
    expect(result.current.isModalOpen).toBe(true)
    expect(result.current.modalMessage).toBe('Add pikachu to your team?')
  })

  it('confirming adds the favorite and shows a success snackbar', () => {
    const store = createTestStore()
    const { result } = renderHook(() => useFavoriteToggle({ id: 25, name: 'pikachu' }), {
      wrapper: wrapper(store),
    })

    act(() => result.current.handleToggleClick())
    act(() => result.current.handleConfirm())

    expect(store.getState().favorites.entries).toEqual([{ id: 25, name: 'pikachu' }])
    expect(store.getState().ui.snackbars[0]).toMatchObject({ variant: 'success' })
    expect(result.current.isModalOpen).toBe(false)
  })

  it('cancelling closes the modal without dispatching anything', () => {
    const store = createTestStore()
    const { result } = renderHook(() => useFavoriteToggle({ id: 25, name: 'pikachu' }), {
      wrapper: wrapper(store),
    })

    act(() => result.current.handleToggleClick())
    act(() => result.current.handleCancel())

    expect(result.current.isModalOpen).toBe(false)
    expect(store.getState().favorites.entries).toEqual([])
  })

  it('shows an error snackbar without opening the modal when the team is full', () => {
    const fullEntries = Array.from({ length: MAX_TEAM_SIZE }, (_, index) => ({
      id: index,
      name: `mon-${index}`,
    }))
    const store = createTestStore({ favorites: { entries: fullEntries } })
    const { result } = renderHook(() => useFavoriteToggle({ id: 999, name: 'mewtwo' }), {
      wrapper: wrapper(store),
    })

    act(() => result.current.handleToggleClick())

    expect(result.current.isModalOpen).toBe(false)
    expect(store.getState().ui.snackbars[0]).toMatchObject({ variant: 'error' })
  })

  it('opens the remove modal when already a favorite, and confirming removes it', () => {
    const store = createTestStore({
      favorites: { entries: [{ id: 25, name: 'pikachu' }] },
    })
    const { result } = renderHook(() => useFavoriteToggle({ id: 25, name: 'pikachu' }), {
      wrapper: wrapper(store),
    })

    expect(result.current.isFavorite).toBe(true)
    act(() => result.current.handleToggleClick())
    expect(result.current.modalMessage).toBe('Remove pikachu from your team?')

    act(() => result.current.handleConfirm())
    expect(store.getState().favorites.entries).toEqual([])
    expect(store.getState().ui.snackbars[0]).toMatchObject({ variant: 'info' })
  })
})
