import { Skeleton } from '@/components/Skeleton'
import { TypeBadge } from '@/components/TypeBadge'
import { usePokemonCard } from './usePokemonCard'
import { Card, SpriteWrapper, Sprite, Number, Name, Badges } from './PokemonCard.styles'

export const PokemonCard = ({ name, id }) => {
  const { spriteUrl, types, isLoadingTypes, isImageLoaded, handleImageLoad } =
    usePokemonCard({
      name,
      id,
    })

  return (
    <Card to={`/pokemon/${name}`}>
      <SpriteWrapper>
        {!isImageLoaded && <Skeleton $inset />}
        <Sprite
          src={spriteUrl}
          alt={name}
          loading="lazy"
          onLoad={handleImageLoad}
          $isLoaded={isImageLoaded}
        />
      </SpriteWrapper>
      <Number>#{String(id).padStart(3, '0')}</Number>
      <Name>{name}</Name>
      <Badges>
        {isLoadingTypes ? (
          <Skeleton $width="48px" $height="20px" />
        ) : (
          types.map((type) => <TypeBadge key={type} type={type} />)
        )}
      </Badges>
    </Card>
  )
}
