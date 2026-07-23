import { useState } from 'react'
import { useGetPokemonDetailQuery } from '@/api/pokeApi'
import { getSpriteUrl } from '@/utils/pokemon-url'

// Recuerda qué sprites ya cargaron esta sesión, para no mostrar el skeleton de nuevo
// cuando una card se remonta (ej: volver del detalle) con una imagen que el browser
// ya tiene cacheada.
const loadedSprites = new Set()

export const usePokemonCard = ({ name, id }) => {
  const spriteUrl = getSpriteUrl(id)
  const [isImageLoaded, setIsImageLoaded] = useState(() => loadedSprites.has(spriteUrl))
  const { data: detail, isLoading } = useGetPokemonDetailQuery(name)

  const types = detail?.types ?? []

  const handleImageLoad = () => {
    loadedSprites.add(spriteUrl)
    setIsImageLoaded(true)
  }

  return {
    spriteUrl,
    dexNumber: `N.º ${String(id).padStart(3, '0')}`,
    types,
    isLoadingTypes: isLoading,
    isImageLoaded,
    handleImageLoad,
  }
}
