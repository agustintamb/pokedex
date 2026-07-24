import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useGetPokemonDetailQuery } from '@/api/pokeApi'
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle'

const SHAPE_ENTRIES = [
  { key: 'front', label: 'Front', normalKey: 'front', shinyKey: 'frontShiny' },
  { key: 'back', label: 'Back', normalKey: 'back', shinyKey: 'backShiny' },
  {
    key: 'frontFemale',
    label: 'Female',
    normalKey: 'frontFemale',
    shinyKey: 'frontShinyFemale',
  },
  {
    key: 'backFemale',
    label: 'Back (female)',
    normalKey: 'backFemale',
    shinyKey: 'backShinyFemale',
  },
]

const getSpriteEntries = (sprites, isShiny) =>
  SHAPE_ENTRIES.map(({ key, label, normalKey, shinyKey }) => {
    const normalSrc = sprites[normalKey]
    const shinySrc = sprites[shinyKey]
    return { key, label, src: isShiny && shinySrc ? shinySrc : normalSrc }
  }).filter((entry) => entry.src)

const getArtworkSrc = (sprites, isShiny) => {
  if (isShiny && sprites.artworkShiny) return sprites.artworkShiny
  return sprites.artwork ?? sprites.front
}

export const useDetailPage = () => {
  const { name } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: detail, isLoading, isError, refetch } = useGetPokemonDetailQuery(name)
  const [isAbilitiesOpen, setIsAbilitiesOpen] = useState(true)
  const [isMeasurementsOpen, setIsMeasurementsOpen] = useState(true)
  const favorite = useFavoriteToggle({ id: detail?.id, name: detail?.name })

  const isShiny = searchParams.get('shiny') === 'true'
  const spriteEntries = detail ? getSpriteEntries(detail.sprites, isShiny) : []
  const selectedSprite =
    spriteEntries.find((entry) => entry.key === searchParams.get('sprite')) ??
    spriteEntries[0]
  const artworkSrc = detail ? getArtworkSrc(detail.sprites, isShiny) : null

  const handleRetry = () => refetch()
  const handleToggleAbilities = () => setIsAbilitiesOpen((current) => !current)
  const handleToggleMeasurements = () => setIsMeasurementsOpen((current) => !current)

  const handleToggleShiny = () => {
    setSearchParams(
      (params) => {
        const next = new URLSearchParams(params)
        if (isShiny) next.delete('shiny')
        else next.set('shiny', 'true')
        return next
      },
      { replace: true },
    )
  }

  const handleSelectSprite = (key) => {
    setSearchParams(
      (params) => {
        const next = new URLSearchParams(params)
        next.set('sprite', key)
        return next
      },
      { replace: true },
    )
  }

  return {
    detail,
    isLoading,
    isError,
    handleRetry,
    ...favorite,
    artworkSrc,
    spriteEntries,
    selectedSprite,
    handleSelectSprite,
    isShiny,
    handleToggleShiny,
    isAbilitiesOpen,
    handleToggleAbilities,
    isMeasurementsOpen,
    handleToggleMeasurements,
  }
}
