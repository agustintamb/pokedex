import { FavoriteToggle } from '@/components/FavoriteToggle'
import { Modal } from '@/components/Modal'
import { Skeleton } from '@/components/Skeleton'
import { Tooltip } from '@/components/Tooltip'
import { TypeBadge } from '@/components/TypeBadge'
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle'
import { usePokemonCard } from './usePokemonCard'
import {
  Card,
  SpriteWrapper,
  Sprite,
  Dots,
  MetaRow,
  FavoriteSlot,
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
  const {
    isFavorite,
    isModalOpen,
    modalMessage,
    handleToggleClick,
    handleConfirm,
    handleCancel,
  } = useFavoriteToggle({ id, name })

  return (
    <>
      <Card to={`/pokemon/${name}`}>
        <Dots />
        <SpriteWrapper $isFavorite={isFavorite}>
          {!isImageLoaded && <Skeleton $inset />}
          <Sprite
            src={spriteUrl}
            alt={name}
            loading="lazy"
            onLoad={handleImageLoad}
            $isLoaded={isImageLoaded}
          />
        </SpriteWrapper>
        <MetaRow>
          <DexNumber>{dexNumber}</DexNumber>
          <FavoriteSlot>
            <Tooltip label={isFavorite ? 'Remove from team' : 'Add to team'}>
              <FavoriteToggle
                isFavorite={isFavorite}
                onClick={handleToggleClick}
                name={name}
              />
            </Tooltip>
          </FavoriteSlot>
        </MetaRow>
        <Name>{name}</Name>
        <Badges>
          {isLoadingTypes ? (
            <Skeleton $width="48px" $height="20px" />
          ) : (
            types.map((type) => <TypeBadge key={type} type={type} />)
          )}
        </Badges>
      </Card>

      <Modal
        isOpen={isModalOpen}
        message={modalMessage}
        confirmLabel={isFavorite ? 'Remove' : 'Add'}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  )
}
