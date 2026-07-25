import { pokeApi } from '@/api/pokeApi'

// refetchOnReconnect solo refresca las queries con un componente montado. Las listas que
// quedaron en cache sin suscriptores se seguirían sirviendo hasta 24 h (keepUnusedDataFor);
// invalidar el tag las borra para que la próxima pantalla que las use las vuelva a pedir.
export const refreshListsOnReconnect = (dispatch) => {
  const handleOnline = () => dispatch(pokeApi.util.invalidateTags(['PokemonList']))
  window.addEventListener('online', handleOnline)
  return () => window.removeEventListener('online', handleOnline)
}
