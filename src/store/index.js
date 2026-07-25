import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { pokeApi } from '@/api/pokeApi'
import { favoritesReducer } from '@/store/slices/favorites.slice'
import { uiReducer } from '@/store/slices/ui.slice'

const persistConfig = {
  key: 'pokedex',
  storage,
  whitelist: [pokeApi.reducerPath, 'favorites'],
}

const rootReducer = combineReducers({
  [pokeApi.reducerPath]: pokeApi.reducer,
  favorites: favoritesReducer,
  ui: uiReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 128 },
      serializableCheck: {
        warnAfter: 128,
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(pokeApi.middleware),
})

export const persistor = persistStore(store)

setupListeners(store.dispatch)
