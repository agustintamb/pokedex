import { useState } from 'react'
import { useGetPokemonDetailQuery } from '@/api/pokeApi'
import { getSpriteUrl } from '@/utils/pokemon-url'

export const usePokemonCard = ({ name, id }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const { data: detail, isLoading } = useGetPokemonDetailQuery(name)

  const types = detail?.types ?? []

  const handleImageLoad = () => setIsImageLoaded(true)

  return {
    spriteUrl: getSpriteUrl(id),
    types,
    isLoadingTypes: isLoading,
    isImageLoaded,
    handleImageLoad,
  }
}
