import { createSlice } from '@reduxjs/toolkit'

export const MAX_TEAM_SIZE = 6

const initialState = {
  entries: [],
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const { id, name } = action.payload
      if (state.entries.length >= MAX_TEAM_SIZE) return
      if (state.entries.some((entry) => entry.id === id)) return
      state.entries.push({ id, name })
    },
    removeFavorite: (state, action) => {
      state.entries = state.entries.filter((entry) => entry.id !== action.payload)
    },
    reorderFavorites: (state, action) => {
      const { from, to } = action.payload
      if (from === to) return
      if (
        from < 0 ||
        to < 0 ||
        from >= state.entries.length ||
        to >= state.entries.length
      )
        return
      const [moved] = state.entries.splice(from, 1)
      state.entries.splice(to, 0, moved)
    },
  },
})

export const { addFavorite, removeFavorite, reorderFavorites } = favoritesSlice.actions
export const favoritesReducer = favoritesSlice.reducer

export const selectFavorites = (state) => state.favorites.entries
export const selectFavoritesCount = (state) => state.favorites.entries.length
export const selectIsFavorite = (state, id) =>
  state.favorites.entries.some((entry) => entry.id === id)
