import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = {
  // 'idle': todavía no hubo ningún fetch real esta sesión (lo que se ve viene de la cache)
  dataSource: 'idle',
  snackbars: [],
}

// String literal (no `${pokeApi.reducerPath}/...`) a propósito: importar pokeApi acá lo
// arrastraría a cada test que usa test/render.jsx y rompe los mocks parciales del módulo
const POKE_API_FULFILLED = 'pokeApi/executeQuery/fulfilled'

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
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => action.type === POKE_API_FULFILLED,
      (state) => {
        state.dataSource = 'fetched'
      },
    )
  },
})

export const { showSnackbar, dismissSnackbar } = uiSlice.actions
export const uiReducer = uiSlice.reducer

export const selectSnackbars = (state) => state.ui.snackbars
export const selectDataSource = (state) => state.ui.dataSource
