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
  },
})

export const { addFavorite, removeFavorite } = favoritesSlice.actions
export const favoritesReducer = favoritesSlice.reducer

export const selectFavorites = (state) => state.favorites.entries
export const selectFavoritesCount = (state) => state.favorites.entries.length
export const selectIsFavorite = (state, id) =>
  state.favorites.entries.some((entry) => entry.id === id)
