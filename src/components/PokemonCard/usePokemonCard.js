import { useState } from 'react'
import { useGetPokemonDetailQuery } from '@/api/pokeApi'
import { formatDexNumber } from '@/utils/format-stats'
import { getSpriteUrl } from '@/utils/pokemon-url'

// Sprites ya cargados esta sesión -> evita re-mostrar el skeleton al remontar una card
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
    dexNumber: formatDexNumber(id),
    types,
    isLoadingTypes: isLoading,
    isImageLoaded,
    handleImageLoad,
  }
}
