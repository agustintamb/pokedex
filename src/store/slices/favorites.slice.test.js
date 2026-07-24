import { describe, it, expect } from 'vitest'
import {
  favoritesReducer,
  addFavorite,
  removeFavorite,
  reorderFavorites,
  selectFavorites,
  selectFavoritesCount,
  selectIsFavorite,
  MAX_TEAM_SIZE,
} from './favorites.slice'

const buildState = (entries = []) => ({ entries })

describe('addFavorite', () => {
  it('adds a new entry', () => {
    const state = favoritesReducer(buildState(), addFavorite({ id: 25, name: 'pikachu' }))
    expect(state.entries).toEqual([{ id: 25, name: 'pikachu' }])
  })

  it('ignores a duplicate id', () => {
    const state = favoritesReducer(
      buildState([{ id: 25, name: 'pikachu' }]),
      addFavorite({ id: 25, name: 'pikachu' }),
    )
    expect(state.entries).toHaveLength(1)
  })

  it('ignores adding past MAX_TEAM_SIZE', () => {
    const full = buildState(
      Array.from({ length: MAX_TEAM_SIZE }, (_, index) => ({
        id: index,
        name: `mon-${index}`,
      })),
    )
    const state = favoritesReducer(full, addFavorite({ id: 999, name: 'extra' }))
    expect(state.entries).toHaveLength(MAX_TEAM_SIZE)
  })
})

describe('removeFavorite', () => {
  it('removes an entry by id', () => {
    const state = favoritesReducer(
      buildState([
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
      ]),
      removeFavorite(1),
    )
    expect(state.entries).toEqual([{ id: 2, name: 'b' }])
  })

  it('is a no-op when the id is not present', () => {
    const initial = buildState([{ id: 1, name: 'a' }])
    const state = favoritesReducer(initial, removeFavorite(999))
    expect(state.entries).toEqual([{ id: 1, name: 'a' }])
  })
})

describe('reorderFavorites', () => {
  const entries = [
    { id: 1, name: 'a' },
    { id: 2, name: 'b' },
    { id: 3, name: 'c' },
  ]

  it('moves an entry forward', () => {
    const state = favoritesReducer(
      buildState(entries),
      reorderFavorites({ from: 0, to: 2 }),
    )
    expect(state.entries.map((entry) => entry.id)).toEqual([2, 3, 1])
  })

  it('moves an entry backward', () => {
    const state = favoritesReducer(
      buildState(entries),
      reorderFavorites({ from: 2, to: 0 }),
    )
    expect(state.entries.map((entry) => entry.id)).toEqual([3, 1, 2])
  })

  it('is a no-op when from equals to', () => {
    const state = favoritesReducer(
      buildState(entries),
      reorderFavorites({ from: 1, to: 1 }),
    )
    expect(state.entries).toEqual(entries)
  })

  it('is a no-op for out-of-bounds indices', () => {
    const state = favoritesReducer(
      buildState(entries),
      reorderFavorites({ from: 0, to: 10 }),
    )
    expect(state.entries).toEqual(entries)
  })
})

describe('selectors', () => {
  const entries = [
    { id: 1, name: 'a' },
    { id: 2, name: 'b' },
  ]

  it('selectFavorites returns the entries array', () => {
    expect(selectFavorites({ favorites: buildState(entries) })).toEqual(entries)
  })

  it('selectFavoritesCount returns the length', () => {
    expect(selectFavoritesCount({ favorites: buildState(entries) })).toBe(2)
  })

  it('selectIsFavorite reflects membership', () => {
    expect(selectIsFavorite({ favorites: buildState(entries) }, 1)).toBe(true)
    expect(selectIsFavorite({ favorites: buildState(entries) }, 999)).toBe(false)
  })
})
