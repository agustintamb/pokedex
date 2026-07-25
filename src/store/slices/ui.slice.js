import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = {
  // 'idle': todavía no se completó ningún fetch real esta sesión (lo que se ve, si hay
  // algo, viene de redux-persist). 'fetched': al menos un fetch de red se completó.
  dataSource: 'idle',
  snackbars: [],
}

// Nombre de acción único para TODAS las queries de pokeApi (no una por endpoint) — condition()
// de RTK Query hace que un cache-hit (dato ya fresco, sin red) directamente no dispare ninguna
// acción, así que ver este fulfilled acá significa, sin ambigüedad, que sí hubo una request real.
// String literal (no `${pokeApi.reducerPath}/...`) a propósito: importar pokeApi acá lo
// arrastraría a cada test que usa test/render.jsx, rompiendo cualquier mock parcial de
// '@/api/pokeApi' que no incluya ese export (ver PokemonCard.test.jsx y similares).
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
