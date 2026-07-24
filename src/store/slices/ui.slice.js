import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = {
  snackbars: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showSnackbar: {
      reducer: (state, action) => {
        state.snackbars.push(action.payload)
      },
      prepare: ({ variant, message }) => ({
        payload: { id: nanoid(), variant, message },
      }),
    },
    dismissSnackbar: (state, action) => {
      state.snackbars = state.snackbars.filter(
        (snackbar) => snackbar.id !== action.payload,
      )
    },
  },
})

export const { showSnackbar, dismissSnackbar } = uiSlice.actions
export const uiReducer = uiSlice.reducer

export const selectSnackbars = (state) => state.ui.snackbars
