import { Skeleton } from '@/components/Skeleton'
import { TypeBadge } from '@/components/TypeBadge'
import { usePokemonCard } from './usePokemonCard'
import {
  Card,
  SpriteWrapper,
  Sprite,
  Dots,
  DexNumber,
  Name,
  Badges,
} from './PokemonCard.styles'

export const PokemonCard = ({ name, id }) => {
  const { spriteUrl, dexNumber, types, isLoadingTypes, isImageLoaded, handleImageLoad } =
    usePokemonCard({
      name,
      id,
    })

  return (
    <Card to={`/pokemon/${name}`}>
      <Dots />
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
      <DexNumber>{dexNumber}</DexNumber>
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
