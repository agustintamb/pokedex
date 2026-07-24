import { describe, it, expect } from 'vitest'
import { store, persistor } from './index'

describe('store', () => {
  it('combines the expected top-level slices with their initial state', () => {
    const state = store.getState()
    expect(state.favorites.entries).toEqual([])
    expect(state.ui.snackbars).toEqual([])
    expect(state.pokeApi).toBeDefined()
  })

  it('creates a persistor for the store', () => {
    expect(persistor).toBeDefined()
    expect(typeof persistor.persist).toBe('function')
  })
})
