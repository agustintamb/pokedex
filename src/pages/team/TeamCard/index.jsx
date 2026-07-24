import { useState } from 'react'
import { FavoriteToggle } from '@/components/FavoriteToggle'
import { Modal } from '@/components/Modal'
import { Tooltip } from '@/components/Tooltip'
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle'
import { getAnimatedSpriteUrl, getSpriteUrl } from '@/utils/pokemon-url'
import { Card, FavoriteSlot, Stage, Sprite, Name } from './TeamCard.styles'

export const TeamCard = ({ id, name }) => {
  const [hasAnimatedError, setHasAnimatedError] = useState(false)
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
            src={hasAnimatedError ? getSpriteUrl(id) : getAnimatedSpriteUrl(id)}
            alt={name}
            onError={() => setHasAnimatedError(true)}
            $isStatic={hasAnimatedError}
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
