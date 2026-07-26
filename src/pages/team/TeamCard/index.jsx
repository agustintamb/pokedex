import { FavoriteToggle } from '@/components/FavoriteToggle'
import { Modal } from '@/components/Modal'
import { Tooltip } from '@/components/Tooltip'
import { useAnimatedSprite } from '@/hooks/useAnimatedSprite'
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle'
import { Card, FavoriteSlot, Stage, Sprite, Name } from './TeamCard.styles'

export const TeamCard = ({ id, name }) => {
  const sprite = useAnimatedSprite(id)
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
      <Card>
        <Stage>
          <Sprite
            src={sprite.src}
            alt={name}
            onError={sprite.onError}
            $isStatic={sprite.isStatic}
          />
        </Stage>
        <Name to={`/pokemon/${name}`}>{name}</Name>

        <FavoriteSlot>
          <Tooltip label="Remove from team">
            <FavoriteToggle
              isFavorite={isFavorite}
              onClick={handleToggleClick}
              name={name}
            />
          </Tooltip>
        </FavoriteSlot>
      </Card>

      <Modal
        isOpen={isModalOpen}
        message={modalMessage}
        confirmLabel="Remove"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  )
}
